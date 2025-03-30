import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';

@Injectable()
export class AppService {
    constructor(private readonly kafkaService: KafkaService) {}

    async healthCheck(): Promise<boolean> {
        return await this.kafkaService.isConnected();
    }
}
