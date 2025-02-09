export interface AuthDatabases {
    type: "mysql" | "postgres";
    host: string;
    port: number;
    username: string;
    password?: string;
    database: string;
    charset?: any;
}
export type DatabaseOptions = {
    type: "sqlite";
    database: string;
    charset?: string;
} | AuthDatabases;
export type DatabaseType = DatabaseOptions['type'];
