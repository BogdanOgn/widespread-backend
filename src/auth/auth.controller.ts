import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Register a new user' })
	@Post('/register')
	register(@Body() dto: RegisterUserDto) {
		return this.authService.register(dto);
	}

	@ApiOperation({ summary: 'Log in and receive access/refresh tokens' })
	@Post('/login')
	login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.login(dto, res);
	}

	@ApiOperation({ summary: 'Log out and revoke the refresh token' })
	@Post('logout')
	logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.logout(req.cookies?.refresh_token, res);
	}

	@ApiOperation({
		summary: 'Refresh the access token using the refresh token cookie',
	})
	@Post('refresh_token')
	refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return this.authService.refresh(req.cookies?.refresh_token, res);
	}
}
