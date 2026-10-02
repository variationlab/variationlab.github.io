import type { Members } from '$lib/types';

export type MemberDirectLink = {
	kind: 'email' | 'website' | 'googleScholar' | 'github';
	label: string;
	url: string;
};

export type MemberSocialLink = {
	kind: 'linkedin' | 'twitter' | 'bluesky';
	label: string;
	url: string;
};

export function getMemberName(member: Members): string {
	return member.publicationName;
}

export function orderActiveMembers(members: Members[]): Members[] {
	const active = members.filter((member) => member.category !== 'alumni');
	const faculty = active.filter((member) => member.currentAcademicStatus === 'faculty');
	const others = active
		.filter((member) => member.currentAcademicStatus !== 'faculty')
		.sort((a, b) => a.startTime.localeCompare(b.startTime));
	return [...faculty, ...others];
}

export function getMemberStatus(member: Members): string {
	if (member.currentRole?.trim()) return member.currentRole;
	const labels: Record<Members['currentAcademicStatus'], string> = {
		undergrad: 'Undergraduate student',
		master: 'Master’s student',
		'phd-student': 'PhD student',
		'phd-candidate': 'PhD candidate',
		'phd-graduated': 'PhD graduate',
		postdoc: 'Postdoctoral researcher',
		faculty: 'Faculty',
		other: 'Lab member'
	};
	return labels[member.currentAcademicStatus];
}

export function getMemberEmailLink(member: Members): MemberDirectLink | undefined {
	if (!member.email) return undefined;
	return {
		kind: 'email',
		label: 'Email',
		url: `mailto:${member.email}`
	};
}

export function getMemberWebsiteLink(member: Members): MemberDirectLink | undefined {
	if (!member.url) return undefined;
	return {
		kind: 'website',
		label: 'Website',
		url: member.url
	};
}

export function getMemberGoogleScholarLink(member: Members): MemberDirectLink | undefined {
	if (!member.googleScholar) return undefined;
	return {
		kind: 'googleScholar',
		label: 'Google Scholar',
		url: member.googleScholar
	};
}

export function getMemberGitHubLink(member: Members): MemberDirectLink | undefined {
	if (!member.github) return undefined;
	return {
		kind: 'github',
		label: 'GitHub',
		url: member.github
	};
}

export function getMemberSocialLinks(member: Members): MemberSocialLink[] {
	return [
		member.contact?.linkedin
			? { kind: 'linkedin' as const, label: 'LinkedIn', url: member.contact.linkedin }
			: undefined,
		member.contact?.twitter
			? { kind: 'twitter' as const, label: 'Twitter', url: member.contact.twitter }
			: undefined,
		member.contact?.bluesky
			? { kind: 'bluesky' as const, label: 'Bluesky', url: member.contact.bluesky }
			: undefined
	].filter((link): link is MemberSocialLink => Boolean(link));
}

export function hasMemberSocialLinks(member: Members): boolean {
	return getMemberSocialLinks(member).length > 0;
}
