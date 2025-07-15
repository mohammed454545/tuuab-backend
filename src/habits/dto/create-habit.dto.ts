import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHabitDto {
  @IsString({ message: 'اسم العادة يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'اسم العادة لا يمكن أن يكون فارغًا' })
  name: string;

  @IsString({ message: 'الوصف يجب أن يكون نصًا' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'الملاحظات يجب أن تكون نصًا' })
  @IsOptional()
  notes?: string;
}
