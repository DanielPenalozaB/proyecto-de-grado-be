import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../users/entities/users.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: env.nodeEnv === 'development',
  logging: env.nodeEnv === 'development',
  entities: [User],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  subscribers: [],
});