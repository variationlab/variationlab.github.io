import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import { isCurrentRoute, pathForHash } from '$lib/SiteRoutes';
import { memberProfileLinkIcons, type Authors, type Members, type Publication } from '$lib/types';
import { getMemberSlug } from '$lib/data/Members';
import {
	getLabAuthorMemberships,
	groupPublicationsByYear,
	sortPublicationsByDate,
	isDateWithinMembership,
	isLabAuthorForPublication
} from '$lib/data/Publications';

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const membersImagesDir = path.join(testsDir, '../../static/images/members');
const dataDir = path.join(testsDir, '../../static/data');

const members = JSON.parse(fs.readFileSync(path.join(dataDir, 'People.json'), 'utf8')) as Members[];
const publications = JSON.parse(
	fs.readFileSync(path.join(dataDir, 'Publications.json'), 'utf8')
) as Publication[];

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateString(value: string): boolean {
	if (!datePattern.test(value)) return false;
	const date = new Date(`${value}T00:00:00.000Z`);
	return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

describe('Data integrity', () => {
	it('maps every local member image to a member headshot', () => {
		const localHeadshots = fs
			.readdirSync(membersImagesDir)
			.filter((file) =>
				['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
			)
			.map((file) => `/images/members/${file}`)
			.sort();
		const dataHeadshots = members
			.map((member) => member.headshot)
			.filter((headshot): headshot is string => Boolean(headshot))
			.sort();

		expect(dataHeadshots).toEqual(localHeadshots);
	});

	it('requires an explicit supported extension and an existing file for every member headshot', () => {
		const headshots = members
			.map((member) => member.headshot)
			.filter((headshot): headshot is string => headshot !== undefined);

		expect(headshots.length).toBeGreaterThan(0);
		headshots.forEach((headshot) => {
			expect(
				headshot,
				'Use /images/members/filename with a .jpg, .jpeg, .png, or .webp extension'
			).toMatch(/^\/images\/members\/[^/\\]+\.(jpg|jpeg|png|webp)$/i);
			const filePath = path.join(membersImagesDir, path.basename(headshot));
			expect(fs.existsSync(filePath)).toBe(true);
		});
	});

	it('has complete publication records', () => {
		expect(publications.length).toBeGreaterThan(0);
		publications.forEach((publication) => {
			expect(publication.title).toBeTruthy();
			expect(publication.year).toBeGreaterThan(1900);
			expect(isValidDateString(publication.publishDate)).toBe(true);
			expect(publication.venue.fullName).toBeTruthy();
			expect(publication.venue.shortName).toBeTruthy();
			expect(publication.authors.length).toBeGreaterThan(0);
			publication.authors.forEach((author) => {
				expect(author.publicationName).toBeTruthy();
			});
		});
	});

	it('has publication names for every member', () => {
		const publicationNames = members.map((member) => member.publicationName);

		expect(publicationNames.every(Boolean)).toBe(true);
		expect(new Set(publicationNames).size).toBe(publicationNames.length);
	});

	it('has valid lab membership dates for every member', () => {
		members.forEach((member) => {
			expect(isValidDateString(member.startTime)).toBe(true);
			if (member.endTime) {
				expect(isValidDateString(member.endTime)).toBe(true);
				expect(member.startTime <= member.endTime).toBe(true);
			}
		});
	});

	it('has valid optional profile links', () => {
		expect(members.length).toBeGreaterThan(0);
		members.forEach((member) => {
			member.profileLinks?.forEach((link) => {
				expect(link.url.trim()).toBeTruthy();
				if (link.icon !== undefined) {
					expect(memberProfileLinkIcons).toContain(link.icon);
				}
				if (link.title !== undefined) {
					expect(link.title.trim()).toBeTruthy();
				}
			});
		});
	});

	it('has valid optional alumni role fields', () => {
		members.forEach((member) => {
			if (member.formerRole !== undefined) {
				expect(member.formerRole.trim()).toBeTruthy();
			}
			if (member.currentRole !== undefined) {
				expect(member.currentRole.trim()).toBeTruthy();
			}
		});
	});

	it('gives current members unique profile slugs', () => {
		const slugs = members
			.filter((member) => member.category !== 'alumni')
			.map((member) => getMemberSlug(member));

		expect(slugs.length).toBeGreaterThan(0);
		slugs.forEach((slug) => {
			expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
		});
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('has a bio for every current member', () => {
		const currentMembers = members.filter((member) => member.category !== 'alumni');

		expect(currentMembers.length).toBeGreaterThan(0);
		currentMembers.forEach((member) => {
			expect(member.bio?.trim()).toBeTruthy();
		});
	});

	it('has former roles for every alumni member', () => {
		const alumniMembers = members.filter((member) => member.category === 'alumni');

		expect(alumniMembers.length).toBeGreaterThan(0);
		alumniMembers.forEach((member) => {
			expect(member.formerRole?.trim()).toBeTruthy();
		});
	});

	it('only highlights authors whose publication name matches a member during lab time', () => {
		const labAuthorMemberships = getLabAuthorMemberships(members);
		const highlightedAuthors = publications.flatMap((publication) =>
			publication.authors
				.filter((author) => isLabAuthorForPublication(author, publication, labAuthorMemberships))
				.map((author) => ({ author, publication }))
		);

		expect(highlightedAuthors.length).toBeGreaterThan(0);
		highlightedAuthors.forEach(({ author, publication }) => {
			const membership = labAuthorMemberships.get(author.publicationName);

			expect(membership).toBeTruthy();
			if (membership) {
				expect(isDateWithinMembership(publication.publishDate, membership)).toBe(true);
			}
		});
	});

	it('applies lab-time author highlighting windows', () => {
		const labAuthor: Authors = {
			firstName: 'Example',
			lastName: 'Author',
			publicationName: 'Example Author'
		};
		const publication: Publication = {
			title: 'Example Publication',
			authors: [labAuthor],
			venue: {
				fullName: 'Example Venue',
				shortName: 'EV',
				venueType: 'conference'
			},
			year: 2021,
			publishDate: '2021-06-01',
			doi: ''
		};
		const memberships = getLabAuthorMemberships([
			{
				...labAuthor,
				category: 'member',
				currentAcademicStatus: 'phd-student',
				interests: [],
				startTime: '2020-01-01',
				endTime: '2022-12-31'
			}
		]);

		expect(isLabAuthorForPublication(labAuthor, publication, memberships)).toBe(true);
		expect(
			isLabAuthorForPublication(
				labAuthor,
				{ ...publication, publishDate: '2019-12-31' },
				memberships
			)
		).toBe(false);
		expect(
			isLabAuthorForPublication(
				labAuthor,
				{ ...publication, publishDate: '2023-01-01' },
				memberships
			)
		).toBe(false);
		expect(
			isLabAuthorForPublication(
				labAuthor,
				{ ...publication, publishDate: '2026-01-01' },
				getLabAuthorMemberships([
					{
						...labAuthor,
						category: 'member',
						currentAcademicStatus: 'phd-student',
						interests: [],
						startTime: '2020-01-01'
					}
				])
			)
		).toBe(true);
	});

	it('groups publications by descending year', () => {
		const groupedYears = groupPublicationsByYear(publications).map((group) => group.year);
		const sortedYears = [...groupedYears].sort((a, b) => b - a);

		expect(groupedYears).toEqual(sortedYears);
	});

	it('sorts publications by date without changing the input order', () => {
		const older = { ...publications[0], publishDate: '2025-12-01', year: 2025 };
		const newer = { ...publications[0], publishDate: '2026-08-01', year: 2026 };
		const earlierSameYear = { ...publications[0], publishDate: '2026-02-01', year: 2026 };
		const input = [older, earlierSameYear, newer];

		expect(sortPublicationsByDate(input)).toEqual([newer, earlierSameYear, older]);
		expect(input).toEqual([older, earlierSameYear, newer]);
		expect(groupPublicationsByYear(input)[0].publications).toEqual([newer, earlierSameYear]);
		expect(sortPublicationsByDate([])).toEqual([]);
	});

	it('maps old hash aliases to real paths', () => {
		expect(pathForHash('#/people')).toBe('/people');
		expect(pathForHash('#people')).toBe('/people');
		expect(pathForHash('#/publications')).toBe('/publications');
		expect(pathForHash('#/papers')).toBe('/publications');
		expect(pathForHash('#papers')).toBe('/publications');
		expect(pathForHash('#/courses')).toBe('/courses');
		expect(pathForHash('#courses')).toBe('/courses');
		expect(pathForHash('#/contact')).toBe('/contact');
		expect(pathForHash('#contact')).toBe('/contact');
		expect(pathForHash('#/')).toBeUndefined();
		expect(isCurrentRoute('/people/elena-l-glassman', '/people')).toBe(true);
		expect(isCurrentRoute('/publications', '/people')).toBe(false);
		expect(isCurrentRoute('/', '/')).toBe(true);
		expect(isCurrentRoute('/people', '/')).toBe(false);
	});
});
