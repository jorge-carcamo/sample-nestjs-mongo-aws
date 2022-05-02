import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import DatabaseConfig from './database-config';
import SecretConfig from '../secret/secret-config';
import { DatabaseConfiguration } from './database-config.enum';
import { SecretConfiguration } from '../secret/secret-config.enum';
import { SecretConfigService } from '../secret/secret-config.service';

@Injectable()
export class DatabaseConfigService implements MongooseOptionsFactory {
  constructor(
    @Inject(DatabaseConfig.KEY)
    private databaseConfig: ConfigType<typeof DatabaseConfig>,
    @Inject(SecretConfig.KEY)
    private secretConfig: ConfigType<typeof SecretConfig>,
    private readonly secretConfigService: SecretConfigService,
  ) {}

  getDatabaseConfig(key: string) {
    return this.databaseConfig[key];
  }

  getSecretConfig(key: string) {
    return this.secretConfig[key];
  }

  async getUri(): Promise<string> {
    let uri = `${await this.secretConfigService.getSecret(
      this.getSecretConfig(SecretConfiguration.SECRET_NAME),
      DatabaseConfiguration.URI,
    )}`;
    return uri;
  }

  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    let conn: MongooseModuleOptions = {
      uri: await this.getUri(),
      authMechanism: 'SCRAM-SHA-1',
      ssl: true,
      sslValidate: false,
      sslCA: 'rds-combined-ca-bundle.pem',
    };
    return conn;
  }
}
