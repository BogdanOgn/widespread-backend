import { registerAs } from '@nestjs/config';

export interface GlobalConfig {
  bcrypt: {
    saltRounds: number;
  };
}

export const globalConfig = registerAs(
  'global',
  (): GlobalConfig => ({
    bcrypt: {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10),
    },
  }),
);
