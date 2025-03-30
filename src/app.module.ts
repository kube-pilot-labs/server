import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs-library/config';
import { MariaDBConfigService } from './mariadb-config.service';
import { DeployModule } from './deploy/deploy.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
    imports: [
        ConfigModule.forFeature(MariaDBConfigService, {
            global: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [MariaDBConfigService],
            useFactory: (configService: MariaDBConfigService) => ({
                type: 'mariadb',
                host: configService.host,
                port: configService.port,
                username: configService.username,
                password: configService.password,
                database: configService.database,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: configService.synchronize,
            }),
        }),
        KafkaModule,
        DeployModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
