import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Habit, HabitStatus } from './habit.entity';
import { HabitDayRecord } from './habit-day-record.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { AddDayRecordDto } from './dto/add-day-record.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private habitRepository: Repository<Habit>,
    @InjectRepository(HabitDayRecord)
    private habitDayRecordRepository: Repository<HabitDayRecord>,
  ) {}

  async createHabit(dto: CreateHabitDto): Promise<Habit> {
    const habit = this.habitRepository.create(dto);
    return this.habitRepository.save(habit);
  }

async findAll(): Promise<Habit[]> {
  return this.habitRepository.find({
    order: { createdAt: 'DESC' }, // ⬅️ الترتيب من الأحدث إلى الأقدم
  });
}


  async findOne(id: number): Promise<Habit> {
    const habit = await this.habitRepository.findOne({ where: { id } });
    if (!habit) throw new NotFoundException(`Habit #${id} not found`);
    return habit;
  }

  async updateHabit(id: number, dto: UpdateHabitDto): Promise<Habit> {
    const habit = await this.findOne(id);
    Object.assign(habit, dto);
    return this.habitRepository.save(habit);
  }

  async archiveHabit(id: number): Promise<Habit> {
    const habit = await this.findOne(id);
    habit.archived = true;
    return this.habitRepository.save(habit);
  }

  async addDayRecord(habitId: number, dto: AddDayRecordDto) {
    const habit = await this.findOne(habitId);

    const existing = await this.habitDayRecordRepository.findOne({
      where: { habit: { id: habitId }, date: dto.date },
    });

    if (existing) {
      existing.status = dto.status;
      existing.note = dto.note ?? null;
      await this.habitDayRecordRepository.save(existing);
    } else {
      const record = this.habitDayRecordRepository.create({
        habit,
        date: dto.date,
        status: dto.status,
        note: dto.note,
      });
      await this.habitDayRecordRepository.save(record);
    }

    await this.updateHabitStreaks(habitId);

    return this.getRecordByDate(habitId, dto.date);
  }

  private async updateHabitStreaks(habitId: number) {
    const records = await this.habitDayRecordRepository.find({
      where: { habit: { id: habitId } },
      order: { date: 'ASC' },
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let currentRelapse = 0;
    let longestRelapse = 0;

    for (const record of records) {
      if (record.status === HabitStatus.COMPLETED) {
        currentStreak += 1;
        currentRelapse = 0;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else if (record.status === HabitStatus.RELAPSED) {
        currentRelapse += 1;
        currentStreak = 0;
        if (currentRelapse > longestRelapse) {
          longestRelapse = currentRelapse;
        }
      } else {
        currentStreak = 0;
        currentRelapse = 0;
      }
    }

    const habit = await this.findOne(habitId);
    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;
    habit.longestRelapse = longestRelapse;

    await this.habitRepository.save(habit);
  }

  async getAllRecords(habitId: number) {
    return this.habitDayRecordRepository.find({
      where: { habit: { id: habitId } },
      order: { date: 'ASC' },
    });
  }

  async getRecordByDate(habitId: number, date: string) {
    const record = await this.habitDayRecordRepository.findOne({
      where: { habit: { id: habitId }, date },
    });
    if (!record) {
      throw new NotFoundException(
        `No record found for date ${date} and habit ${habitId}`,
      );
    }
    return record;
  }

  async getRecordsByRange(habitId: number, from: string, to: string) {
    return this.habitDayRecordRepository.find({
      where: {
        habit: { id: habitId },
        date: Between(from, to),
      },
      order: { date: 'ASC' },
    });
  }
}
