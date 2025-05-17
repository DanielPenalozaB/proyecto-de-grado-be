import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Guide } from '../entities/guides.entity';

export class GuideResponseDto {
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
  difficulty!: string;

  @ApiProperty()
  @Expose()
  estimatedDuration!: number;

  @ApiProperty()
  @Expose()
  status!: string;

  @ApiProperty()
  @Expose()
  language!: string;

  @ApiProperty()
  @Expose()
  points!: number;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  constructor(partial: Partial<Guide>) {
    Object.assign(this, partial);
  }
}