import axios from "axios";
import { easyPassEncoder } from "../utils/easy.pass.encoder";

export type DatabaseType = "mysql" | "postgres" | "sqlite";

const api = axios.create({
    baseURL: '/api', 
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Control-Tokens': 'client'
    },
});


let _dbInfo: {
    type: DatabaseType,
    key: string
} | undefined = undefined;
export function getDatabaseType(): DatabaseType {
    if (!_dbInfo) throw "No db type";
    return _dbInfo.type;
}

const params = new URLSearchParams(window.location.search);;
export const databaseInstanceName = params.get('instanceName') || 'main';

export async function loadDatabaseType() {
    const res = await axios.get('/api/database-ui/api/database-type', {
        params: { instanceName: databaseInstanceName }
    });
    _dbInfo = res.data;
    return _dbInfo!.type;
}
export async function runSQL<T = any>(sql: string, params?: any[]): Promise<T> {
    if (!_dbInfo) throw "No db info";
    sql = easyPassEncoder.encode(sql, _dbInfo.key);
    const res = await axios.post('/api/database-ui/api/sql', { sql, params }, {
        params: { instanceName: databaseInstanceName }
    });
    return easyPassEncoder.decodeJSON(res.data.data, _dbInfo.key);
}

export default api;