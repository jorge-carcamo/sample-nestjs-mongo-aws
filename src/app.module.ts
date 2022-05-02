import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/users.module';
import { HealthController } from './health/health.controller';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseConfigService } from './config/database/database-config.service';
import { DatabaseConfigModule } from './config/database/database-config.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './commons/filters/http-exception.filter';
import { LoggingInterceptor } from './commons/interceptors/logging.interceptor';

@Module({
  imports: [
    TerminusModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: async (config: DatabaseConfigService) =>
        config.createMongooseOptions(),
      inject: [DatabaseConfigService],
    }),
    UserModule,
  ],
  controllers: [HealthController],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
