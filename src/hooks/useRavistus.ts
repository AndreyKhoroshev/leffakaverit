import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

// Kuinka voimakas liike lasketaan ravistukseksi (1 = maan vetovoima levossa)
const KYNNYS = 1.8;
// Vähimmäisaika kahden ravistuksen välillä millisekunteina
const TAUKO = 1500;

// Oma hook: kutsuu annettua funktiota, kun puhelinta ravistetaan
export function useRavistus(kunRavistetaan: () => void, kaytossa = true) {
  // Funktio tallennetaan ref:iin, jotta kuuntelijaa ei tarvitse luoda joka kerta uudelleen
  const funktio = useRef(kunRavistetaan);
  funktio.current = kunRavistetaan;
  const edellinen = useRef(0);

  useEffect(() => {
    if (!kaytossa) return;

    // Anturin lukema 10 kertaa sekunnissa
    Accelerometer.setUpdateInterval(100);

    const tilaus = Accelerometer.addListener(({ x, y, z }) => {
      // Liikkeen kokonaisvoima kolmen akselin perusteella
      const voima = Math.sqrt(x * x + y * y + z * z);
      const nyt = Date.now();

      if (voima > KYNNYS && nyt - edellinen.current > TAUKO) {
        edellinen.current = nyt;
        funktio.current();
      }
    });

    // Kuuntelu lopetetaan, kun näkymä ei ole enää aktiivinen
    return () => tilaus.remove();
  }, [kaytossa]);
}