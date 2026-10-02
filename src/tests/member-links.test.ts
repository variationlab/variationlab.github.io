import { describe, expect, it } from 'vitest';
import type { Members } from '$lib/types';
import {
	getMemberEmailLink,
	getMemberGitHubLink,
	getMemberGoogleScholarLink,
	getMemberShortRole,
	getMemberStatus,
	orderActiveMembers,
	getMemberSocialLinks,
	getMemberWebsiteLink,
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

	it('keeps website links separate from profile dropdown links', () => {
		const member = { ...baseMember, url: 'https://example.edu' };

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
			googleScholar: 'https://scholar.google.com/citations?user=example'
		};

		expect(getMemberGoogleScholarLink(member)).toEqual({
			kind: 'googleScholar',
			label: 'Google Scholar',
			url: 'https://scholar.google.com/citations?user=example'
		});
		expect(getMemberSocialLinks(member)).toEqual([]);
	});

	it('keeps GitHub as a direct profile button link', () => {
		const member = { ...baseMember, github: 'https://github.com/example' };

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
			github: 'https://github.com/example',
			googleScholar: 'https://scholar.google.com/citations?user=example',
			contact: {
				linkedin: 'https://linkedin.com/in/example',
				twitter: 'https://twitter.com/example',
				bluesky: 'https://bsky.app/profile/example.bsky.social'
			}
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

	it('uses alumni current roles as display status', () => {
		const member: Members = {
			...baseMember,
			category: 'alumni',
			currentAcademicStatus: 'faculty',
			currentRole: 'Assistant Professor at Example University'
		};

		expect(getMemberStatus(member)).toBe('Assistant Professor at Example University');
	});
});
