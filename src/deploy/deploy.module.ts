import { Module } from '@nestjs/common';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';
import { ConfigModule } from '@nestjs-library/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from './entities/deployment.entity';
import { DeployConfigService } from './deploy-config.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
    imports: [ConfigModule.forFeature(DeployConfigService), TypeOrmModule.forFeature([Deployment]), KafkaModule],
    controllers: [DeployController],
    providers: [DeployService],
    exports: [DeployService],
})
export class DeployModule {}
