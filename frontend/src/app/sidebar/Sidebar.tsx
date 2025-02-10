import { FC } from "react"
import { useDatabase } from "../database.store";


export const SideBar: FC = () => {

    const { 
        databaseType, databasesList, 
        selectedDatabase, selectDatabase, 
        selectedDatabaseTables, selectTable
    } = useDatabase();

    return (
        <div className="component" style={{
            padding: '10px',
            borderRadius: 0,
            minHeight: '100dvh',
            gap: '7px'
        }}>
            <p>Database type: {databaseType}</p>

            <br></br>
            { databasesList.map((db) => (
                <button className="button flex-start" key={db}
                title={db} onClick={() => selectDatabase(db)}>
                    <p>{db}</p>
                </button>
            )) }

            <hr style={{ margin: '15px 0'}}></hr>
            { selectedDatabase && <p>Tables:</p> }
            { selectedDatabaseTables?.map(table => (
                <button className="button flex-start" key={table}
                title={table} onClick={() => selectTable(table)}>
                    <p>{table}</p>
                </button>
            )) }
        </div>
    );
}