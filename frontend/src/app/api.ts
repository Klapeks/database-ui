import axios from "axios";

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


let _dbType: DatabaseType | undefined;
export function getDatabaseType(): DatabaseType {
    if (!_dbType) throw "No db type";
    return _dbType;
}


export async function loadDatabaseType() {
    const res = await axios.get('/api/database-ui/api/database-type');
    _dbType = res.data.type;
    return _dbType;
}
export async function runSQL<T = any>(sql: string, params?: any[]): Promise<T> {
    if (!_dbType) throw "No db type";
    const res = await axios.post('/api/database-ui/api/sql', { sql, params });
    return res.data.data;
}

export default api;