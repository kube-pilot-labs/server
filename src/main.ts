import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KafkaConfigService } from './kafka/kafka-config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const kafkaConfigService = app.get(KafkaConfigService);
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [kafkaConfigService.broker],
            },
        },
    });
    const config = new DocumentBuilder()
        .setTitle('Kube Pilot Server API')
        .setDescription('Kubernetes Pilot 서버 API 문서')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const terminationSignals = ['SIGTERM', 'SIGINT'];
    for (const signal of terminationSignals) {
        process.on(signal, async () => {
            try {
                await app.close();
                process.exit(0);
            } catch (error) {
                console.error(error);
                process.exit(1);
            }
        });
    }

    await app.startAllMicroservices();
    await app.listen(3000);
}
bootstrap();
