import { useCallback, useEffect, useState } from 'react';
import { haeTulevat } from '../services/tmdb';
import { Elokuva } from '../types/tmdb';

// Oma hook: tulevat ensi-illat sekä mahdollisuus päivittää lista
export function useTulevat() {
  const [elokuvat, setElokuvat] = useState<Elokuva[]>([]);
  const [lataa, setLataa] = useState(true);
  const [virhe, setVirhe] = useState<string | null>(null);

  const hae = useCallback(async () => {
    setLataa(true);
    setVirhe(null);
    try {
      setElokuvat(await haeTulevat());
    } catch {
      setVirhe('Ensi-iltojen haku epäonnistui.');
    } finally {
      setLataa(false);
    }
  }, []);

  // Haetaan lista, kun näkymä avataan
  useEffect(() => {
    hae();
  }, [hae]);

  return { elokuvat, lataa, virhe, paivita: hae };
}