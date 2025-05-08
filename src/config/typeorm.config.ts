import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from './env';
import { User } from '../users/entities/users.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: env.nodeEnv === 'development',
  logging: env.nodeEnv === 'development',
  entities: [ `${__dirname}/../**/*.entity{.ts,.js}` ],
  migrations: [ `${__dirname}/../database/migrations/*{.ts,.js}` ]
};

export const AppDataSource = new DataSource(dataSourceOptions);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const initializeDataSource = async (): Promise<DataSource> => {
  if (AppDataSource.isInitialized) {
    console.log('DataSource already initialized');
    return AppDataSource;
  }

  const tryInitialize = async (retriesLeft: number): Promise<DataSource> => {
    try {
      await AppDataSource.initialize();
      console.log('Database connection established');
      return AppDataSource;
    } catch (error) {
      if (retriesLeft <= 0) {
        console.error('Maximum retries reached. Could not connect to the database.');
        throw error;
      }

      console.error(`Database connection failed (retries left: ${retriesLeft}):`, error);
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);

      await new Promise<void>((resolve) => {
        setTimeout(resolve, RETRY_DELAY);
      });
      return tryInitialize(retriesLeft - 1);
    }
  };

  return tryInitialize(MAX_RETRIES);
};
