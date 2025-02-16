import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Client, Transport } from '@nestjs/microservices';

@Injectable()
export class DeployService implements OnModuleInit {
    @Client({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'deploy-producer',
                brokers: ['kafka:9092'],
            },
            consumer: {
                groupId: 'deploy-consumer',
            },
        },
    })
    client: ClientKafka;

    async onModuleInit() {
        await this.client.connect();
    }

    publishDeploymentCommand(payload: any) {
        const deploymentId = payload.deployment_id;
        this.client.emit('deployment-commands', { key: deploymentId, value: payload });
    }
}
