import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.interface';

import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: 'Get the currently authenticated user' })
	@ApiBearerAuth()
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
