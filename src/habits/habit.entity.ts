import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { HabitDayRecord } from './habit-day-record.entity';

export enum HabitStatus {
  COMPLETED = 'completed',
  RELAPSED = 'relapsed',
}

@Entity()
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
  type: 'varchar',
  default: HabitStatus.COMPLETED,
})
status: HabitStatus;



  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  longestStreak: number;

  @Column({ default: 0 })
  longestRelapse: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  archived: boolean;

  @OneToMany(
    () => HabitDayRecord,
    (dayRecord) => dayRecord.habit,
    { cascade: true },
  )
  dayRecords: HabitDayRecord[];
}
