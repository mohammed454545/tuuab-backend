import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './habits/habit.entity';
import { HabitDayRecord } from './habits/habit-day-record.entity';
import { HabitsModule } from './habits/habits.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/database.sqlite',
      entities: [Habit, HabitDayRecord],
      synchronize: true,
    }),
    HabitsModule,
  ],
})
export class AppModule {}
