import { createContext, useState, useContext, FC, ReactNode } from 'react';
import { loadDatabaseType, runSQL, DatabaseType } from './api';

interface DatabaseContextType {
    databaseType: DatabaseType,
    databasesList: string[],
    loadDatabaseInfo: () => any,

    selectedDatabase: string | undefined,
    selectDatabase: (db: string) => any,
    selectedDatabaseTables: string[] | undefined,
    selectedTable: string | undefined,
    selectTable: (table: string) => any
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [databaseType, setDatabaseType] = useState<DatabaseType>();
    const [databasesList, setDatabasesList] = useState<string[]>([]);
    const [selectedDatabase, setSelectedDatabase] = useState<string>();
    const [selectedDatabaseTables, setSelectedDatabaseTables] = useState<string[]>();
    const [selectedTable, setSelectedTable] = useState<string>();

    const loadDatabaseInfo = async () => {
        const type = await loadDatabaseType();
        setDatabaseType(type);
        let dbs: any[] = await runSQL(`SHOW DATABASES`);
        dbs = dbs.map((a) => a.Database || a);
        setDatabasesList(dbs);
    }

    const selectDatabase = async (db: string) => {
        setSelectedTable(undefined);
        setSelectedDatabase(db);
        let tables: any[] = await runSQL(`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = '${db}';
        `);
        tables = tables.map(t => t.TABLE_NAME || Object.values(t)?.[0] || t);
        setSelectedDatabaseTables(tables);
    }

    const selectTable = async (table: string) => {
        setSelectedTable(table);
    }

    return (
        <DatabaseContext.Provider value={{
            databaseType: databaseType as any,
            databasesList,
            loadDatabaseInfo,
            selectedDatabase,
            selectDatabase,
            selectedDatabaseTables,
            selectedTable,
            selectTable
        }}>
            { children }
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context;
};
