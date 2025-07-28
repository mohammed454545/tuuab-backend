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
  @Column({
    type: 'varchar',
    default: HabitStatus.COMPLETED,
  })
  status: HabitStatus;

  @Expose()
  @Column({ default: 0 })
  currentStreak: number;

  @Expose()
  @Column({ default: 0 })
  longestStreak: number;

  @Expose()
  @Column({ default: 0 })
  longestRelapse: number;

  @Expose()
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Expose()
  @Column({ default: false })
  archived: boolean;

  @OneToMany(
    () => HabitDayRecord,
    (dayRecord) => dayRecord.habit,
    { cascade: true },
  )
  dayRecords: HabitDayRecord[];

  // ✅ Getter لحساب عدد الأيام منذ الإنشاء
  @Expose()
  get totalDays(): number {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // ✅ Getter لحالة اليوم الحالي
  @Expose()
  get todayStatus(): HabitStatus | null {
    if (!this.dayRecords) return null;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const record = this.dayRecords.find((r) => r.date === today);

    return record ? record.status : null;
  }
}
