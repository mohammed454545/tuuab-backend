import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { HabitDayRecord } from './habit-day-record.entity';
import { Expose } from 'class-transformer';

export enum HabitStatus {
  COMPLETED = 'completed',
  RELAPSED = 'relapsed',
}

@Entity()
export class Habit {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column({ type: 'text', nullable: true })
  description: string;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @Column({ default: 0 })
  currentStreak: number;

  @Expose()
  @Column({ default: 0 })
  longestStreak: number;

  @Expose()
  @Column({ default: 0 })
  longestRelapse: number;

  // ✅ إجمالي أيام الانتكاسة
  @Expose()
  @Column({ default: 0 })
  totalRelapseDays: number;

  // ✅ إجمالي أيام النجاح (COMPLETED)
  @Expose()
  @Column({ default: 0 })
  totalCompletedDays: number;

  @Expose()
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Expose()
  @Column({ default: false })
  archived: boolean;

  @OneToMany(
    () => HabitDayRecord,
    (dayRecord) => dayRecord.habit,
    {
      cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
      orphanedRowAction: 'delete',
    },
  )
  dayRecords: HabitDayRecord[];

  // ✅ عدد الأيام منذ الإنشاء
  @Expose()
  get totalDays(): number {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // ✅ حالة اليوم الحالي (يحتاج dayRecords تكون محمّلة بسجل اليوم)
  @Expose()
  get todayStatus(): HabitStatus | null {
    if (!this.dayRecords || this.dayRecords.length === 0) return null;

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

    const normalize = (d: string | Date): string => {
      if (d instanceof Date) return d.toLocaleDateString('en-CA');
      return d.length >= 10 ? d.slice(0, 10) : new Date(d).toLocaleDateString('en-CA');
    };

    const rec = this.dayRecords.find((r) => normalize(r.date) === today);
    return rec ? rec.status : null;
  }
}
