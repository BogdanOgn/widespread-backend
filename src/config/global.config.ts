import { registerAs } from '@nestjs/config';

export interface GlobalConfig {
  isProduction: boolean;
  bcrypt: {
    saltRounds: number;
  };
}

export const globalConfig = registerAs(
  'global',
  (): GlobalConfig => ({
    isProduction: process.env.NODE_ENV === 'production',
    bcrypt: {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10),
    },
  }),
);
