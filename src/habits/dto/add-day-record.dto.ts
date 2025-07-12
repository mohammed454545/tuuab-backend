import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { HabitStatus } from '../habit.entity';

export class AddDayRecordDto {
  @IsDateString()
  date: string; // صيغة ISO date, مثل "2025-07-12"

  @IsEnum(HabitStatus)
  status: HabitStatus;

  @IsString()
  @IsOptional()
  note?: string;
}
