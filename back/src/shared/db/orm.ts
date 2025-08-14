import { MikroORM } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";


export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'bw4m9nc4ehmejlliterw',
    driver: MySqlDriver,
    clientUrl: 'mysql://uk7dzpxwohpdjgbf:biIal1uaz4YlFl735Isy@bw4m9nc4ehmejlliterw-mysql.services.clever-cloud.com',
    highlighter: new SqlHighlighter(),
    debug: false, // Cambiar a false en producción
    pool: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 30000,
        createTimeoutMillis: 3000,
        acquireTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
    },
    driverOptions: {
        connectionTimeoutMillis: 5000,
        commandTimeoutMillis: 30000,
        requestTimeoutMillis: 30000
    },
    schemaGenerator: {
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: []
    }, })

    export const syncSchema = async () => {
        const generator = orm.getSchemaGenerator()
        /*   
        await generator.dropSchema()
        await generator.createSchema()
        */
        await generator.updateSchema()
      }