import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Transport } from '@nestjs/microservices';
import { KafkaConfigService } from './kafka-config.service';

@Injectable()
export class DeployService implements OnModuleInit {
    private client: ClientKafka;

    constructor(private readonly kafkaConfig: KafkaConfigService) {}

    async onModuleInit() {
        this.client = new ClientKafka({
            client: {
                brokers: [this.kafkaConfig.broker],
            },
        });

        await this.client.connect();
    }

    publishDeploymentCommand(payload: any) {
        const deploymentId = payload.deployment_id;
        this.client.emit(this.kafkaConfig.createDeployTopic, { key: deploymentId, value: payload });
    }
}
