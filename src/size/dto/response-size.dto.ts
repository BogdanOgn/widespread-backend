import { ApiProperty } from '@nestjs/swagger';

export class ResponseSizeDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	name!: string;
}
