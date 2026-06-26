import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.interface';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() currentUser: AuthenticatedUser) {
    const user = await this.userService.findById(currentUser.id);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return this.userService.toResponse(user);
  }
}
