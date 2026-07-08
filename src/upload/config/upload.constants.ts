import { join } from 'node:path';

export const MEDIA_ROOT = join(process.cwd(), 'media');
export const MEDIA_URL_PREFIX = '/media';

export const ALLOWED_MIME_TYPES = new Set([
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
]);
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
