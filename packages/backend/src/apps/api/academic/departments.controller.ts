import { Controller, Get, Post, Patch, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { DepartmentService } from '../../../contexts/academic/department/application/department.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiOperation({ summary: 'Find all departments' })
  @Get()
  async findAll() { return this.departmentService.findAll(); }

  @ApiOperation({ summary: 'Find a department by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const dept = await this.departmentService.findById(id);
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  @ApiOperation({ summary: 'Create a new department' })
  @ApiBody({ schema: { example: { name: 'Engineering', code: 'ENG' } } })
  @Post()
  async create(@Body() body: { name: string; code: string; parentId?: string }) {
    return this.departmentService.create(body);
  }

  @ApiOperation({ summary: 'Update a department' })
  @ApiBody({ schema: { example: { name: 'Advanced Engineering' } } })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name?: string; code?: string; parentId?: string }) {
    const dept = await this.departmentService.update(id, body);
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  @ApiOperation({ summary: 'Delete a department' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.departmentService.delete(id);
    if (!deleted) throw new NotFoundException('Department not found');
  }
}