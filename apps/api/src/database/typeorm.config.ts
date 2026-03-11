import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // Schema is managed via init.sql — never let TypeORM mutate the DB
    synchronize: false,
    autoLoadEntities: true,
    ssl: process.env.DB_SSL !== 'false'
        ? { rejectUnauthorized: false }
        : false,
};
