import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { elokuvaDoc } from '../services/elokuvaLista';
import { ListaElokuva } from '../types/lista';

// Oma hook: kertoo, onko elokuva käyttäjän listalla (päivittyy reaaliajassa)
export function useListaElokuva(elokuvaId: number) {
  const { kayttaja } = useAuth();
  const [listaElokuva, setListaElokuva] = useState<ListaElokuva | null>(null);
  const [lataa, setLataa] = useState(true);

  useEffect(() => {
    if (!kayttaja) return;

    // Kuunnellaan yhden elokuvan dokumenttia käyttäjän listalla
    const lopetaKuuntelu = onSnapshot(
      elokuvaDoc(kayttaja.uid, elokuvaId),
      (snap) => {
        setListaElokuva(snap.exists() ? (snap.data() as ListaElokuva) : null);
        setLataa(false);
      },
      () => setLataa(false)
    );
    return lopetaKuuntelu;
  }, [kayttaja, elokuvaId]);

  return { listaElokuva, lataa };
}