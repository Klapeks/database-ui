import { FC } from "react"
import { useDatabase } from "../database.store";
import { TableViewer } from "./TableViewer";


export const DatabaseViewer: FC = () => {

    const { databaseType, selectedDatabase, selectedTable } = useDatabase();

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

            <TableViewer key={selectedDatabase + '-' + selectedTable}
            database={selectedDatabase} table={selectedTable} />
        </div>
    );
}