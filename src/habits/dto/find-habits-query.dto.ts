import { IsOptional, IsBooleanString } from 'class-validator';

export class FindHabitsQueryDto {
  @IsOptional()
  @IsBooleanString()
  archived?: string; // 'true' | 'false'
}