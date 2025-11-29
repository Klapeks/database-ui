import { Router } from "express";
import { DatabaseOptions } from "./types";
import AbstractDatabase from "./databases/abstract";
import mPath from 'path';
import fs from 'fs';
import express from 'express';
import { easyPassEncoder } from "./utils/easy.pass.encoder";

const databaseUI = {
    createWebRouter() {
        let webPath = mPath.join(__dirname, '../web');
        if (!fs.existsSync(webPath)) throw "No web path found :(";
        const router = Router();
        router.use(express.static(webPath));
        router.get('*', (req, res, next) => {
            if (req.url.startsWith('/api')) return next();
            return res.sendFile(mPath.join(webPath, 'index.html'));
        });
        return router;
    },
    async createApiRouter(databaseInstancesOptions: {
        [name: string]: DatabaseOptions
    }) {
        const databaseInstance = new Map<string, AbstractDatabase>();
        for (let options of Object.entries(databaseInstancesOptions)) {
            const databaseType = options[1].type;
            let database: AbstractDatabase;
            switch (databaseType) {
                case "mysql": {
                    const lib = await import('./databases/mysql');
                    database = new lib.MySQLDatabase(options[1]);
                    break;
                }
                case "sqlite": throw "No sqlite support yet";
                case "postgres": throw "No postgres support yet";
                default: throw "No database type found: " + (databaseType satisfies never)
            }
            databaseInstance.set(options[0], database);
        }
        const instanceOf = (req: any) => {
            let instanceName = req.query.instanceName || 'main';
            return databaseInstance.get(instanceName);
        }


        const router = Router();
        router.get('/database-type', (req, res) => {
            const database = instanceOf(req);
            if (!database) return res.status(404).send({
                message: "Unknown instance",
            });
            res.status(200).send({ 
                type: database.options.type,
                key: database.key
            });
        });
        router.post('/sql', async (req, res) => {
            try {
                const database = instanceOf(req);
                if (!database) throw "Unknown instance";
                if (!req.body.sql) throw "No sql field found";
                req.body.sql = easyPassEncoder.decode(req.body.sql, database.key);
                const data = await database.sql(req.body.sql, req.body.params);
                // let encoded = Array.isArray(data) 
                //     ? easyPassEncoder.encodeArray(data, database.key)
                //     : easyPassEncoder.encodeJSON(data, database.key);
                let encoded = easyPassEncoder.encodeJSON(data, database.key);;
                res.status(200).send({ data: encoded });
            } catch (err: any) {
                if (typeof err == 'string') {
                    res.status(400).send({ message: err, error: err });
                    return;
                }
                console.error("Unknown error:", err);
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