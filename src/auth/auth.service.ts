import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { createHash } from 'node:crypto';

import { globalConfig } from '../config/global.config';
import { jwtConfig } from '../config/jwt.config';
import { RefreshTokenModel } from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload, TokenType } from './types/jwt-payload.interface';

const ACCESS_TOKEN_COOKIE_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 15 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(globalConfig.KEY)
    private readonly appConfig: ConfigType<typeof globalConfig>,
  ) {}

  async register(dto: RegisterUserDto) {
    const existingUser = await this.userService.findByUsername(dto.username);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      this.appConfig.bcrypt.saltRounds,
    );

    const user = await this.userService.create(dto.username, hashedPassword);

    return this.userService.toResponse(user);
  }

  async login(dto: LoginUserDto, res: Response) {
    const user = await this.userService.findByUsername(dto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.issueTokens(res, Number(user.id), user.username);

    return { user: this.userService.toResponse(user) };
  }

  async logout(refreshToken: string | undefined, res: Response) {
    if (!refreshToken) {
      throw new BadRequestException('No refresh token provided');
    }

    await this.prismaService.refreshToken.deleteMany({
      where: { token: this.hashToken(refreshToken) },
    });

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { detail: 'Successfully logged out' };
  }

  async refresh(refreshToken: string | undefined, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const payload = this.verifyToken(refreshToken);

    if (payload.type !== TokenType.REFRESH) {
      throw new BadRequestException('Invalid refresh token');
    }

    let tokenRecord = await this.prismaService.refreshToken.findUnique({
      where: { token: this.hashToken(refreshToken) },
    });

    if (!tokenRecord) {
      throw new NotFoundException('Refresh token does not exist');
    }

    if (tokenRecord.rotatedAt !== null) {
      tokenRecord = await this.handleRotatedTokenReuse(tokenRecord);
    }

    await this.prismaService.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { rotatedAt: new Date() },
    });

    return this.issueTokens(res, payload.sub, payload.username);
  }

  private async handleRotatedTokenReuse(
    tokenRecord: RefreshTokenModel,
  ): Promise<RefreshTokenModel> {
    const graceSeconds = this.jwtConfiguration.refreshTokenReuseGraceSeconds;
    const elapsedMs = Date.now() - tokenRecord.rotatedAt!.getTime();

    if (elapsedMs > graceSeconds * 1000) {
      await this.prismaService.refreshToken.updateMany({
        where: { userId: tokenRecord.userId, rotatedAt: null },
        data: { rotatedAt: new Date() },
      });
      throw new UnauthorizedException('Refresh token already used');
    }

    const activeToken = await this.prismaService.refreshToken.findFirst({
      where: { userId: tokenRecord.userId, rotatedAt: null },
      orderBy: { id: 'desc' },
    });

    if (!activeToken) {
      throw new UnauthorizedException('Session expired');
    }

    return activeToken;
  }

  private async issueTokens(res: Response, userId: number, username: string) {
    const accessToken = this.signToken(
      userId,
      username,
      TokenType.ACCESS,
      this.jwtConfiguration.accessTokenTtlSeconds,
    );
    const refreshToken = this.signToken(
      userId,
      username,
      TokenType.REFRESH,
      this.jwtConfiguration.refreshTokenTtlSeconds,
    );

    await this.prismaService.refreshToken.create({
      data: { userId, token: this.hashToken(refreshToken) },
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private signToken(
    sub: number,
    username: string,
    type: TokenType,
    expiresIn: number,
  ): string {
    const payload: JwtPayload = { sub, username, type };
    return this.jwtService.sign(payload, { expiresIn });
  }

  private verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
