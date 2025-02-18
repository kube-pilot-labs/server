import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsObject, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ContainerSpecDto {
    @ApiProperty({
        description: 'Container image path',
        example: 'node:14-alpine',
    })
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({
        description: 'Command to execute',
        example: 'npm start',
    })
    @IsString()
    @IsNotEmpty()
    command: string;

    @ApiProperty({
        description: 'List of execution arguments',
        type: [String],
        example: ['--port', '3000'],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    args: string[];

    @ApiProperty({
        description: 'Environment variables',
        type: Object,
        additionalProperties: { type: 'string' },
        example: { NODE_ENV: 'production' },
    })
    @IsObject()
    env: Record<string, string>;

    @ApiProperty({
        description: 'Port number',
        type: Number,
        example: 3000,
    })
    @IsNumber()
    @Min(0)
    port: number;
}

export class ResourceLimitsDto {
    @ApiProperty({
        description: 'CPU usage(m)',
        type: Number,
        example: 2,
    })
    @IsNumber()
    cpu: number;

    @ApiProperty({
        description: 'Memory usage(Gi)',
        type: Number,
        example: 4,
    })
    @IsNumber()
    memory: number;
}

export class ResourcesDto {
    @ApiProperty({
        description: 'Resource requests',
        type: ResourceLimitsDto,
        example: { cpu: 500, memory: 2 },
    })
    @ValidateNested()
    @Type(() => ResourceLimitsDto)
    requests: ResourceLimitsDto;

    @ApiProperty({
        description: 'Resource limits',
        type: ResourceLimitsDto,
        example: { cpu: 1000, memory: 4 },
    })
    @ValidateNested()
    @Type(() => ResourceLimitsDto)
    limits: ResourceLimitsDto;
}

export class CreateDeploymentDto {
    @ApiProperty({
        description: 'Deployment name',
        example: 'my-deployment',
    })
    @IsString()
    @IsNotEmpty()
    deployName: string;

    @ApiProperty({
        description: 'Namespace',
        example: 'default',
    })
    @IsString()
    @IsNotEmpty()
    namespace: string;

    @ApiProperty({
        description: 'Container spec',
        type: ContainerSpecDto,
        example: {
            image: 'node:20-alpine',
            command: 'npm run start',
            args: ['--port', '3000'],
            env: { NODE_ENV: 'production' },
            port: 3000,
        },
    })
    @ValidateNested()
    @Type(() => ContainerSpecDto)
    containerSpec: ContainerSpecDto;

    @ApiProperty({
        description: 'Resources(cpu:m, memory:Gi)',
        type: ResourcesDto,
        example: {
            requests: { cpu: 500, memory: 2 },
            limits: { cpu: 1000, memory: 4 },
        },
    })
    @ValidateNested()
    @Type(() => ResourcesDto)
    resources: ResourcesDto;
}
