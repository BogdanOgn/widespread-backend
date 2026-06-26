import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { jwtConfig } from '../../config/jwt.config';
import { AuthenticatedUser } from '../types/authenticated-user.interface';
import { JwtPayload, TokenType } from '../types/jwt-payload.interface';

function extractAccessTokenFromCookie(req: Request): string | null {
  return req?.cookies?.access_token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(jwtConfig.KEY) config: ConfigType<typeof jwtConfig>) {
    super({
      jwtFromRequest: extractAccessTokenFromCookie,
      secretOrKey: config.secret,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    if (payload.type !== TokenType.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }

    return { id: payload.sub, username: payload.username };
  }
}
