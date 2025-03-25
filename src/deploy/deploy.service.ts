import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { ClientKafka, Transport } from '@nestjs/microservices';
import { KafkaConfigService } from './kafka-config.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';

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
        if (!this.client) {
            return false;
        }

        let timerId: NodeJS.Timeout = null;
        let subscription: Subscription = null;
        try {
            return await new Promise<boolean>((resolve, reject) => {
                subscription = this.client.emit('__healthcheck', {}).subscribe({
                    next: () => {
                        resolve(true);
                    },
                    error: (e) => {
                        reject(e);
                    },
                });

                timerId = setTimeout(() => {
                    reject(new Error('Kafka health check timeout'));
                }, 3000);
            });
        } catch (error) {
            console.error('Kafka connection check failed:', error);
            return false;
        } finally {
            if (timerId) {
                clearTimeout(timerId);
            }
            if (subscription) {
                subscription.unsubscribe();
            }
        }
    }

    publishDeploymentCommand(payload: any) {
        const deploymentId = payload.deployment_id;
        this.client.emit(this.kafkaConfig.createDeployTopic, { key: deploymentId, value: payload });
    }
}
