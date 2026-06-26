import { plainToInstance } from 'class-transformer';
import { IsIn, IsInt, IsString, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: string = 'development';

  @IsInt()
  @Min(0)
  PORT: number = 3000;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsInt()
  @Min(1)
  JWT_ACCESS_EXPIRES_IN_SECONDS: number = 900;

  @IsInt()
  @Min(1)
  JWT_REFRESH_EXPIRES_IN_SECONDS: number = 1296000;

  @IsInt()
  @Min(0)
  REFRESH_TOKEN_REUSE_GRACE_SECONDS: number = 30;

  @IsInt()
  @Min(4)
  BCRYPT_SALT_ROUNDS: number = 12;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Invalid environment variables:\n${errors.toString()}`);
  }

  return validatedConfig;
}
