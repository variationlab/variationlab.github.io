// Read static/images/members folder, and check if
// 0 - all files are .jpg
// 1 - all files are 1:1 aspect ratio, with maximum dimensions of 500x500

import fs from 'fs';
import path from 'path';
import { expect, describe, it, beforeAll } from 'vitest';

describe('Image integrity', () => {
	const imagesDir = path.join(__dirname, '../../static/images/members');
	let sizeOf: typeof import('image-size').imageSize | undefined;

	beforeAll(async () => {
		try {
			const mod = await import('image-size');
			sizeOf = mod.imageSize;
		} catch {
			sizeOf = undefined;
		}
	});

	it('should contain only .jpg or .jpeg files', () => {
		const files = fs.readdirSync(imagesDir);
		const allowed = ['.jpg', '.jpeg'];
		const invalidFiles = files.filter(
			(file) => !allowed.includes(path.extname(file).toLowerCase())
		);

		expect(invalidFiles).toEqual([]);
	});

	it('should have 1:1 aspect ratio and max dimensions of 500x500', () => {
		const allowed = ['.jpg', '.jpeg'];
		const imageFiles = fs
			.readdirSync(imagesDir)
			.filter((file) => allowed.includes(path.extname(file).toLowerCase()));

		expect(imageFiles.length).toBeGreaterThan(0);
		const readImageSize = sizeOf;
		if (!readImageSize) {
			throw new Error('image-size module was not loaded');
		}

		imageFiles.forEach((file) => {
			const filePath = path.join(imagesDir, file);
			const buffer = fs.readFileSync(filePath);
			const dims = readImageSize(buffer);

			expect(dims).toBeDefined();
			expect(dims.width).toBeLessThan(500);
			expect(dims.height).toBeLessThan(500);
			expect(dims.width).toBe(dims.height);
		});
	});
});
