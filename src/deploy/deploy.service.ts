import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deployment } from './entities/deployment.entity';
import { DeployConfigService } from './deploy-config.service';
import { KAFKA_PRODUCER } from 'src/kafka/kafka.symbol';

@Injectable()
export class DeployService {
    constructor(
        private readonly deployConfigService: DeployConfigService,
        @Inject(KAFKA_PRODUCER)
        private readonly kafkaProducer: ClientKafka,
        @InjectRepository(Deployment)
        private deploymentRepository: Repository<Deployment>,
    ) {}

    async publishDeploymentCommand(payload: any) {
        const deploymentId = payload.deployment_id;
        this.kafkaProducer.emit(this.deployConfigService.createDeployTopic, { key: deploymentId, value: payload });
        await this.deploymentRepository.save({
            id: deploymentId,
            name: payload.name,
            status: 'pending',
        });
    }
}
