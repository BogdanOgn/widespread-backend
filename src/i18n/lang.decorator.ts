import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import type { Request } from 'express';

import { Language } from './language.enum';
import { resolveLanguage } from './resolve-language';

export const Lang = createParamDecorator(
	(_: unknown, ctx: ExecutionContext): Language => {
		const request = ctx.switchToHttp().getRequest<Request>();
		return resolveLanguage(request.headers['accept-language']);
	},
);
