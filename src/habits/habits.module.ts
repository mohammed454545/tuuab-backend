import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { Habit } from './habit.entity';
import { HabitDayRecord } from './habit-day-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitDayRecord])],
  controllers: [HabitsController],
  providers: [HabitsService],
})
export class HabitsModule {}
