import { DatabaseOptions } from "../types";
import AbstractDatabase from "./abstract";
import mysqld, { PoolOptions } from 'mysql2';

export class MySQLDatabase extends AbstractDatabase {

    readonly pool: mysqld.Pool;
    constructor(options: DatabaseOptions) {
        super(options);
        if (options.type != 'mysql') throw "Not a mysql?";
        this.pool = mysqld.createPool({
            host: options.host,
            port: options.port,
            user: options.username,
            password: options.password,
            database: options.database,
            charset: options.charset
        });
    }

    async getConnection(): Promise<mysqld.PoolConnection> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, conn) => {
                if (err) return reject(err);
                resolve(conn);
            })
        })
    }

    public async sql(query: string, params: any[]): Promise<any> {
        const connection = await this.getConnection();
        return new Promise<any>((resolve, reject) => {
            connection.query(query, params||[], (err, result) => {
                connection.release();
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}