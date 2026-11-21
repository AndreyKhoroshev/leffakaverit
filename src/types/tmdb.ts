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