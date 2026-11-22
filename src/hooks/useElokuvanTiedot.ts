import { useEffect, useState } from 'react';
import { haeElokuvanTiedot } from '../services/tmdb';
import { ElokuvaTiedot } from '../types/tmdb';

// Oma hook: hakee yhden elokuvan tiedot, kun näkymä avataan
export function useElokuvanTiedot(elokuvaId: number) {
  const [tiedot, setTiedot] = useState<ElokuvaTiedot | null>(null);
  const [lataa, setLataa] = useState(true);
  const [virhe, setVirhe] = useState<string | null>(null);

  useEffect(() => {
    // Estetään tilan päivitys, jos käyttäjä poistuu ennen kuin haku valmistuu
    let peruttu = false;

    setLataa(true);
    setVirhe(null);

    haeElokuvanTiedot(elokuvaId)
      .then((data) => {
        if (!peruttu) setTiedot(data);
      })
      .catch(() => {
        if (!peruttu) setVirhe('Tietojen haku epäonnistui.');
      })
      .finally(() => {
        if (!peruttu) setLataa(false);
      });

    return () => {
      peruttu = true;
    };
  }, [elokuvaId]);

  return { tiedot, lataa, virhe };
}