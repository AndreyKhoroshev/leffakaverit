import { Elokuva, ElokuvaTiedot, HakuVastaus } from '../types/tmdb';

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

// Hakee elokuvan tarkemmat tiedot ja näyttelijät yhdellä kutsulla
export async function haeElokuvanTiedot(id: number): Promise<ElokuvaTiedot> {
  const tiedot = await haeTmdb<ElokuvaTiedot>(
    `/movie/${id}?language=fi-FI&append_to_response=credits`
  );

  // Jos suomenkielistä kuvausta ei ole, haetaan englanninkielinen
  if (!tiedot.overview) {
    const englanniksi = await haeTmdb<ElokuvaTiedot>(
      `/movie/${id}?language=en-US`
    );
    tiedot.overview = englanniksi.overview;
  }
  return tiedot;
}

// Tulevat ensi-illat seuraavan puolen vuoden ajalta, lähin ensin
export async function haeTulevat(): Promise<Elokuva[]> {
  // Aikaväli: tästä päivästä kuuden kuukauden päähän (muodossa 2026-11-24)
  const tanaan = new Date();
  const alku = tanaan.toISOString().slice(0, 10);
  const loppuPvm = new Date(tanaan);
  loppuPvm.setMonth(loppuPvm.getMonth() + 6);
  const loppu = loppuPvm.toISOString().slice(0, 10);

  // Suosituimmat elokuvat, joilla on teatteriensi-ilta Suomessa aikavälillä.
  // region=FI: käytetään Suomen julkaisupäivää maailmanlaajuisen sijaan.
  // with_release_type=3|2: teatterijulkaisu (3) tai rajoitettu teatterijulkaisu (2).
  const polku = (sivu: number) =>
    `/discover/movie?language=fi-FI&sort_by=popularity.desc` +
    `&region=FI&with_release_type=3|2` +
    `&release_date.gte=${alku}&release_date.lte=${loppu}` +
    `&page=${sivu}`;
  // Haetaan kolme sivua samaan aikaan (20 elokuvaa sivulla)
  const sivut = await Promise.all(
    [1, 2, 3].map((sivu) => haeTmdb<HakuVastaus>(polku(sivu)))
  );

  // Yhdistetään sivut ja poistetaan mahdolliset tuplat id:n perusteella
  const elokuvat = new Map<number, Elokuva>();
  sivut
    .flatMap((sivu) => sivu.results)
    .forEach((e) => elokuvat.set(e.id, e));

  // Vain elokuvat, joilla on päivämäärä ja juliste, lähin ensi-ilta ensin
  return [...elokuvat.values()]
    .filter((e) => e.release_date && e.poster_path)
    .sort((a, b) => a.release_date.localeCompare(b.release_date));
}