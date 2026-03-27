import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ClassroomService } from '../../../contexts/academic/classroom/application/classroom.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Classrooms')
@ApiBearerAuth()
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomService: ClassroomService) {}

  @ApiOperation({ summary: 'Find all classrooms' })
  @ApiResponse({ status: 200, description: 'Return all classrooms.' })
  @Get()
  async findAll() {
    return this.classroomService.findAll();
  }

  @ApiOperation({ summary: 'Find a classroom by ID' })
  @ApiResponse({ status: 200, description: 'Return the classroom.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const classroom = await this.classroomService.findById(id);
    if (!classroom) throw new NotFoundException('Classroom not found');
    return classroom;
  }

  @ApiOperation({ summary: 'Create a new classroom' })
  @ApiBody({ schema: { example: { code: 'A101', building: 'Main Building', capacity: 30 } } })
  @Post()
  async create(
    @Body()
    body: { code: string; building: string; capacity: number },
  ) {
    return this.classroomService.create(body);
  }

  @ApiOperation({ summary: 'Update an existing classroom' })
  @ApiBody({ schema: { example: { capacity: 40 } } })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: { code?: string; building?: string; capacity?: number },
  ) {
    const classroom = await this.classroomService.update(id, body);
    if (!classroom) throw new NotFoundException('Classroom not found');
    return classroom;
  }

  @ApiOperation({ summary: 'Delete a classroom' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.classroomService.delete(id);
    if (!deleted) throw new NotFoundException('Classroom not found');
  }
}
