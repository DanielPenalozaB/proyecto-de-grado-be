import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { City } from '../entities/cities.entity';

export class CityResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  rainfall?: number;

  @ApiProperty()
  @Expose()
  language?: string;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  constructor(partial: Partial<City>) {
    Object.assign(this, partial);
  }
}