import { Elokuva, HakuVastaus } from '../types/tmdb';

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;

// Palauttaa julisteen täyden osoitteen (tai null, jos julistetta ei ole)
export function julisteUrl(polku: string | null, koko = 'w185') {
  return polku ? `https://image.tmdb.org/t/p/${koko}${polku}` : null;
}

// Yhteinen apufunktio kaikille TMDB-kutsuille
async function haeTmdb<T>(polku: string): Promise<T> {
  const vastaus = await fetch(`${BASE_URL}${polku}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: 'application/json',
    },
  });

  if (!vastaus.ok) {
    throw new Error(`TMDB-virhe: ${vastaus.status}`);
  }
  return vastaus.json();
}

// Hakee elokuvia hakusanalla (suomenkielisillä nimillä, jos saatavilla)
export async function haeElokuvia(hakusana: string): Promise<Elokuva[]> {
  const data = await haeTmdb<HakuVastaus>(
    `/search/movie?query=${encodeURIComponent(hakusana)}&language=fi-FI`
  );
  return data.results;
}