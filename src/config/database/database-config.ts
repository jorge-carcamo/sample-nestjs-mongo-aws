import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.VAR_DB_URI,
  host: process.env.VAR_DB_HOST,
  username: process.env.VAR_DB_USERNAME,
  password: process.env.VAR_DB_PASSWORD,
  port: process.env.VAR_DB_PORT,
  database: process.env.VAR_DB_DATABASE,
  ssl: process.env.VAR_SSL,
}));
