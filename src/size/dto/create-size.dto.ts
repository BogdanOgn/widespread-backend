import { IsString } from 'class-validator';

export class CreateSizeDto {
	@IsString()
	name!: string;
}
