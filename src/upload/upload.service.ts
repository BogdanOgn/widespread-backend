import {
	BadRequestException,
	Injectable,
	PayloadTooLargeException,
	UnprocessableEntityException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

import {
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE_BYTES,
	MAX_FILE_SIZE_MB,
	MEDIA_ROOT,
	MEDIA_URL_PREFIX,
} from './config/upload.constants';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class UploadService {
	async save(
		file: Express.Multer.File | undefined,
	): Promise<UploadResponseDto> {
		if (!file) {
			throw new BadRequestException('No file provided');
		}

		if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
			const allowed = 'jpeg, png, webp, gif';
			throw new UnprocessableEntityException(
				`Invalid file type: ${file.mimetype}. Allowed: ${allowed}`,
			);
		}

		if (file.size > MAX_FILE_SIZE_BYTES) {
			throw new PayloadTooLargeException(
				`The file is too large. Maximum ${MAX_FILE_SIZE_MB} MB`,
			);
		}

		const filename = `${randomUUID().replace(/-/g, '')}${extname(file.originalname).toLowerCase()}`;

		await mkdir(MEDIA_ROOT, { recursive: true });
		await writeFile(join(MEDIA_ROOT, filename), file.buffer);

		return { url: `${MEDIA_URL_PREFIX}/${filename}` };
	}
}
