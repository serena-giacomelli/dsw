/* de mysql*/
import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'lasLindas' ,
    password: process.env.DB_PASSWORD ||  'Resentidas3' ,
    database: process.env.DB_NAME || 'muebles',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
})