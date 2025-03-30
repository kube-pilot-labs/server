import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_PRODUCER } from './kafka.symbol';
import { KafkaConfigService } from './kafka-config.service';
import { Subscription } from 'rxjs';

@Injectable()
export class KafkaService {
    constructor(
        @Inject(KAFKA_PRODUCER)
        private readonly kafkaProducer: ClientKafka,
        private readonly kafkaConfigService: KafkaConfigService,
    ) {}

    async isConnected(): Promise<boolean> {
        if (!this.kafkaProducer) {
            return false;
        }

        let timerId: NodeJS.Timeout = null;
        let subscription: Subscription = null;
        try {
            return await new Promise<boolean>((resolve, reject) => {
                subscription = this.kafkaProducer.emit(this.kafkaConfigService.healthCheckTopic, {}).subscribe({
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
}
