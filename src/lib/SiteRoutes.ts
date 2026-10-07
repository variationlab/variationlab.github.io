export type RouteId = 'home' | 'people' | 'publications' | 'courses' | 'contact';

export type SiteRoute = {
	id: RouteId;
	label: string;
	href: string;
};

export const siteRoutes: SiteRoute[] = [
	{ id: 'home', label: 'Home', href: '/' },
	{ id: 'people', label: 'People', href: '/people' },
	{ id: 'publications', label: 'Publications', href: '/publications' },
	{ id: 'courses', label: 'Courses', href: '/courses' },
	{ id: 'contact', label: 'Contact', href: '/contact' }
];

const legacyHashPaths: Record<string, string> = {
	people: '/people',
	'/people': '/people',
	publications: '/publications',
	'/publications': '/publications',
	papers: '/publications',
	'/papers': '/publications',
	courses: '/courses',
	'/courses': '/courses',
	contact: '/contact',
	'/contact': '/contact'
};

export function pathForHash(hash: string): string | undefined {
	const cleanHash = hash.replace(/^#/, '').trim().toLowerCase();
	return legacyHashPaths[cleanHash];
}

export function isCurrentRoute(pathname: string, href: string): boolean {
	if (href === '/') return pathname === '/';
	return pathname === href || pathname.startsWith(`${href}/`);
}
