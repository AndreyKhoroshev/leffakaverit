// Elokuva sellaisena kuin TMDB palauttaa sen hakutuloksissa
export type Elokuva = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
};

// TMDB:n hakuvastaus
export type HakuVastaus = {
  page: number;
  results: Elokuva[];
  total_pages: number;
  total_results: number;
};

// Näyttelijä elokuvan tekijätiedoissa
export type Nayttelija = {
  id: number;
  credit_id: string;
  name: string;
  character: string;
  profile_path: string | null;
};

// Elokuvan tarkemmat tiedot (sisältää myös näyttelijät)
export type ElokuvaTiedot = Elokuva & {
  runtime: number | null;
  genres: { id: number; name: string }[];
  credits: { cast: Nayttelija[] };
};
