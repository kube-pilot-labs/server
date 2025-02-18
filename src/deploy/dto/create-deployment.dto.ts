import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsObject, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ContainerSpecDto {
    @ApiProperty({ description: 'Container image path' })
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({ description: 'Command to execute' })
    @IsString()
    @IsNotEmpty()
    command: string;

    @ApiProperty({ description: 'List of execution arguments', type: [String] })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    args: string[];

    @ApiProperty({ description: 'Environment variables', type: Object, additionalProperties: { type: 'string' } })
    @IsObject()
    env: Record<string, string>;

    @ApiProperty({ description: 'Port number', type: Number })
    @IsNumber()
    @Min(0)
    port: number;
}

export class ResourceLimitsDto {
    @ApiProperty({ description: 'CPU usage', type: Number })
    @IsNumber()
    cpu: number;

    @ApiProperty({ description: 'Memory usage', type: Number })
    @IsNumber()
    memory: number;
}

export class ResourcesDto {
    @ApiProperty({ description: 'Resource limits', type: ResourceLimitsDto })
    @ValidateNested()
    @Type(() => ResourceLimitsDto)
    requests: ResourceLimitsDto;

    @ApiProperty({ description: 'Resource limits', type: ResourceLimitsDto })
    @ValidateNested()
    @Type(() => ResourceLimitsDto)
    limits: ResourceLimitsDto;
}

export class CreateDeploymentDto {
    @ApiProperty({ description: 'Deployment name' })
    @IsString()
    @IsNotEmpty()
    deployName: string;

    @ApiProperty({ description: 'Namespace' })
    @IsString()
    @IsNotEmpty()
    namespace: string;

    @ApiProperty({ description: 'Container spec', type: ContainerSpecDto })
    @ValidateNested()
    @Type(() => ContainerSpecDto)
    containerSpec: ContainerSpecDto;

    @ApiProperty({ description: 'Resources', type: ResourcesDto })
    @ValidateNested()
    @Type(() => ResourcesDto)
    resources: ResourcesDto;
}
