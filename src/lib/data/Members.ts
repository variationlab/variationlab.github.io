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

export function getMemberStatus(member: Members): string {
	if (member.category === 'alumni' && member.currentRole) return member.currentRole;
	if (member.firstName === 'Elena') return 'Assistant Professor of Computer Science, SEAS';
	if (member.firstName === 'Chelse' || member.firstName === 'Ziwei')
		return 'PhD student, Computer Science';
	if (member.firstName === 'Chau' || member.firstName === 'Ruishi')
		return 'Incoming PhD student, Computer Science';
	return 'Lab member';
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
