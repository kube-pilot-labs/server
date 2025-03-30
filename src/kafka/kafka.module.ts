import { Module, OnApplicationShutdown, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs-library/config';
import { KAFKA_PRODUCER } from './kafka.symbol';
import { KafkaConfigService } from './kafka-config.service';
import { KafkaService } from './kafka.service';

const configModule = ConfigModule.forFeature(KafkaConfigService);

@Module({
    imports: [
        configModule,
        ClientsModule.registerAsync({
            clients: [
                {
                    name: KAFKA_PRODUCER,
                    imports: [configModule],
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
            ],
            isGlobal: true,
        }),
    ],
    providers: [KafkaConfigService, KafkaService],
    exports: [KafkaService],
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
