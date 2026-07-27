import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
	@ApiProperty({ minLength: 3 })
	@IsString()
	@MinLength(3)
	username!: string;

	@ApiProperty({ minLength: 6 })
	@IsString()
	@MinLength(6)
	password!: string;
}
