import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ScheduleService } from '../../../contexts/academic/schedule/application/schedule.service';
import { ScheduleSortField } from '../../../contexts/academic/schedule/domain/schedule.repository';

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

const SORT_FIELDS: ScheduleSortField[] = ['slot', 'createdAt', 'courseName'];

@ApiTags('Schedules')
@ApiBearerAuth()
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: 'Find all schedules' })
  @Get()
  async findAll(
    @Query('page') pageStr?: string,
    @Query('pageSize') pageSizeStr?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    const page = pageStr != null ? parseInt(pageStr, 10) : undefined;
    const pageSize = pageSizeStr != null ? parseInt(pageSizeStr, 10) : undefined;
    if (page != null && !Number.isNaN(page) && pageSize != null && !Number.isNaN(pageSize)) {
      const sort = sortBy && SORT_FIELDS.includes(sortBy as ScheduleSortField) ? sortBy as ScheduleSortField : undefined;
      const order = sortOrder === 'desc' || sortOrder === 'asc' ? sortOrder : undefined;
      return this.scheduleService.findPaginatedWithUserInfo(
        page,
        pageSize,
        sort,
        order,
      );
    }
    return this.scheduleService.findAllWithCourseInfo();
  }

  @ApiOperation({ summary: 'Find a schedule by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const schedule = await this.scheduleService.findById(id);
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  @ApiOperation({ summary: 'Create a schedule' })
  @ApiBody({ schema: { example: { courseId: 'uuid', slot: 'Mon 08:00 - 10:00', classroomId: 'uuid' } } })
  @Post()
  async create(
    @Body() body: { courseId: string; slot: string; classroomId: string },
  ) {
    return this.scheduleService.create(body);
  }

  @ApiOperation({ summary: 'Update a schedule' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: { courseId?: string; slot?: string; classroomId?: string },
  ) {
    const schedule = await this.scheduleService.update(id, body);
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  @ApiOperation({ summary: 'Delete a schedule' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.scheduleService.delete(id);
    if (!deleted) throw new NotFoundException('Schedule not found');
  }
}
