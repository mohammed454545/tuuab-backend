import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { HabitStatus } from '../habit.entity';

export class AddDayRecordDto {
  @IsDateString({}, { message: 'التاريخ يجب أن يكون بتنسيق صحيح (مثال: 2025-07-12)' })
  date: string; // صيغة ISO date

  @IsEnum(HabitStatus, { message: 'يجب اختيار حالة صحيحة للعادة' })
  status: HabitStatus;

  @IsString({ message: 'الملاحظة يجب أن تكون نصاً' })
  @IsOptional()
  note?: string;
}
