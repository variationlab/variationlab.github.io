import { describe, expect, it } from 'vitest';
import type { Members } from '$lib/types';
import {
	getMemberEmailLink,
	getMemberGitHubLink,
	getMemberGoogleScholarLink,
	getMemberName,
	getMemberProfileLinks,
	getMemberProfilePath,
	getMemberShortRole,
	getMemberSlug,
	getMemberStatus,
	orderActiveMembers,
	getMemberSocialLinks,
	getMemberWebsiteLink,
	groupAlumniMembers,
	hasMemberSocialLinks
} from '$lib/data/Members';

const baseMember: Members = {
	firstName: 'Example',
	lastName: 'Member',
	publicationName: 'Example Member',
	category: 'member',
	currentAcademicStatus: 'phd-student',
	interests: [],
	startTime: '2024-01-01'
};

describe('Member contact link helpers', () => {
	it('keeps active faculty first and orders everyone else by start date without changing the input', () => {
		const studentA = { ...baseMember, publicationName: 'Student A', startTime: '2024-01-01' };
		const studentB = { ...baseMember, publicationName: 'Student B', startTime: '2022-09-01' };
		const studentC = { ...baseMember, publicationName: 'Student C', startTime: '2022-09-01' };
		const faculty: Members = {
			...baseMember,
			publicationName: 'Faculty',
			currentAcademicStatus: 'faculty',
			startTime: '2010-01-01'
		};
		const secondFaculty: Members = {
			...faculty,
			publicationName: 'Second Faculty',
			startTime: '2015-01-01'
		};
		const alumni: Members = { ...faculty, publicationName: 'Alumni', category: 'alumni' };
		const input = [studentA, faculty, alumni, studentC, studentB, secondFaculty];
		expect(orderActiveMembers(input)).toEqual([
			faculty,
			secondFaculty,
			studentC,
			studentB,
			studentA
		]);
		expect(input).toEqual([studentA, faculty, alumni, studentC, studentB, secondFaculty]);
		expect(orderActiveMembers([])).toEqual([]);
		expect(orderActiveMembers([studentA])).toEqual([studentA]);
	});
	it('builds a stable profile path from the publication name', () => {
		expect(getMemberSlug({ ...baseMember, publicationName: 'Elena L. Glassman' })).toBe(
			'elena-l-glassman'
		);
		expect(getMemberProfilePath({ ...baseMember, publicationName: 'Ziwei Gu' })).toBe(
			'/people/ziwei-gu'
		);
	});

	it('uses the role before the department on short labels', () => {
		expect(
			getMemberShortRole({
				...baseMember,
				currentRole: 'Assistant Professor, Computer Science, SEAS'
			})
		).toBe('Assistant Professor');
		expect(
			getMemberShortRole({ ...baseMember, currentRole: 'PhD Student, Computer Science' })
		).toBe('PhD Student');
		expect(getMemberShortRole(baseMember)).toBe('PhD Student');
	});

	it('uses explicit current roles regardless of name or category', () => {
		for (const firstName of ['Elena', 'Chau', 'Ruishi', 'Example']) {
			expect(getMemberStatus({ ...baseMember, firstName, currentRole: 'Research scientist' })).toBe(
				'Research scientist'
			);
			expect(getMemberStatus({ ...baseMember, firstName })).toBe('PhD Student');
		}
	});

	it.each([
		['undergrad', 'Undergraduate student'],
		['master', 'Master’s student'],
		['phd-student', 'PhD Student'],
		['phd-candidate', 'PhD candidate'],
		['phd-graduated', 'PhD graduate'],
		['postdoc', 'Postdoctoral researcher'],
		['faculty', 'Faculty'],
		['other', 'Lab member']
	] as const)('labels %s without assuming a department', (currentAcademicStatus, label) => {
		expect(getMemberStatus({ ...baseMember, currentAcademicStatus })).toBe(label);
	});

	it('creates a mailto link for email addresses', () => {
		const member = { ...baseMember, email: 'example@example.edu' };

		expect(getMemberEmailLink(member)).toEqual({
			kind: 'email',
			label: 'Email',
			url: 'mailto:example@example.edu'
		});
	});

	it('defaults a generic profile link to the website icon', () => {
		expect(
			getMemberProfileLinks({
				...baseMember,
				profileLinks: [
					{ url: ' https://example.edu/lab ' },
					{ url: 'https://github.com/example', icon: 'github' }
				]
			})
		).toEqual([
			{ url: 'https://example.edu/lab', icon: 'website' },
			{ url: 'https://github.com/example', icon: 'github' }
		]);
		expect(getMemberProfileLinks(baseMember)).toEqual([]);
		expect(
			getMemberProfileLinks({
				...baseMember,
				profileLinks: [{ url: 'https://example.edu/talk', title: ' Lab talk ' }]
			})
		).toEqual([{ url: 'https://example.edu/talk', icon: 'website', title: 'Lab talk' }]);
	});

	it('keeps website links separate from profile dropdown links', () => {
		const member = {
			...baseMember,
			profileLinks: [
				{ url: 'https://example.edu/notes', title: 'Notes' },
				{ url: 'https://example.edu' }
			]
		};

		expect(getMemberWebsiteLink(member)).toEqual({
			kind: 'website',
			label: 'Website',
			url: 'https://example.edu'
		});
		expect(getMemberSocialLinks(member)).toEqual([]);
	});

	it('keeps Google Scholar as a direct profile button link', () => {
		const member = {
			...baseMember,
			profileLinks: [
				{ url: 'https://scholar.google.com/citations?user=example', icon: 'googleScholar' as const }
			]
		};

		expect(getMemberGoogleScholarLink(member)).toEqual({
			kind: 'googleScholar',
			label: 'Google Scholar',
			url: 'https://scholar.google.com/citations?user=example'
		});
		expect(getMemberSocialLinks(member)).toEqual([]);
	});

	it('keeps GitHub as a direct profile button link', () => {
		const member = {
			...baseMember,
			profileLinks: [{ url: 'https://github.com/example', icon: 'github' as const }]
		};

		expect(getMemberGitHubLink(member)).toEqual({
			kind: 'github',
			label: 'GitHub',
			url: 'https://github.com/example'
		});
		expect(getMemberSocialLinks(member)).toEqual([]);
	});

	it('collects only available social dropdown links', () => {
		const member: Members = {
			...baseMember,
			profileLinks: [
				{ url: 'https://github.com/example', icon: 'github' },
				{ url: 'https://scholar.google.com/citations?user=example', icon: 'googleScholar' },
				{ url: 'https://linkedin.com/in/example', icon: 'linkedin' },
				{ url: 'https://twitter.com/example', icon: 'twitter' },
				{ url: 'https://bsky.app/profile/example.bsky.social', icon: 'bluesky' }
			]
		};

		expect(getMemberSocialLinks(member)).toEqual([
			{ kind: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/example' },
			{ kind: 'twitter', label: 'Twitter', url: 'https://twitter.com/example' },
			{
				kind: 'bluesky',
				label: 'Bluesky',
				url: 'https://bsky.app/profile/example.bsky.social'
			}
		]);
		expect(hasMemberSocialLinks(member)).toBe(true);
	});

	it('returns no empty dropdown data for members without social links', () => {
		expect(getMemberSocialLinks(baseMember)).toEqual([]);
		expect(hasMemberSocialLinks(baseMember)).toBe(false);
	});

	it('shows a nickname before the first name but keeps the publication name for papers', () => {
		const member: Members = {
			...baseMember,
			firstName: 'Ning-Er',
			nickName: 'Nina',
			lastName: 'Lei',
			publicationName: 'Nina Lei'
		};

		expect(getMemberName(member)).toBe('Nina (Ning-Er) Lei');
		expect(getMemberName({ ...member, nickName: 'Ning-Er' })).toBe('Nina Lei');
		expect(getMemberName(baseMember)).toBe('Example Member');
	});

	it('uses alumni current roles as display status', () => {
		const member: Members = {
			...baseMember,
			category: 'alumni',
			currentAcademicStatus: 'faculty',
			currentRole: 'Assistant Professor at Example University'
		};

		expect(getMemberStatus(member)).toBe('Assistant Professor at Example University');
	});

	it('groups alumni by former lab role in display order and drops empty groups', () => {
		const alumni: Members = { ...baseMember, category: 'alumni' };
		const postdoc = {
			...alumni,
			publicationName: 'Postdoc',
			formerRole: 'Postdoctoral researcher'
		};
		const graduate: Members = {
			...alumni,
			publicationName: 'Graduate',
			currentAcademicStatus: 'phd-graduated',
			formerRole: 'PhD Student'
		};
		const visitor = {
			...alumni,
			publicationName: 'Visitor',
			formerRole: 'Visiting doctoral scholar'
		};
		const intern = { ...alumni, publicationName: 'Intern', formerRole: 'Undergraduate researcher' };
		const studentIntern = {
			...alumni,
			publicationName: 'Student Intern',
			formerRole: 'Student intern'
		};
		const affiliate: Members = {
			...alumni,
			publicationName: 'Affiliate',
			currentAcademicStatus: 'phd-student',
			formerRole: 'PhD Student'
		};
		const current = {
			...baseMember,
			publicationName: 'Current',
			formerRole: 'Postdoctoral researcher'
		};

		expect(
			groupAlumniMembers([affiliate, intern, visitor, current, postdoc, studentIntern, graduate])
		).toEqual([
			{ key: 'postdocs', title: 'Postdocs and PhD Graduates', members: [postdoc, graduate] },
			{ key: 'visitors', title: 'Visiting Scholars', members: [visitor] },
			{ key: 'interns', title: 'Undergraduate Researchers', members: [intern, studentIntern] },
			{ key: 'affiliates', title: 'Former Affiliates', members: [affiliate] }
		]);
		expect(groupAlumniMembers([visitor])).toEqual([
			{ key: 'visitors', title: 'Visiting Scholars', members: [visitor] }
		]);
		expect(groupAlumniMembers([current])).toEqual([]);
	});
});
