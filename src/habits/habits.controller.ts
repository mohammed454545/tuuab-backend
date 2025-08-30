import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  ParseIntPipe,
  Query,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { AddDayRecordDto } from './dto/add-day-record.dto';
import { instanceToPlain } from 'class-transformer';
import { Habit } from './habit.entity';
import { FindHabitsQueryDto } from './dto/find-habits-query.dto';

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
  async findAll(@Query() query: FindHabitsQueryDto) {
    const archived =
      query.archived !== undefined ? query.archived === 'true' : undefined;

    const habits = await this.habitsService.findAll(archived);

    const transformedHabits = habits.map((h) =>
      instanceToPlain(h, { excludeExtraneousValues: true }),
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.habitsService.deleteHabit(id);
    return { message: 'تم حذف العادة بنجاح', data: { id } };
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

  // ✅ مسار واحد فقط لجلب السجلات
  @Get(':id/records')
  async getRecords(
    @Param('id', ParseIntPipe) id: number,
    @Query('days') days?: string,
  ) {
    
     console.log('[getRecords] id=', id, 'days=', days); // 👈
    // كل السجلات
    if (!days || days.toLowerCase() === 'all') {
      const all = await this.habitsService.getAllRecords(id);
      return { message: 'تم جلب جميع السجلات بنجاح', data: all };
    }

    // تحقق من قيمة days
    const n = Number(days);
    if (!Number.isInteger(n) || n < 1) {
      throw new BadRequestException('days يجب أن تكون رقمًا صحيحًا موجبًا أو all');
    }

    // حساب نطاق الأيام
    const now = new Date();
    const start = startOfDayLocal(addDays(now, -(n - 1)));
    const end = endOfDayLocal(now);

    const records = await this.habitsService.getRecordsBetween(id, start, end);

    return {
      message: `تم جلب السجلات لآخر ${n} يوم(أيام) بنجاح`,
      data: records,
    };
  }
}

/* Helpers */
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function startOfDayLocal(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDayLocal(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
