import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Habit, HabitStatus } from './habit.entity';

@Entity()
@Unique(['habit', 'date']) // لا يسمح بتكرار اليوم للعادة نفسها
export class HabitDayRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Habit,
    (habit) => habit.dayRecords,
    { 
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
     },
    
  )
  habit: Habit;

  @Column({ type: 'date' })
  date: string;

  @Column({
  type: 'varchar',
})
status: HabitStatus;


  @Column({ type: 'text', nullable: true })
  note: string|null;
}
