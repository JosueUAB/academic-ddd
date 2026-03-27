import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CourseResourceService } from '../../../contexts/academic/course/application/course-resource.service';
import { CreateCourseResourceDto } from './dto/create-course-resource.dto';
import { UpdateCourseResourceDto } from './dto/update-course-resource.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Course Resources')
@ApiBearerAuth()
@Controller('courses/:courseId/resources')
export class CourseResourcesController {
  constructor(private readonly courseResourceService: CourseResourceService) {}

  @ApiOperation({ summary: 'List all resources for a course' })
  @Get()
  list(@Param('courseId') courseId: string) {
    return this.courseResourceService.listByCourse(courseId);
  }

  @ApiOperation({ summary: 'Create a course resource' })
  @Post()
  create(
    @Param('courseId') courseId: string,
    @Body() body: CreateCourseResourceDto,
  ) {
    return this.courseResourceService.create(courseId, body);
  }

  @ApiOperation({ summary: 'Find a course resource by ID' })
  @Get(':resourceId')
  findOne(
    @Param('courseId') courseId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.courseResourceService.findOne(courseId, resourceId);
  }

  @ApiOperation({ summary: 'Update a course resource' })
  @Patch(':resourceId')
  update(
    @Param('courseId') courseId: string,
    @Param('resourceId') resourceId: string,
    @Body() body: UpdateCourseResourceDto,
  ) {
    return this.courseResourceService.update(courseId, resourceId, body);
  }

  @ApiOperation({ summary: 'Delete a course resource' })
  @Delete(':resourceId')
  async remove(
    @Param('courseId') courseId: string,
    @Param('resourceId') resourceId: string,
  ) {
    await this.courseResourceService.remove(courseId, resourceId);
  }
}
