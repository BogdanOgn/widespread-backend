import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  refreshTokenReuseGraceSeconds: number;
}

export const jwtConfig = registerAs(
  'jwt',
  (): JwtConfig => ({
    secret: process.env.JWT_SECRET as string,
    accessTokenTtlSeconds: parseInt(
      process.env.JWT_ACCESS_EXPIRES_IN_SECONDS ?? '900',
      10,
    ),
    refreshTokenTtlSeconds: parseInt(
      process.env.JWT_REFRESH_EXPIRES_IN_SECONDS ?? '1296000',
      10,
    ),
    refreshTokenReuseGraceSeconds: parseInt(
      process.env.REFRESH_TOKEN_REUSE_GRACE_SECONDS ?? '30',
      10,
    ),
  }),
);
