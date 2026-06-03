import { locations, Location } from '@/config/locations';

/**
 * Adjacency fallback map — adjacent states used to pad nearby lists
 * when a state has fewer than `count` peers.
 */
const ADJACENT: Record<string, string[]> = {
  'Klang Valley': ['Selangor', 'Negeri Sembilan'],
  'Selangor': ['Klang Valley', 'Perak', 'Pahang'],
  'Negeri Sembilan': ['Klang Valley', 'Melaka', 'Johor'],
  'Melaka': ['Negeri Sembilan', 'Johor'],
  'Johor': ['Melaka', 'Pahang', 'Negeri Sembilan'],
  'Perak': ['Kedah', 'Penang', 'Pahang', 'Selangor'],
  'Penang': ['Kedah', 'Perak'],
  'Kedah': ['Perlis', 'Penang', 'Perak'],
  'Perlis': ['Kedah'],
  'Kelantan': ['Terengganu', 'Pahang'],
  'Terengganu': ['Kelantan', 'Pahang'],
  'Pahang': ['Terengganu', 'Kelantan', 'Perak', 'Johor', 'Selangor'],
  'Sabah': ['Sarawak'],
  'Sarawak': ['Sabah'],
};

/**
 * Return `count` nearby locations for a given slug.
 * Same-state peers are used first; if fewer than `count` exist, the list is
 * padded with cities from adjacent states (deterministic order).
 */
export function getNearbyLocations(slug: string, count = 6): Location[] {
  const loc = locations.find((l) => l.slug === slug);
  if (!loc) return [];

  const sameState = locations.filter((l) => l.state === loc.state && l.slug !== slug);
  if (sameState.length >= count) return sameState.slice(0, count);

  const filled: Location[] = [...sameState];
  for (const adjState of ADJACENT[loc.state] ?? []) {
    if (filled.length >= count) break;
    const adj = locations.filter((l) => l.state === adjState);
    for (const a of adj) {
      if (filled.length >= count) break;
      filled.push(a);
    }
  }
  return filled.slice(0, count);
}
