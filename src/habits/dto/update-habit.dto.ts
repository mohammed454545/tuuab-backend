import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { HabitStatus } from '../habit.entity';

export class UpdateHabitDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  status?: HabitStatus;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;
}
