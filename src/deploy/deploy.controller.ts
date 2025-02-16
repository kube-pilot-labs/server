import { Controller, Post, Body } from '@nestjs/common';
import { DeployService } from './deploy.service';

@Controller('deploy')
export class DeployController {
    constructor(private readonly deployService: DeployService) {}

    @Post()
    async createDeployment(@Body() payload: any) {
        this.deployService.publishDeploymentCommand(payload);
        return { message: 'Deployment command published' };
    }
}
