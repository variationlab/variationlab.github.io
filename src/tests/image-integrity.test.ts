// Member headshots must use supported extensions and be square, at most 650 × 650 px.
// These content constraints are intentionally independent of the reusable Image component.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { imageSize } from 'image-size';
import { expect, describe, it } from 'vitest';

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const testsDir = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(testsDir, '../../static/images/members');

describe('Image integrity', () => {
	it('should contain only .jpg, .jpeg, .png, or .webp files', () => {
		const invalidFiles = fs
			.readdirSync(imagesDir)
			.filter((file) => file !== '.DS_Store')
			.filter((file) => !allowedExtensions.includes(path.extname(file).toLowerCase()));

		expect(invalidFiles).toEqual([]);
	});

	it('should have 1:1 aspect ratio and max dimensions of 650x650 inclusive', () => {
		const imageFiles = fs
			.readdirSync(imagesDir)
			.filter((file) => allowedExtensions.includes(path.extname(file).toLowerCase()));

		expect(imageFiles.length).toBeGreaterThan(0);
		imageFiles.forEach((file) => {
			const dims = imageSize(fs.readFileSync(path.join(imagesDir, file)));

			expect(dims.width, file).toBeGreaterThan(0);
			expect(dims.height, file).toBeGreaterThan(0);
			expect(dims.width, file).toBeLessThanOrEqual(650);
			expect(dims.height, file).toBeLessThanOrEqual(650);
			expect(dims.width, `${file} must be square`).toBe(dims.height);
		});
	});
});
