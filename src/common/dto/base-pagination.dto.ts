import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BasePaginationDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @ApiProperty({ enum: SortDirection, required: false, default: SortDirection.DESC })
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection: SortDirection = SortDirection.DESC;
}