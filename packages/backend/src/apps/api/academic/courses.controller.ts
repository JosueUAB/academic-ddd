export class CreateCourseDto {
  name: string;
  code: string;
  credits: number;
}


import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Patch,
  Delete,
} from '@nestjs/common';
import { CourseService } from '../../../contexts/academic/course/application/course.service';
import { UpdateCourseDto } from 'src/contexts/academic/course/application/dto/update-course.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CourseService) { }

  @ApiOperation({ summary: 'Find all courses' })
  @ApiResponse({ status: 200, description: 'Return all courses.' })
  @Get()
  async findAll() {
    return this.courseService.findAll();
  }

  @ApiOperation({ summary: 'Find a course by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.courseService.findById(id);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  @ApiOperation({ summary: 'Create a new course' })
  @ApiBody({ type: CreateCourseDto })
  @Post()
async create(@Body() body: any) {
  return this.courseService.create(body);
}

  @ApiOperation({ summary: 'Update a course' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCourseDto) {
    return this.courseService.update(id, body);
  }

  @ApiOperation({ summary: 'Delete a course' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const course = await this.courseService.remove(id);
    if (!course) throw new NotFoundException('Course not found');
    return { message: 'Course deleted' };
  }
}

