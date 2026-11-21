import { useState } from 'react';
import { haeElokuvia } from '../services/tmdb';
import { Elokuva } from '../types/tmdb';

// Oma hook elokuvahakuun: tulokset, lataustila ja virhe
export function useElokuvaHaku() {
  const [tulokset, setTulokset] = useState<Elokuva[]>([]);
  const [lataa, setLataa] = useState(false);
  const [virhe, setVirhe] = useState<string | null>(null);

  const hae = async (hakusana: string) => {
    // Tyhjällä hakusanalla ei haeta
    if (!hakusana.trim()) return;

    setLataa(true);
    setVirhe(null);
    try {
      const elokuvat = await haeElokuvia(hakusana.trim());
      setTulokset(elokuvat);
    } catch (e) {
      setVirhe('Haku epäonnistui. Yritä uudelleen.');
    } finally {
      setLataa(false);
    }
  };

  return { tulokset, lataa, virhe, hae };
}