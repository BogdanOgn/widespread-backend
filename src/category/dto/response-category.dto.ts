import { IsNumber, IsString } from 'class-validator';

export class ResponseCategoryDto {
	@IsNumber()
	id!: number;

	@IsString()
	name!: string;

	@IsString()
	slug!: string;
}
