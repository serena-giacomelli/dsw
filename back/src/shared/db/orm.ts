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
    debug: true,
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