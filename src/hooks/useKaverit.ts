import { useEffect, useState } from 'react';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { kaveritKokoelma, pyynnotKokoelma } from '../services/kaverit';
import { Kaveri, Kaveripyynto } from '../types/kaveri';

// Oma hook: käyttäjän kaverit ja saapuneet pyynnöt reaaliajassa
export function useKaverit(uid: string | undefined) {
  const [kaverit, setKaverit] = useState<Kaveri[]>([]);
  const [pyynnot, setPyynnot] = useState<Kaveripyynto[]>([]);
  const [lataa, setLataa] = useState(true);

  useEffect(() => {
    if (!uid) return;

    // Kaverit aakkosjärjestyksessä
    const lopetaKaverit = onSnapshot(
      query(kaveritKokoelma(uid), orderBy('kayttajanimi')),
      (snap) => {
        setKaverit(snap.docs.map((d) => d.data() as Kaveri));
        setLataa(false);
      },
      () => setLataa(false)
    );

    // Saapuneet kaveripyynnöt
    const lopetaPyynnot = onSnapshot(
      pyynnotKokoelma(uid),
      (snap) => {
        setPyynnot(snap.docs.map((d) => d.data() as Kaveripyynto));
      },
      () => {}
    );

    // Lopetetaan molemmat kuuntelut, kun näkymä poistuu
    return () => {
      lopetaKaverit();
      lopetaPyynnot();
    };
  }, [uid]);

  return { kaverit, pyynnot, lataa };
}