import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Module } from '../entities/modules.entity';

export class ModuleResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  description!: string;

  @ApiProperty()
  @Expose()
  order!: number;

  @ApiProperty()
  @Expose()
  points!: number;

  @ApiProperty()
  @Expose()
  status!: string;

  @ApiProperty()
  @Expose()
  guideId!: number;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  constructor(partial: Partial<Module>) {
    Object.assign(this, partial);
    this.guideId = partial.guide?.id || 0;
  }
}