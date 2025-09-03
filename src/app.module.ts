import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Habit } from './habits/habit.entity';
import { HabitDayRecord } from './habits/habit-day-record.entity';
import { HabitsModule } from './habits/habits.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isProd = process.env.NODE_ENV === 'production';
        const useUrl = !!process.env.DATABASE_URL;

        const common = {
          type: 'postgres' as const,
          entities: [Habit, HabitDayRecord],
          // ملاحظة: استخدم synchronize=true فقط للتجارب. للمشاريع الحقيقية فضّل الـ migrations
          synchronize: true,
        };

        if (useUrl) {
          // اتصال عبر DATABASE_URL (مثالي لRailway)
          const enableSsl = isProd || process.env.DB_SSL === 'true';
          return {
            ...common,
            url: process.env.DATABASE_URL,
            ssl: enableSsl,
            // لو ما عندك شهادة CA محلية، خلّها false
            extra: enableSsl ? { ssl: { rejectUnauthorized: false } } : undefined,
          };
        }

        // اتصال محلي عبر المتغيّرات المنفصلة
        return {
          ...common,
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'tuuabDB',
        };
      },
    }),
    HabitsModule,
  ],
})
export class AppModule {}
