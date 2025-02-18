import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsObject, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ContainerSpecDto {
    @ApiProperty({ description: 'Container image name' })
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

    @ApiProperty({ description: 'Environment variables object', type: Object, additionalProperties: { type: 'string' } })
    @IsObject()
    env: Record<string, string>;

    @ApiProperty({ description: 'Port number to be used', type: Number })
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
    @ApiProperty({ description: 'Requested resource limits', type: ResourceLimitsDto })
    @ValidateNested()
    @Type(() => ResourceLimitsDto)
    requests: ResourceLimitsDto;

    @ApiProperty({ description: 'Maximum resource limits', type: ResourceLimitsDto })
    @ValidateNested()
    @Type(() => ResourceLimitsDto)
    limits: ResourceLimitsDto;
}

export class CreateDeploymentDto {
    @ApiProperty({ description: 'Deployment name' })
    @IsString()
    @IsNotEmpty()
    deployName: string;

    @ApiProperty({ description: 'Namespace name' })
    @IsString()
    @IsNotEmpty()
    namespace: string;

    @ApiProperty({ description: 'Container specifications', type: ContainerSpecDto })
    @ValidateNested()
    @Type(() => ContainerSpecDto)
    containerSpec: ContainerSpecDto;

    @ApiProperty({ description: 'Resource information', type: ResourcesDto })
    @ValidateNested()
    @Type(() => ResourcesDto)
    resources: ResourcesDto;
}
