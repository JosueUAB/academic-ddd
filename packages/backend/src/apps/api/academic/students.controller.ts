import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { StudentService } from '../../../contexts/academic/student/application/student.service';
import type { StudentSortField } from '../../../contexts/academic/student/domain/student.repository';

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

const SORT_FIELDS: StudentSortField[] = ['firstName', 'lastName', 'code', 'document', 'birthDate', 'createdAt'];

@ApiTags('Students')
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: 'Find all students' })
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
      const sort = sortBy && SORT_FIELDS.includes(sortBy as StudentSortField) ? sortBy as StudentSortField : undefined;
      const order = sortOrder === 'desc' || sortOrder === 'asc' ? sortOrder : undefined;
      return this.studentService.findPaginatedWithUserInfo(
        page,
        pageSize,
        sort,
        order,
      );
    }
    return this.studentService.findAllWithUserInfo();
  }

  @ApiOperation({ summary: 'Find a student by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const student = await this.studentService.findByIdWithUserInfo(id);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  @ApiOperation({ summary: 'Create a student' })
  @ApiBody({ schema: { example: { firstName: 'John', lastName: 'Doe', document: '12345678', birthDate: '2000-01-01', email: 'john@example.com' } } })
  @Post()
  async create(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      document: string;
      birthDate: string;
      email?: string;
    },
  ) {
    return this.studentService.create(body);
  }

  @ApiOperation({ summary: 'Update a student' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      firstName?: string;
      lastName?: string;
      document?: string;
      birthDate?: string;
      email?: string;
    },
  ) {
    const student = await this.studentService.update(id, body);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  @ApiOperation({ summary: 'Delete a student' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.studentService.delete(id);
    if (!deleted) throw new NotFoundException('Student not found');
  }
}
