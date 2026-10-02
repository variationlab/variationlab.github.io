export interface Authors {
	firstName: string;
	lastName: string;
	middleName?: string;
	publicationName: string;
}

export interface Members extends Authors {
	nickName?: string;
	email?: string;
	/** Profile URLs. Each uses the website icon unless `icon` is set. A generic link can set `title`. */
	profileLinks?: MemberProfileLink[];
	category: 'faculty' | 'alumni' | 'member' | 'staff' | 'other';
	currentAcademicStatus:
		| 'undergrad'
		| 'master'
		| 'phd-student'
		| 'phd-candidate'
		| 'phd-graduated'
		| 'postdoc'
		| 'faculty'
		| 'other';
	/** Full /images/members/ path including .jpg, .jpeg, .png, or .webp; square, at most 650 × 650 px. */
	headshot?: string;
	interests: string[];
	/** Shown under research interests. Used for current members. */
	bio?: string;
	startTime: string;
	endTime?: string;
	formerRole?: string;
	/** Display title for any member; otherwise use the general academic-status label. */
	currentRole?: string;
}

export const memberProfileLinkIcons = [
	'website',
	'github',
	'googleScholar',
	'linkedin',
	'twitter',
	'bluesky'
] as const;

export type MemberProfileLinkIcon = (typeof memberProfileLinkIcons)[number];

export interface MemberProfileLink {
	url: string;
	icon?: MemberProfileLinkIcon;
	/** Shown under the bio for a generic link. The personal website omits this and stays under the photo. */
	title?: string;
}

export type Venue = {
	fullName: string;
	shortName: string;
	venueType: 'conference' | 'journal' | 'workshop' | 'book' | 'other';
};

export type Supplemental = {
	name: string;
	url: string;
};

export interface Publication {
	title: string;
	authors: Authors[];
	venue: Venue;
	year: number;
	publishDate: string;
	doi: string;
	preprint?: string;
	award?: 'honorable-mention' | 'best-paper' | 'other';
	awardText?: string;
	supplementals?: Supplemental[];
}
