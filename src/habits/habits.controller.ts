import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { AddDayRecordDto } from './dto/add-day-record.dto';
import { instanceToPlain } from 'class-transformer';
import { Habit } from './habit.entity';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async create(@Body() dto: CreateHabitDto) {
    const habit = await this.habitsService.createHabit(dto);
    const transformedHabit = instanceToPlain(habit, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'تم إنشاء العادة بنجاح',
      data: transformedHabit,
    };
  }

  @Get()
  async findAll() {
    const habits = await this.habitsService.findAll();
    const transformedHabits = habits.map(h =>
      instanceToPlain(h, {
        excludeExtraneousValues: true,
      }),
    );
    return {
      message: 'تم جلب جميع العادات بنجاح',
      data: transformedHabits,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const habit = await this.habitsService.findOne(id);
    const transformedHabit = instanceToPlain(habit, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'تم جلب العادة بنجاح',
      data: transformedHabit,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHabitDto,
  ) {
    const habit = await this.habitsService.updateHabit(id, dto);
    const transformedHabit = instanceToPlain(habit, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'تم تحديث العادة بنجاح',
      data: transformedHabit,
    };
  }

  @Patch(':id/archive')
  async archive(@Param('id', ParseIntPipe) id: number) {
    const habit = await this.habitsService.archiveHabit(id);
    const transformedHabit = instanceToPlain(habit, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'تم أرشفة العادة بنجاح',
      data: transformedHabit,
    };
  }

  @Post(':id/records')
  async addDayRecord(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddDayRecordDto,
  ) {
    const record = await this.habitsService.addDayRecord(id, dto);
    return {
      message: 'تم إضافة أو تحديث السجل اليومي بنجاح',
      data: record,
    };
  }

  @Get(':id/records')
  async getAllRecords(@Param('id', ParseIntPipe) id: number) {
    const records = await this.habitsService.getAllRecords(id);
    return {
      message: 'تم جلب جميع السجلات بنجاح',
      data: records,
    };
  }

  @Get(':id/records/by-date')
  async getRecordByDate(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string,
  ) {
    const record = await this.habitsService.getRecordByDate(id, date);
    return {
      message: `تم جلب السجل لتاريخ ${date} بنجاح`,
      data: record,
    };
  }

  @Get(':id/records/by-range')
  async getRecordsByRange(
    @Param('id', ParseIntPipe) id: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const records = await this.habitsService.getRecordsByRange(id, from, to);
    return {
      message: `تم جلب السجلات بين ${from} و ${to} بنجاح`,
      data: records,
    };
  }
}
