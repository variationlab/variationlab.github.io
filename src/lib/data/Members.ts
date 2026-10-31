import type { AlumniGroupKey, MemberProfileLinkIcon, Members } from '$lib/types';

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
	const nickName = member.nickName?.trim();
	if (nickName && nickName !== member.firstName) {
		return `${nickName} (${member.firstName}) ${member.lastName}`;
	}
	return member.publicationName;
}

export function getMemberSlug(member: Members): string {
	return getMemberName(member)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export function getMemberProfilePath(member: Members): string {
	return `/people/${getMemberSlug(member)}`;
}

// Active members are listed faculty, postdocs, PhD students, master's students, then undergrads;
// any other status goes last.
const activeStatusRank: Record<Members['currentAcademicStatus'], number> = {
	faculty: 0,
	postdoc: 1,
	'phd-candidate': 2,
	'phd-student': 2,
	master: 3,
	undergrad: 4,
	'phd-graduated': 5,
	other: 5
};

/** Active (non-alumni) members by status, then by start date within each status. */
export function orderActiveMembers(members: Members[]): Members[] {
	return members
		.filter((member) => member.category !== 'alumni')
		.sort(
			(a, b) =>
				activeStatusRank[a.currentAcademicStatus] - activeStatusRank[b.currentAcademicStatus] ||
				a.startTime.localeCompare(b.startTime)
		);
}

/** Current members show their role in the lab; alumni show where they went next. */
export function getMemberStatus(member: Members): string {
	const role = member.category === 'alumni' ? member.currentRole : member.roleAtLab;
	if (role?.trim()) return role;
	const labels: Record<Members['currentAcademicStatus'], string> = {
		undergrad: 'Undergraduate student',
		master: 'Master’s student',
		'phd-student': 'PhD Student',
		'phd-candidate': 'PhD candidate',
		'phd-graduated': 'PhD graduate',
		postdoc: 'Postdoctoral researcher',
		faculty: 'Faculty',
		other: 'Lab member'
	};
	return labels[member.currentAcademicStatus];
}

export function getMemberShortRole(member: Members): string {
	return getMemberStatus(member).split(',')[0].trim();
}

export function getMemberEmailLink(member: Members): MemberDirectLink | undefined {
	if (!member.email) return undefined;
	return {
		kind: 'email',
		label: 'Email',
		url: `mailto:${member.email}`
	};
}

export function getMemberProfileLinks(
	member: Members
): { url: string; icon: MemberProfileLinkIcon; title?: string }[] {
	return (member.profileLinks ?? [])
		.filter((link) => link.url.trim())
		.map((link) => ({
			url: link.url.trim(),
			icon: link.icon ?? 'website',
			...(link.title?.trim() ? { title: link.title.trim() } : {})
		}));
}

function getMemberProfileLink(
	member: Members,
	icon: MemberProfileLinkIcon,
	kind: MemberDirectLink['kind'],
	label: string
): MemberDirectLink | undefined {
	const link = getMemberProfileLinks(member).find((item) => item.icon === icon);
	if (!link) return undefined;
	return {
		kind,
		label,
		url: link.url
	};
}

export function getMemberWebsiteLink(member: Members): MemberDirectLink | undefined {
	const links = getMemberProfileLinks(member).filter((item) => item.icon === 'website');
	const link = links.find((item) => !item.title) ?? links[0];
	if (!link) return undefined;
	return {
		kind: 'website',
		label: 'Website',
		url: link.url
	};
}

export function getMemberGoogleScholarLink(member: Members): MemberDirectLink | undefined {
	return getMemberProfileLink(member, 'googleScholar', 'googleScholar', 'Google Scholar');
}

export function getMemberGitHubLink(member: Members): MemberDirectLink | undefined {
	return getMemberProfileLink(member, 'github', 'github', 'GitHub');
}

export function getMemberSocialLinks(member: Members): MemberSocialLink[] {
	const labels = {
		linkedin: 'LinkedIn',
		twitter: 'Twitter',
		bluesky: 'Bluesky'
	} as const;
	const links = getMemberProfileLinks(member);

	return (['linkedin', 'twitter', 'bluesky'] as const).flatMap((kind) =>
		links
			.filter((link) => link.icon === kind)
			.map((link) => ({
				kind,
				label: labels[kind],
				url: link.url
			}))
	);
}

export function hasMemberSocialLinks(member: Members): boolean {
	return getMemberSocialLinks(member).length > 0;
}

export type AlumniGroup = {
	key: AlumniGroupKey;
	title: string;
	members: Members[];
};

/** Groups alumni by `alumniGroup` (required for alumni by the data-integrity test), keeping data order and dropping empty groups. */
export function groupAlumniMembers(members: Members[]): AlumniGroup[] {
	const groups: AlumniGroup[] = [
		{ key: 'postdocs', title: 'Postdocs and PhD Graduates', members: [] },
		{ key: 'visitors', title: 'Visiting Scholars', members: [] },
		{ key: 'masters', title: 'Master’s Researchers', members: [] },
		{ key: 'interns', title: 'Undergraduate Researchers', members: [] },
		{ key: 'affiliates', title: 'Former Affiliates', members: [] }
	];

	members
		.filter((member) => member.category === 'alumni')
		.forEach((member) => {
			groups.find((group) => group.key === member.alumniGroup)?.members.push(member);
		});

	return groups.filter((group) => group.members.length > 0);
}
