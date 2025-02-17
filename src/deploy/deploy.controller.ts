import { Controller, Post, Body } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { CreateDeploymentDto } from './dto/create-deployment.dto';

@Controller('deploy')
export class DeployController {
    constructor(private readonly deployService: DeployService) {}

    @Post()
    async createDeployment(@Body() payload: CreateDeploymentDto) {
        this.deployService.publishDeploymentCommand(payload);
        return { message: 'Deployment command published' };
    }
}
