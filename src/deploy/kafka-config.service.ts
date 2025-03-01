import { AbstractConfigService } from '@nestjs-library/config';
import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class KafkaConfigService extends AbstractConfigService<KafkaConfigService> {
    @Expose({ name: 'KAFKA_BROKER' })
    @IsString()
    @IsNotEmpty()
    broker: string;

    @Expose({ name: 'KAFKA_CLIENT_ID' })
    @IsString()
    @IsNotEmpty()
    clientId: string;

    @Expose({ name: 'KAFKA_TOPIC' })
    @IsString()
    @IsNotEmpty()
    topic: string;
}
