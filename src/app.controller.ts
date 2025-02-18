import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/ping')
    @ApiResponse({
        status: 200,
        description: 'Health Check',
        schema: {
            type: 'string',
            example: 'pong',
        },
    })
    getHello(): string {
        return 'pong';
    }
}
