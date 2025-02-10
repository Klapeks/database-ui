import { FC, useEffect, useState } from "react";
import { runSQL } from "../api";
import styles from './table-viewer.module.scss';
import { Pagination } from "./Pagination";

interface IProps {
    database: string | undefined,
    table: string | undefined,
}

function dataKey(schema: any[], data: any) {
    let ids = [...schema].filter(c => c.COLUMN_KEY == 'PRI')
        .map(c => c.COLUMN_NAME).map(c => data[c]);
    return ids.join('-');
}

export const TableViewer: FC<IProps> = ({ database, table }) => {

    const [ tableSchema, setTableSchema ] = useState<any[]>();
    const [ tableData, setTableData ] = useState<any[]>();
    const [ tableDataCount, setTableDataCount ] = useState(0);
    const [ options, setOptions ] = useState({
        page: 1,
        limit: 100,
        orderBy: undefined as string | undefined,
        orderType: "ASC" as "ASC" | "DESC"
    })

    useEffect(() => {
        if (database && table) {
            runSQL(`
                SELECT * FROM information_schema.columns
                WHERE table_schema = '${database}' 
                AND table_name = '${table}'
            `).then((result: any[]) => {
                result = result.sort((r1, r2) => r1.ORDINAL_POSITION - r2.ORDINAL_POSITION);
                // console.log('schema after load:', result.map(t => t.COLUMN_NAME));
                setTableSchema(result);


                runSQL(`
                    SELECT COUNT(1) as count 
                    FROM \`${database}\`.\`${table}\`
                `).then(data => {
                    // console.log(data[0]?.count || data[0] || data);
                    setTableDataCount(data[0]?.count ?? data[0] ?? data)
                })
            });
        }
    }, [ database, table ]);

    useEffect(() => {
        if (!tableSchema) return;
        // console.log('schema after use-effect load:', tableSchema.map(t => t.COLUMN_NAME));
        runSQL(`
            SELECT ${tableSchema.map(r => "`" + r.COLUMN_NAME + "`").join(', ')}
            FROM \`${database}\`.\`${table}\`
            ${options.orderBy ? ('ORDER BY ' + options.orderBy + ' ' + options.orderType) : ''}
            LIMIT ${options.limit} OFFSET ${(options.page - 1) * options.limit};
        `).then(data => {
            // console.log("DATA:", data);
            setTableData(data);
        });
    }, [ tableSchema, options ]);

    const toggleSorting = (key: string) => {
        if (options.orderBy == key) {
            if (options.orderType == 'ASC') {
                options.orderType = 'DESC';
                options.orderBy = undefined;
            } else if (options.orderType == 'DESC') {
                options.orderType = 'ASC';
            }
        } else {
            options.orderBy = key;
            options.orderType = 'DESC';
        }
        setOptions({ ...options });
    }

    if (!database || !table) return null;
    if (!tableSchema) return null;

    return (
        <div className="component pad-15"
        style={{ overflow: 'auto', }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <p>Total: { tableData?.length ?? '-' } of { tableDataCount }</p>
                <Pagination page={options.page}
                setPage={(page) => setOptions({...options, page})} 
                maxPages={ Math.ceil(tableDataCount / options.limit) }/>
            </div>


            <table className={styles['table-viewer']}>
                <thead>
                    <tr>
                        <th></th>
                        {tableSchema.map(t => (
                            <th key={t.COLUMN_NAME} className="column-name">
                                <p>{t.COLUMN_NAME} {
                                    t.COLUMN_KEY == 'PRI' ? 
                                    <span style={{ fontSize: '12px' }}>🔑</span>
                                    : null
                                }</p>
                                <p className="type">{t.COLUMN_TYPE}{t.IS_NULLABLE && t.IS_NULLABLE != 'NO' ? '?' : ''}</p>
                                <button className="button sort" onClick={() => toggleSorting(t.COLUMN_NAME)}>
                                    { options.orderBy == t.COLUMN_NAME ? (
                                        options.orderType == 'DESC' ? <p>🔽</p> : <p>🔼</p>
                                    ) : <p>↕️</p> }
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    { tableData?.map(data => {
                        const priKey = database + '-' + table + '-' + dataKey(tableSchema, data);
                        return (
                            <tr key={priKey}>
                                <td className="edit-pen">✏️</td>
                                { Object.keys(data).map(field => (
                                    <td key={priKey + '-' + field}>
                                        <p className={[
                                            data[field] === null && 'null'
                                        ].filter(Boolean).join(' ')}
                                        >{data[field] ?? 'NULL'}</p>
                                    </td>
                                ))}
                            </tr>
                        )
                    }) }
                </tbody>
            </table>
        </div>
    )
}