import type { MemberProfileLinkIcon, Members } from '$lib/types';

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
	key: 'postdocs' | 'visitors' | 'interns';
	title: string;
	members: Members[];
};

/** Groups alumni by their role in the lab (`formerRole`), keeping data order and dropping empty groups. */
export function groupAlumniMembers(members: Members[]): AlumniGroup[] {
	const groups: AlumniGroup[] = [
		{ key: 'postdocs', title: 'Postdocs and PhD Graduates', members: [] },
		{ key: 'visitors', title: 'Visiting Scholars', members: [] },
		{ key: 'interns', title: 'Student Interns', members: [] }
	];
	const [postdocs, visitors, interns] = groups;

	members
		.filter((member) => member.category === 'alumni')
		.forEach((member) => {
			const formerRole = member.formerRole?.toLowerCase() ?? '';
			if (formerRole.includes('visiting')) {
				visitors.members.push(member);
			} else if (
				formerRole.includes('postdoc') ||
				member.currentAcademicStatus === 'phd-graduated'
			) {
				postdocs.members.push(member);
			} else {
				interns.members.push(member);
			}
		});

	return groups.filter((group) => group.members.length > 0);
}
