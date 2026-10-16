import type { Authors, Members, Publication } from '$lib/types';
import { getMemberWebsiteLink } from '$lib/data/Members';

export type LabAuthorMembership = {
	publicationName: string;
	startTime: string;
	endTime?: string;
	/** Member homepage, linked from their name on papers they are matched to. */
	url?: string;
};

export function getAuthorName(authorValue: Authors): string {
	return authorValue.publicationName;
}

/** Named link fields in display order, after the DOI link. */
export const publicationLinkFields = [
	['paperLink', 'Paper'],
	['exploreLink', 'Explore'],
	['codeLink', 'Code'],
	['videoLink', 'Video'],
	['presentationLink', 'Presentation'],
	['materialLink', 'Materials'],
	['slidesLink', 'Slides']
] as const satisfies readonly (readonly [keyof Publication, string])[];

export type PublicationLinkKind = 'doi' | (typeof publicationLinkFields)[number][0];

export type PublicationLink = { kind: PublicationLinkKind; name: string; url: string };

export function getPublicationLinks(publication: Publication): PublicationLink[] {
	const doi = publication.doi.trim();
	const doiLink: PublicationLink[] = doi
		? [{ kind: 'doi', name: 'DOI', url: `https://doi.org/${doi}` }]
		: [];
	const named = publicationLinkFields.flatMap(([kind, name]): PublicationLink[] => {
		const url = publication[kind];
		return url ? [{ kind, name, url }] : [];
	});
	const links = [...doiLink, ...named];
	// Drop repeated URLs so each link appears once (links are keyed by URL when rendered).
	return links.filter(
		(link, index) => links.findIndex((other) => other.url === link.url) === index
	);
}

/**
 * Venue line: the full venue name with the abbreviation and year in brackets, prefixed with
 * "Proc." for papers in published conference proceedings (including extended abstracts, adjunct,
 * companion, and Findings volumes), e.g.
 * "ACM CHI Conference on Human Factors in Computing Systems (Proc. CHI 2026)". Venues whose full
 * name is the abbreviation, such as arXiv, show only "arXiv 2026".
 */
export function getVenueLabel(publication: Publication): string {
	const { fullName, shortName, venueType } = publication.venue;
	const abbreviation = `${venueType === 'conference' ? 'Proc. ' : ''}${shortName} ${publication.year}`;
	return fullName === shortName ? abbreviation : `${fullName} (${abbreviation})`;
}

const awardLabels = {
	'best-paper': 'Best Paper Award',
	'honorable-mention': 'Honorable Mention Award'
} as const;

/** Standard award names come from `award`; `awardText` names only `other` awards. */
export function getAwardLabel(publication: Publication): string | undefined {
	if (!publication.award) return undefined;
	return publication.award === 'other' ? publication.awardText : awardLabels[publication.award];
}

const teaserImageExtensions = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
const teaserVideoExtensions = new Set(['mp4', 'webm']);

export type TeaserKind = 'image' | 'video';

export function getTeaserKind(src: string): TeaserKind | undefined {
	const extension = src.split(/[?#]/)[0].split('.').pop()?.toLowerCase() ?? '';
	if (teaserImageExtensions.has(extension)) return 'image';
	if (teaserVideoExtensions.has(extension)) return 'video';
	return undefined;
}

export function sortPublicationsByDate(items: Publication[]): Publication[] {
	return [...items].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export function getSelectedPublications(items: Publication[]): Publication[] {
	return sortPublicationsByDate(items.filter((publication) => publication.isSelected === true));
}

export function groupPublicationsByYear(
	items: Publication[]
): { year: number; publications: Publication[] }[] {
	const years = [...new Set(items.map((publication) => publication.year))].sort((a, b) => b - a);
	return years.map((year) => ({
		year,
		publications: sortPublicationsByDate(items.filter((publication) => publication.year === year))
	}));
}

export function getLabAuthorMemberships(
	members: Members[]
): ReadonlyMap<string, LabAuthorMembership> {
	return new Map(
		members.map((member) => [
			member.publicationName,
			{
				publicationName: member.publicationName,
				startTime: member.startTime,
				endTime: member.endTime,
				url: getMemberWebsiteLink(member)?.url
			}
		])
	);
}

export function isDateWithinMembership(
	publishDate: string,
	membership: LabAuthorMembership
): boolean {
	return (
		publishDate >= membership.startTime &&
		(!membership.endTime || publishDate <= membership.endTime)
	);
}

export function isLabAuthorForPublication(
	authorValue: Authors,
	publication: Publication,
	memberships: ReadonlyMap<string, LabAuthorMembership>
): boolean {
	const membership = memberships.get(authorValue.publicationName);
	return Boolean(membership && isDateWithinMembership(publication.publishDate, membership));
}

/** Homepage for a matched lab author on this publication; undefined when unmatched or without one. */
export function getLabAuthorHomepage(
	authorValue: Authors,
	publication: Publication,
	memberships: ReadonlyMap<string, LabAuthorMembership>
): string | undefined {
	if (!isLabAuthorForPublication(authorValue, publication, memberships)) return undefined;
	return memberships.get(authorValue.publicationName)?.url || undefined;
}
