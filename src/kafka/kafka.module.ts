import { Module, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { ModuleRef } from '@nestjs/core';
import { ConfigModule } from '@nestjs-library/config';
import { KAFKA_PRODUCER } from './kafka.symbol';
import { KafkaConfigService } from './kafka-config.service';
import { KafkaService } from './kafka.service';

@Module({
    imports: [
        ConfigModule.forFeature(KafkaConfigService),
        ClientsModule.registerAsync([
            {
                name: KAFKA_PRODUCER,
                imports: [ConfigModule],
                inject: [KafkaConfigService],
                useFactory: (configService: KafkaConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            brokers: [configService.broker],
                        },
                    },
                }),
            },
        ]),
    ],
    providers: [KafkaConfigService, KafkaService],
    exports: [KafkaService, ClientsModule],
})
export class KafkaModule implements OnApplicationShutdown, OnModuleInit {
    constructor(private readonly moduleRef: ModuleRef) {}

    async onModuleInit() {
        const kafkaProducer = this.moduleRef.get<ClientKafka>(KAFKA_PRODUCER);
        await kafkaProducer.connect();
    }

    async onApplicationShutdown() {
        const kafkaProducer = this.moduleRef.get<ClientKafka>(KAFKA_PRODUCER);
        await kafkaProducer.close();
        console.log('Kafka producer connection closed');
    }
}
