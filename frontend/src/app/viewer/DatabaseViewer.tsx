import { FC, useEffect, useState } from "react"
import { useDatabase } from "../database.store";
import { runSQL } from "../api";

function dataId(data: any, field?: string) {
    data = data.id || Object.values(data)[0];
    if (field) return data + '-' + field;
    return data;
}

export const DatabaseViewer: FC = () => {

    const { databaseType, selectedDatabase, selectedTable } = useDatabase();

    const [ tableSchema, setTableSchema ] = useState<any[]>();
    const [ tableData, setTableData ] = useState<any[]>();

    useEffect(() => {
        if (selectedDatabase && selectedTable) {
            runSQL(`
                SELECT * FROM information_schema.columns
                WHERE table_schema = '${selectedDatabase}' 
                AND table_name = '${selectedTable}'
            `).then((result: any[]) => {
                console.log(result.map(r => ({
                    name: r.COLUMN_NAME,
                    type: r.COLUMN_TYPE
                })));
                setTableSchema(result);
                runSQL(`
                    SELECT ${result.map(r => "`" + r.COLUMN_NAME + "`").join(', ')}
                    FROM \`${selectedDatabase}\`.\`${selectedTable}\` LIMIT 50;
                `).then(data => {
                    console.log("DATA:", data);
                    setTableData(data);
                });
            });
        }
    }, [ selectedDatabase, selectedTable ]);

    return (
        <div className="db-viewer-page"
        style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            <div className="component pad-15">{
                selectedDatabase ? (
                    selectedTable ? (
                        <p>{databaseType} / {selectedDatabase} / {selectedTable}</p>
                    ) : (<p>{databaseType} / {selectedDatabase}</p>)
                ) : (<p>{databaseType}</p>)
            }</div>

            <div className="component pad-15"
            style={{
                overflow: 'auto',
            }}>
                <table className="test-table">
                    <tr>
                        {tableSchema?.map(t => (
                            <th key={t.COLUMN_NAME}>{t.COLUMN_NAME}</th>
                        ))}
                    </tr>
                    { tableData?.map(data => (
                        <tr key={dataId(data)}>
                            { Object.keys(data).map(field => (
                                <td key={dataId(data, field)}>
                                    <p className={[
                                        data[field] === null && 'null'
                                    ].filter(Boolean).join(' ')}
                                    >{data[field] ?? 'NULL'}</p>
                                </td>
                            ))}
                        </tr>
                    )) }
                </table>
            </div>
        </div>
    );
}