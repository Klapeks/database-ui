import { FC, useEffect, useState } from "react";
import { runSQL } from "../api";


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

    useEffect(() => {
        if (database && table) {
            runSQL(`
                SELECT * FROM information_schema.columns
                WHERE table_schema = '${database}' 
                AND table_name = '${table}'
            `).then((result: any[]) => {
                console.log(result);
                setTableSchema(result);
                runSQL(`
                    SELECT ${result.map(r => "`" + r.COLUMN_NAME + "`").join(', ')}
                    FROM \`${database}\`.\`${table}\` LIMIT 50;
                `).then(data => {
                    console.log("DATA:", data);
                    setTableData(data);
                });
            });
        }
    }, [ database, table ]);

    if (!database || !table) return null;
    if (!tableSchema) return null;

    return (
        <div className="component pad-15"
        style={{ overflow: 'auto', }}>
            <table className="test-table">
                <thead>
                    <tr>
                        {tableSchema.map(t => (
                            <th key={t.COLUMN_NAME}>{t.COLUMN_NAME}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    { tableData?.map(data => {
                        const priKey = database + '-' + table + '-' + dataKey(tableSchema, data);
                        return (
                            <tr key={priKey}>
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