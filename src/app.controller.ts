import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { DeployService } from './deploy/deploy.service';

@ApiTags('App')
@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly deployService: DeployService,
    ) {}

    @Get('/ping')
    @ApiResponse({
        status: 200,
        description: 'Liveness Check',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
            },
        },
    })
    getLiveness(): { status: string } {
        return { status: 'ok' };
    }

    @Get('/healthz')
    @ApiResponse({
        status: 200,
        description: 'Health Check',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
            },
        },
    })
    async healthCheck(): Promise<{ status: string }> {
        const isHealthy = await this.appService.healthCheck();
        if (!isHealthy) {
            throw new HttpException({ status: 'unhealthy' }, HttpStatus.SERVICE_UNAVAILABLE);
        }
        return {
            status: 'ok',
        };
    }
}
