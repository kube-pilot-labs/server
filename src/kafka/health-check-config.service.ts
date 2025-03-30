import { AbstractConfigService } from '@nestjs-library/config';
import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class HealthCheckConfigService extends AbstractConfigService<HealthCheckConfigService> {
    @Expose({ name: 'KAFKA_HEALTH_CHECK_TOPIC' })
    @IsString()
    @IsNotEmpty()
    healthCheckTopic: string;
}
