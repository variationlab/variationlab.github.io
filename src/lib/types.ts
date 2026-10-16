export interface Authors {
	firstName: string;
	lastName: string;
	middleName?: string;
	publicationName: string;
}

export interface Members extends Authors {
	/** Preferred first name, shown as `Nick (First) Last` while `publicationName` still matches papers. */
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
	/** Office number, shown under the photo on the profile page. */
	office?: string;
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
	/** Label shown with the link under the bio. Defaults to the icon name, such as Website. */
	title?: string;
}

export type Venue = {
	/** Official venue series name without year, e.g. "ACM CHI Conference on Human Factors in Computing Systems". */
	fullName: string;
	/** Abbreviation shown in brackets with the year, e.g. "CHI", "CHI EA", "UIST Adjunct", "HIRL @ HRI". */
	shortName: string;
	/** "conference" means a paper in published conference proceedings, including CHI Extended Abstracts, adjunct, companion, and Findings volumes (shown as "Proc. CHI 2026", "Proc. CHI EA 2024"); non-archival venues use another type. */
	venueType:
		| 'conference'
		| 'journal'
		| 'workshop'
		| 'arxiv'
		| 'pending'
		| 'competition'
		| 'course'
		| 'research'
		| 'other';
};

export interface Publication {
	title: string;
	authors: Authors[];
	venue: Venue;
	year: number;
	publishDate: string;
	/** DOI of the published paper, e.g. "10.1145/3613904.3642000"; shown as a "DOI" link. Leave "" for unpublished work such as preprints. */
	doi: string;
	/** Affiliation note shown after the venue, e.g. "Work done at Microsoft Research". */
	affiliation?: string;
	award?: 'honorable-mention' | 'best-paper' | 'other';
	/** Award name, only for `award: 'other'`; standard awards are labeled from `award`. */
	awardText?: string;
	/** Optional page for the award, linked from the award label. */
	awardLink?: string;
	/** Show this paper in Selected Publications on the home page. */
	isSelected?: boolean;
	/** The paper itself, ideally an open-access PDF; shown as "Paper". */
	paperLink?: string;
	exploreLink?: string;
	codeLink?: string;
	videoLink?: string;
	presentationLink?: string;
	/** Supplemental materials, e.g. a course or workshop website, appendix, or dataset. */
	materialLink?: string;
	slidesLink?: string;
	/** Full /images/teaser/ path: a .jpg, .jpeg, .png, .webp, or .gif image, or a short .mp4 or .webm video (played muted on loop); shown uncropped in a 16:9 frame, filling its height (or its width for wider media). */
	teaser?: string;
}
