import fs from 'node:fs';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { getMemberSlug } from '$lib/data/Members';
import type { Members } from '$lib/types';
import type { PageServerLoad } from './$types';

export const prerender = true;

function readMembers(): Members[] {
	const filePath = path.join(process.cwd(), 'static/data/People.json');
	return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Members[];
}

export function entries() {
	return readMembers()
		.filter((member) => member.category !== 'alumni')
		.map((member) => ({ slug: getMemberSlug(member) }));
}

export const load: PageServerLoad = ({ params }) => {
	const member = readMembers().find(
		(candidate) => candidate.category !== 'alumni' && getMemberSlug(candidate) === params.slug
	);

	if (!member) {
		error(404, 'Profile not found');
	}

	return { member };
};
