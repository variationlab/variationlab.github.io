import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import { isCurrentRoute, pathForHash } from '$lib/SiteRoutes';
import {
	alumniGroupKeys,
	memberProfileLinkIcons,
	type Authors,
	type Members,
	type Publication
} from '$lib/types';
import { getMemberSlug } from '$lib/data/Members';
import {
	getAwardLabel,
	getEqualContributionLabel,
	getLabAuthorHomepage,
	getLabAuthorMemberships,
	getPublicationLinks,
	getSelectedPublications,
	getTeaserKind,
	getVenueLabel,
	groupPublicationsByYear,
	sortPublicationsByDate,
	isDateWithinMembership,
	isLabAuthorForPublication
} from '$lib/data/Publications';

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const membersImagesDir = path.join(testsDir, '../../static/images/members');
const teaserImagesDir = path.join(testsDir, '../../static/images/teaser');
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

	it('requires a supported extension and an existing file for every publication teaser', () => {
		const teasers = publications
			.map((publication) => publication.teaser)
			.filter((teaser): teaser is string => teaser !== undefined);
		const unreferencedFiles = fs
			.readdirSync(teaserImagesDir)
			.filter((file) => getTeaserKind(file) !== undefined)
			.filter((file) => !teasers.includes(`/images/teaser/${file}`));

		expect(unreferencedFiles, 'Every teaser file must be referenced by a publication').toEqual([]);
		teasers.forEach((teaser) => {
			expect(
				teaser,
				'Use /images/teaser/filename with a .jpg, .jpeg, .png, .webp, .gif, .mp4, or .webm extension'
			).toMatch(/^\/images\/teaser\/[^/\\]+\.(jpg|jpeg|png|webp|gif|mp4|webm)$/i);
			const filePath = path.join(teaserImagesDir, path.basename(teaser));
			expect(fs.existsSync(filePath), teaser).toBe(true);
		});
	});

	it('detects teaser media kind from the file extension', () => {
		expect(getTeaserKind('/images/teaser/demo.png')).toBe('image');
		expect(getTeaserKind('/images/teaser/demo.GIF')).toBe('image');
		expect(getTeaserKind('/images/teaser/demo.webm')).toBe('video');
		expect(getTeaserKind('/images/teaser/demo.mp4?v=2')).toBe('video');
		expect(getTeaserKind('/images/teaser/demo.mov')).toBeUndefined();
	});

	it('has complete publication records', () => {
		expect(publications.length).toBeGreaterThan(0);
		publications.forEach((publication) => {
			expect(publication.title).toBeTruthy();
			expect(publication.year).toBeGreaterThan(1900);
			expect(isValidDateString(publication.publishDate)).toBe(true);
			expect(typeof publication.doi, `${publication.title} needs a doi ("" if unpublished)`).toBe(
				'string'
			);
			expect(publication.venue.fullName).toBeTruthy();
			expect(publication.venue.shortName).toBeTruthy();
			expect(publication.authors.length).toBeGreaterThan(0);
			publication.authors.forEach((author) => {
				expect(author.publicationName).toBeTruthy();
			});
		});
	});

	it('marks shared first or last authorship on at least two authors', () => {
		publications.forEach((publication) => {
			const counts = new Map<string, number>();
			publication.authors.forEach(({ equalContribution }) => {
				if (equalContribution)
					counts.set(equalContribution, (counts.get(equalContribution) ?? 0) + 1);
			});
			counts.forEach((count, kind) => {
				expect(count, `${publication.title} has only one ${kind} author`).toBeGreaterThan(1);
			});
		});
	});

	it('labels shared first and last authorship', () => {
		const author: Authors = {
			firstName: 'Example',
			lastName: 'Author',
			publicationName: 'Example Author'
		};

		expect(getEqualContributionLabel(author)).toBeUndefined();
		expect(getEqualContributionLabel({ ...author, equalContribution: 'co-first' })).toBe(
			'Co-first author'
		);
		expect(getEqualContributionLabel({ ...author, equalContribution: 'co-last' })).toBe(
			'Co-last corresponding author'
		);
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
			if (member.roleAtLab !== undefined) {
				expect(member.roleAtLab.trim()).toBeTruthy();
			}
			if (member.currentRole !== undefined) {
				expect(member.currentRole.trim()).toBeTruthy();
			}
			if (member.office !== undefined) {
				expect(member.office.trim()).toBeTruthy();
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

	it('keeps currentRole (where they went next) for alumni only', () => {
		const currentMembers = members.filter((member) => member.category !== 'alumni');

		currentMembers.forEach((member) => {
			expect(member.currentRole, `${member.publicationName} should use roleAtLab`).toBeUndefined();
		});
	});

	it('has a lab role for every alumni member', () => {
		const alumniMembers = members.filter((member) => member.category === 'alumni');

		expect(alumniMembers.length).toBeGreaterThan(0);
		alumniMembers.forEach((member) => {
			expect(member.roleAtLab?.trim()).toBeTruthy();
		});
	});

	it('puts every alumni member, and only alumni, in a valid alumni group', () => {
		members.forEach((member) => {
			if (member.category === 'alumni') {
				expect(
					alumniGroupKeys,
					`${member.publicationName} needs an alumniGroup (${alumniGroupKeys.join(', ')})`
				).toContain(member.alumniGroup);
			} else {
				expect(
					member.alumniGroup,
					`${member.publicationName} is not alumni and should have no alumniGroup`
				).toBeUndefined();
			}
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

	it('has boolean isSelected flags and at least one selected publication', () => {
		publications.forEach((publication) => {
			if (publication.isSelected !== undefined) {
				expect(typeof publication.isSelected, publication.title).toBe('boolean');
			}
		});
		expect(getSelectedPublications(publications).length).toBeGreaterThan(0);
	});

	it('returns only selected publications, newest first', () => {
		const older = { ...publications[0], publishDate: '2024-03-01', isSelected: true };
		const newer = { ...publications[0], publishDate: '2026-03-01', isSelected: true };
		const unselected = { ...publications[0], publishDate: '2026-06-01', isSelected: false };
		const unset = { ...publications[0], publishDate: '2026-07-01', isSelected: undefined };

		expect(getSelectedPublications([older, unselected, newer, unset])).toEqual([newer, older]);
		expect(getSelectedPublications([])).toEqual([]);
	});

	it('links matched lab authors to their homepage only during lab time', () => {
		const author: Authors = { firstName: 'Lab', lastName: 'Member', publicationName: 'Lab Member' };
		const outsider: Authors = { firstName: 'Out', lastName: 'Sider', publicationName: 'Out Sider' };
		const memberBase = {
			category: 'member' as const,
			currentAcademicStatus: 'phd-student' as const,
			interests: [],
			startTime: '2020-01-01',
			endTime: '2022-12-31'
		};
		const memberships = getLabAuthorMemberships([
			{
				...author,
				...memberBase,
				profileLinks: [{ url: 'https://example.com/lab-member', icon: 'website' }]
			},
			{ ...outsider, ...memberBase, publicationName: 'No Homepage' }
		]);
		const during = { ...publications[0], publishDate: '2021-06-01' };
		const after = { ...publications[0], publishDate: '2023-06-01' };
		const noHomepage: Authors = { ...outsider, publicationName: 'No Homepage' };

		expect(getLabAuthorHomepage(author, during, memberships)).toBe(
			'https://example.com/lab-member'
		);
		expect(getLabAuthorHomepage(author, after, memberships)).toBeUndefined();
		expect(getLabAuthorHomepage(outsider, during, memberships)).toBeUndefined();
		expect(getLabAuthorHomepage(noHomepage, during, memberships)).toBeUndefined();
	});

	it('uses valid venue types and link URLs in every publication', () => {
		const venueTypes = [
			'conference',
			'journal',
			'workshop',
			'arxiv',
			'pending',
			'competition',
			'course',
			'research',
			'other'
		];
		const urlPattern = /^(https?:\/\/|\/)/;

		publications.forEach((publication) => {
			expect(venueTypes, publication.title).toContain(publication.venue.venueType);
			const urls = [
				...getPublicationLinks(publication).map((link) => link.url),
				publication.awardLink
			].filter((url): url is string => url !== undefined);
			urls.forEach((url) => expect(url, publication.title).toMatch(urlPattern));
			if (publication.doi !== '') {
				expect(publication.doi, `${publication.title} DOI, without https://doi.org/`).toMatch(
					/^10\.\d{4,9}\/\S+$/
				);
			}
		});
	});

	it('labels venues with the abbreviation and year, adding Proc. for main proceedings', () => {
		const base = publications[0];
		const withVenue = (venue: Publication['venue'], year = 2026): Publication => ({
			...base,
			venue,
			year
		});

		expect(
			getVenueLabel(
				withVenue({
					fullName: 'ACM CHI Conference on Human Factors in Computing Systems',
					shortName: 'CHI',
					venueType: 'conference'
				})
			)
		).toBe('ACM CHI Conference on Human Factors in Computing Systems (Proc. CHI 2026)');
		expect(
			getVenueLabel(
				withVenue(
					{
						fullName: 'ACM Transactions on Computer-Human Interaction',
						shortName: 'TOCHI',
						venueType: 'journal'
					},
					2024
				)
			)
		).toBe('ACM Transactions on Computer-Human Interaction (TOCHI 2024)');
		expect(
			getVenueLabel(withVenue({ fullName: 'arXiv', shortName: 'arXiv', venueType: 'arxiv' }))
		).toBe('arXiv 2026');
	});

	it('labels standard awards from the award type and keeps awardText for other awards', () => {
		const base = { ...publications[0], award: undefined, awardText: undefined };

		expect(getAwardLabel(base)).toBeUndefined();
		expect(getAwardLabel({ ...base, award: 'best-paper' })).toBe('Best Paper Award');
		expect(getAwardLabel({ ...base, award: 'honorable-mention' })).toBe('Honorable Mention Award');
		expect(getAwardLabel({ ...base, award: 'other', awardText: 'Best Demo Award' })).toBe(
			'Best Demo Award'
		);
		publications.forEach((publication) => {
			if (publication.awardText !== undefined) {
				expect(publication.award, `${publication.title} awardText needs award: 'other'`).toBe(
					'other'
				);
			}
			if (publication.award === 'other') {
				expect(publication.awardText?.trim(), publication.title).toBeTruthy();
			}
		});
	});

	it('uses only the standard publication fields', () => {
		const standardFields = new Set([
			'title',
			'authors',
			'venue',
			'year',
			'publishDate',
			'doi',
			'affiliation',
			'award',
			'awardText',
			'awardLink',
			'isSelected',
			'paperLink',
			'exploreLink',
			'codeLink',
			'videoLink',
			'presentationLink',
			'materialLink',
			'slidesLink',
			'teaser'
		]);

		publications.forEach((publication) => {
			const customFields = Object.keys(publication).filter((key) => !standardFields.has(key));
			expect(customFields, `${publication.title} uses custom fields`).toEqual([]);
		});
	});

	it('orders publication links and drops repeated URLs', () => {
		const publication: Publication = {
			title: 'Example Publication',
			authors: [{ firstName: 'Example', lastName: 'Author', publicationName: 'Example Author' }],
			venue: { fullName: 'Example Venue', shortName: 'EV', venueType: 'conference' },
			year: 2024,
			publishDate: '2024-05-01',
			doi: '10.1145/3613904.3642000',
			paperLink: 'https://example.com/paper.pdf',
			codeLink: 'https://github.com/example/code',
			slidesLink: 'https://example.com/slides',
			exploreLink: 'https://example.com/demo',
			materialLink: 'https://example.com/demo'
		};

		expect(getPublicationLinks(publication)).toEqual([
			{ kind: 'doi', name: 'DOI', url: 'https://doi.org/10.1145/3613904.3642000' },
			{ kind: 'paperLink', name: 'Paper', url: 'https://example.com/paper.pdf' },
			{ kind: 'exploreLink', name: 'Explore', url: 'https://example.com/demo' },
			{ kind: 'codeLink', name: 'Code', url: 'https://github.com/example/code' },
			{ kind: 'slidesLink', name: 'Slides', url: 'https://example.com/slides' }
		]);
	});
});
