import { Module, OnApplicationShutdown, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs-library/config';
import { KAFKA_PRODUCER } from './kafka.symbol';
import { KafkaConfigService } from './kafka-config.service';
import { KafkaService } from './kafka.service';
import { HealthCheckConfigService } from './health-check-config.service';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: KAFKA_PRODUCER,
                imports: [ConfigModule.forFeature(KafkaConfigService)],
                useFactory: (configService: KafkaConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            brokers: [configService.broker],
                        },
                    },
                }),
                inject: [KafkaConfigService],
            },
        ]),
        ConfigModule.forFeature(HealthCheckConfigService),
    ],
    providers: [KafkaService],
    exports: [KafkaService, ClientsModule],
})
export class KafkaModule implements OnApplicationShutdown, OnModuleInit {
    constructor(@Inject(KAFKA_PRODUCER) private readonly kafkaProducer: ClientKafka) {}

    async onModuleInit() {
        await this.kafkaProducer.connect();
    }

    async onApplicationShutdown() {
        await this.kafkaProducer.close();
        console.log('Kafka producer connection closed');
    }
}
