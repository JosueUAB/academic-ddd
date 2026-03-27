import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { User } from '../../../contexts/identity-access/users/domain/user.entity';
import { UserService } from '../../../contexts/identity-access/users/application/user.service';
import { RoleService } from '../../../contexts/identity-access/roles/application/role.service';
import { Role } from '../../../contexts/identity-access/roles/domain/role.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

function toUserResponse(user: User, roles: Role[]) {
  const role = roles.find((r) => r.id === user.roleId);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: role ? { id: role.id, name: role.name } : { id: user.roleId, name: 'UNKNOWN' },
  };
}

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) { }

  @ApiOperation({ summary: 'Find all users' })
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    const roles = await this.roleService.findAll();
    return users.map((user) => toUserResponse(user, roles));
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  async findCurrentUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('No autorizado');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usario no encontrado');
    }

    return toUserResponse(user, [] as Role[]);
  }

  @ApiOperation({ summary: 'Find a user by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const roles = await this.roleService.findAll();
    return toUserResponse(user, roles);
  }

  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ schema: { example: { username: 'johndoe', email: 'john@example.com', roleId: 'uuid', password: 'secretPassword' } } })
  @Post()
  async create(
    @Body() body: {
      username: string;
      email: string;
      roleId: string;
      password: string;
    },
  ) {
    const user = await this.userService.create(body);
    const roles = await this.roleService.findAll();
    return toUserResponse(user, roles);
  }

  @ApiOperation({ summary: 'Update a user' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: {
      username?: string;
      email?: string;
      roleId?: string;
      password?: string;
    },
  ) {
    const user = await this.userService.update(id, body);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const roles = await this.roleService.findAll();
    return toUserResponse(user, roles);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.userService.delete(id);
    return { success: true };
  }

  @ApiOperation({ summary: 'Update a user email' })
  @ApiBody({ schema: { example: { email: 'newemail@example.com' } } })
  @Patch(':id/email')
  async updateEmail(
    @Param('id') id: string,
    @Body('email') email: string
  ) {
    const user = await this.userService.updateEmail(id, email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @ApiOperation({ summary: 'Change current user password' })
  @ApiBody({ type: ChangePasswordDto })
  @Patch('me')
  async changeMyPassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: ChangePasswordDto,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('No autorizado');
    }

    if (body.newPassword !== body.confirmPassword) {
      throw new BadRequestException('Password confirmation does not match');
    }

    await this.userService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
      body.confirmPassword,
    );

    return { message: 'Password updated successfully' };
  }

}
