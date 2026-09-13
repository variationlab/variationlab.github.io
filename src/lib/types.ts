export interface Authors {
	firstName: string;
	lastName: string;
	middleName?: string;
	publicationName: string;
}

export interface Members extends Authors {
	nickName?: string;
	email?: string;
	url?: string;
	googleScholar?: string;
	github?: string;
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
	startTime: string;
	endTime?: string;
	formerRole?: string;
	/** Display title for any member; otherwise use the general academic-status label. */
	currentRole?: string;
	contact?: SocialMedia;
}

export interface SocialMedia {
	linkedin?: string;
	twitter?: string;
	bluesky?: string;
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
