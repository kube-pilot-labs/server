import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsObject, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ContainerSpecDto {
    @IsString()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    command: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    args: string[];

    @IsObject()
    env: Record<string, string>;

    @IsNumber()
    @Min(0)
    port: number;
}

export class ResourceLimitsDto {
    @IsNumber()
    cpu: number;

    @IsNumber()
    memory: number;
}

export class ResourcesDto {
    @ValidateNested()
    @Type(() => ResourceLimitsDto)
    requests: ResourceLimitsDto;

    @ValidateNested()
    @Type(() => ResourceLimitsDto)
    limits: ResourceLimitsDto;
}

export class CreateDeploymentDto {
    @IsString()
    @IsNotEmpty()
    deployName: string;

    @IsString()
    @IsNotEmpty()
    namespace: string;

    @ValidateNested()
    @Type(() => ContainerSpecDto)
    containerSpec: ContainerSpecDto;

    @ValidateNested()
    @Type(() => ResourcesDto)
    resources: ResourcesDto;
}
