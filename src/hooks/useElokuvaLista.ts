import { useEffect, useState } from 'react';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { elokuvatKokoelma } from '../services/elokuvaLista';
import { ListaElokuva } from '../types/lista';

// Oma hook: käyttäjän listaelokuvat reaaliajassa, viimeksi muutettu ensin.
// uid annetaan parametrina, jotta samaa hookia voi käyttää myös kavereille.
export function useElokuvaLista(uid: string | undefined) {
  const [elokuvat, setElokuvat] = useState<ListaElokuva[]>([]);
  const [lataa, setLataa] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const kysely = query(elokuvatKokoelma(uid), orderBy('paivitetty', 'desc'));
    const lopetaKuuntelu = onSnapshot(
      kysely,
      (snap) => {
        setElokuvat(snap.docs.map((d) => d.data() as ListaElokuva));
        setLataa(false);
      },
      () => setLataa(false)
    );
    return lopetaKuuntelu;
  }, [uid]);

  // Jaetaan elokuvat kahdelle listalle
  const katsottavat = elokuvat.filter((e) => e.tila === 'katsottava');
  const katsotut = elokuvat.filter((e) => e.tila === 'katsottu');

  return { katsottavat, katsotut, lataa };
}