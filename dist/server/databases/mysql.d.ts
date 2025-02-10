import { DatabaseOptions } from "../types";
import AbstractDatabase from "./abstract";
import mysqld from 'mysql2';
export declare class MySQLDatabase extends AbstractDatabase {
    readonly pool: mysqld.Pool;
    constructor(options: DatabaseOptions);
    getConnection(): Promise<mysqld.PoolConnection>;
    sql(query: string, params: any[]): Promise<any>;
}
