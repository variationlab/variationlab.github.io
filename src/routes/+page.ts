import type { PageLoad } from './$types';
import type { Members, Publication } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
	const [peopleResponse, publicationsResponse] = await Promise.all([
		fetch('/data/People.json'),
		fetch('/data/Publications.json')
	]);

	if (!peopleResponse.ok) {
		throw new Error('Unable to load people data');
	}

	if (!publicationsResponse.ok) {
		throw new Error('Unable to load publications data');
	}

	return {
		members: (await peopleResponse.json()) as Members[],
		publications: (await publicationsResponse.json()) as Publication[]
	};
};
