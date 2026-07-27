import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';

import { memoryStorage } from 'multer';

import { UploadResponseDto } from './dto/upload-response.dto';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@ApiOperation({ summary: 'Upload a file' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: { type: 'string', format: 'binary' },
			},
		},
	})
	@ApiResponse({ status: 201, type: UploadResponseDto })
	@Post()
	@UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
	upload(@UploadedFile() file: Express.Multer.File | undefined) {
		return this.uploadService.save(file);
	}
}
