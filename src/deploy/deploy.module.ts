import { Module } from '@nestjs/common';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';
import { KafkaConfigService } from './kafka-config.service';
import { ConfigModule } from '@nestjs-library/config';

@Module({
    imports: [ConfigModule.forFeature(KafkaConfigService)],
    controllers: [DeployController],
    providers: [DeployService],
    exports: [DeployService],
})
export class DeployModule {}
