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
            padding: '15px',
            borderRadius: 0,
            minHeight: '100dvh'
        }}>
            <p>Database type: {databaseType}</p>

            <br></br>
            { databasesList.map((db) => (
                <button key={db}
                onClick={() => selectDatabase(db)}>
                    <p>{db}</p>
                </button>
            )) }

            <hr style={{ margin: '15px 0'}}></hr>
            { selectedDatabaseTables?.map(table => (
                <button key={table}
                onClick={() => selectTable(table)}>
                    <p>{table}</p>
                </button>
            )) }
        </div>
    );
}