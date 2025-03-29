import { Module } from '@nestjs/common';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';
import { KafkaConfigService } from './kafka-config.service';
import { ConfigModule } from '@nestjs-library/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from './entities/deployment.entity';

@Module({
    imports: [ConfigModule.forFeature(KafkaConfigService), TypeOrmModule.forFeature([Deployment])],
    controllers: [DeployController],
    providers: [DeployService],
    exports: [DeployService],
})
export class DeployModule {}
