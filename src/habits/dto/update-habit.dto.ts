import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { HabitStatus } from '../habit.entity';

export class UpdateHabitDto {
  @IsString({ message: 'اسم العادة يجب أن يكون نصًا' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'الوصف يجب أن يكون نصًا' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'الملاحظات يجب أن تكون نصًا' })
  @IsOptional()
  notes?: string;

  @IsEnum(HabitStatus, { message: 'الحالة غير صحيحة، يجب اختيار قيمة صحيحة' })
  @IsOptional()
  status?: HabitStatus;

  @IsBoolean({ message: 'قيمة الأرشفة يجب أن تكون صح أو خطأ (true/false)' })
  @IsOptional()
  archived?: boolean;
}
