import { AbstractConfigService } from '@nestjs-library/config';
import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class DeployConfigService extends AbstractConfigService<DeployConfigService> {
    @Expose({ name: 'KAFKA_CREATE_DEPLOY_TOPIC' })
    @IsString()
    @IsNotEmpty()
    createDeployTopic: string;
}
