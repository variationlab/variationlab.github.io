import type { Authors, Members, Publication } from '$lib/types';

export type LabAuthorMembership = {
	publicationName: string;
	startTime: string;
	endTime?: string;
};

export function getAuthorName(authorValue: Authors): string {
	return authorValue.publicationName;
}

export function getPublicationLinks(publication: Publication): { name: string; url: string }[] {
	const links = publication.preprint ? [{ name: 'PDF', url: publication.preprint }] : [];
	return [...links, ...(publication.supplementals ?? [])];
}

export function sortPublicationsByDate(items: Publication[]): Publication[] {
	return [...items].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
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
				endTime: member.endTime
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
