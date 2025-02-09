import { Router } from "express";
import { DatabaseOptions } from "./types";
import AbstractDatabase from "./databases/abstract";

const databaseUI = {
    createWebRouter() {
        
    },
    async createRouter(options: DatabaseOptions) {
        const databaseType = options.type;
        let database: AbstractDatabase;

        switch (databaseType) {
            case "mysql": {
                const lib = await import('./databases/mysql');
                database = new lib.MySQLDatabase(options);
                break;
            }
            case "sqlite": throw "No sqlite support yet";
            case "postgres": throw "No postgres support yet";
            default: throw "No database type found: " + (databaseType satisfies never)
        }

        const router = Router();
        router.get('/database-type', (req, res) => {
            res.status(200).send({ type: databaseType })
        });
        router.post('/sql', async (req, res) => {
            try {
                if (!req.body.sql) throw "No sql field found";
                const data = await database.sql(req.body.sql, req.body.params);
                res.status(200).send({ data });
            } catch (err: any) {
                if (typeof err == 'string') {
                    res.status(400).send({ message: err, error: err });
                    return;
                }
                res.status(500).send({
                    message: err.message || "Unknown error",
                    error: err
                })
            }
        });
        return router;
    }
}

export default databaseUI;