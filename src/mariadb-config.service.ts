import { AbstractConfigService } from '@nestjs-library/config';
import { Injectable } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Injectable()
export class MariaDBConfigService extends AbstractConfigService<MariaDBConfigService> {
    @Expose({ name: 'DB_HOST' })
    @IsString()
    @IsNotEmpty()
    host: string;

    @Expose({ name: 'DB_PORT' })
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    port: number;

    @Expose({ name: 'DB_USERNAME' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @Expose({ name: 'DB_PASSWORD' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @Expose({ name: 'DB_DATABASE' })
    @IsString()
    @IsNotEmpty()
    database: string;

    @Expose({ name: 'DB_SYNC' })
    @IsBoolean()
    @IsNotEmpty()
    @Transform(({ value }) => value === 'true')
    synchronize: boolean;
}
