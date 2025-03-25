import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { ClientKafka, Transport } from '@nestjs/microservices';
import { KafkaConfigService } from './kafka-config.service';

@Injectable()
export class DeployService implements OnModuleInit, OnApplicationShutdown {
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

    async onApplicationShutdown(signal?: string) {
        if (this.client) {
            await this.client.close();
            console.log('Kafka client closed');
        }
    }

    async isConnected(): Promise<boolean> {
        try {
            if (!this.client) {
                return false;
            }

            await this.client.connect();
            const isConnected = await new Promise<boolean>((resolve) => {
                try {
                    this.client.emit('__kafka_health_check', {}).subscribe({
                        next: () => resolve(true),
                        error: () => resolve(false),
                        complete: () => {},
                    });

                    setTimeout(() => resolve(false), 3000);
                } catch (e) {
                    resolve(false);
                }
            });

            return isConnected;
        } catch (error) {
            console.error('Kafka connection check failed:', error);
            return false;
        }
    }

    publishDeploymentCommand(payload: any) {
        const deploymentId = payload.deployment_id;
        this.client.emit(this.kafkaConfig.createDeployTopic, { key: deploymentId, value: payload });
    }
}
