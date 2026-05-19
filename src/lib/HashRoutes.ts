export type RouteId = 'home' | 'people' | 'publications' | 'courses' | 'contact';

export type HashRoute = {
	id: RouteId;
	label: string;
	href: string;
	aliases: string[];
};

export const hashRoutes: HashRoute[] = [
	{ id: 'home', label: 'Home', href: '#/', aliases: ['', '/', 'home', '/home'] },
	{ id: 'people', label: 'People', href: '#/people', aliases: ['people', '/people'] },
	{
		id: 'publications',
		label: 'Publications',
		href: '#/publications',
		aliases: ['publications', '/publications', 'papers', '/papers']
	},
	{ id: 'courses', label: 'Courses', href: '#/courses', aliases: ['courses', '/courses'] },
	{ id: 'contact', label: 'Contact', href: '#/contact', aliases: ['contact', '/contact'] }
];

const hashRouteLookup = new Map<string, RouteId>(
	hashRoutes.flatMap((route) => route.aliases.map((alias) => [alias, route.id]))
);

export function normalizeHash(hash: string | URL): RouteId {
	const rawHash = hash instanceof URL ? hash.hash : hash;
	const cleanHash = rawHash.replace(/^#/, '').trim().toLowerCase();
	return hashRouteLookup.get(cleanHash) ?? 'home';
}

export function getRouteLabel(routeId: RouteId): string {
	return hashRoutes.find((route) => route.id === routeId)?.label ?? 'Home';
}
