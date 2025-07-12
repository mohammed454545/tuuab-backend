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

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@Body() dto: CreateHabitDto) {
    return this.habitsService.createHabit(dto);
  }

  @Get()
  findAll() {
    return this.habitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.habitsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHabitDto) {
    return this.habitsService.updateHabit(id, dto);
  }

  @Patch(':id/archive')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.habitsService.archiveHabit(id);
  }

  @Post(':id/records')
  addDayRecord(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddDayRecordDto,
  ) {
    return this.habitsService.addDayRecord(id, dto);
  }

  @Get(':id/records')
  getAllRecords(@Param('id', ParseIntPipe) id: number) {
    return this.habitsService.getAllRecords(id);
  }

  @Get(':id/records/by-date')
  getRecordByDate(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string,
  ) {
    return this.habitsService.getRecordByDate(id, date);
  }

  @Get(':id/records/by-range')
  getRecordsByRange(
    @Param('id', ParseIntPipe) id: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.habitsService.getRecordsByRange(id, from, to);
  }
}
