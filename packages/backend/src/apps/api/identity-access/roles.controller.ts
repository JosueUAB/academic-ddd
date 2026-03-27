import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { RoleService } from '../../../contexts/identity-access/roles/application/role.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Find all roles' })
  @Get()
  async findAll() {
    return this.roleService.findAll();
  }

  @ApiOperation({ summary: 'Find a role by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findById(id);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  @ApiOperation({ summary: 'Create a role' })
  @ApiBody({ schema: { example: { name: 'Admin', permissions: ['ALL'] } } })
  @Post()
  async create(
    @Body() body: { name: string; permissions?: string[] },
  ) {
    return this.roleService.create(body);
  }
}
