import { IsNumber, IsString } from 'class-validator';

export class ResponseBrandDto {
	@IsNumber()
	id!: number;

	@IsString()
	name!: string;

	@IsString()
	slug!: string;
}
