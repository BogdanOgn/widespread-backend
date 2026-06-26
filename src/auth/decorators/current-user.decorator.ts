import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';

import { AuthenticatedUser } from '../types/authenticated-user.interface';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as AuthenticatedUser;
  },
);
