import {
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { ElokuvanPerustiedot, ListaTila } from '../types/lista';

// Käyttäjän elokuvat: kayttajat/{uid}/elokuvat
export function elokuvatKokoelma(uid: string) {
  return collection(db, 'kayttajat', uid, 'elokuvat');
}

// Yksi elokuva: kayttajat/{uid}/elokuvat/{elokuvaId}
export function elokuvaDoc(uid: string, elokuvaId: number) {
  return doc(db, 'kayttajat', uid, 'elokuvat', String(elokuvaId));
}

// Lisää elokuvan listalle tai siirtää sen toiselle listalle
export async function asetaListalle(
  uid: string,
  elokuva: ElokuvanPerustiedot,
  tila: ListaTila
) {
  await setDoc(
    elokuvaDoc(uid, elokuva.id),
    {
      id: elokuva.id,
      title: elokuva.title,
      poster_path: elokuva.poster_path,
      release_date: elokuva.release_date,
      tila,
      paivitetty: serverTimestamp(),
    },
    // merge: aiempi arvosana ja arvio säilyvät, jos ne on jo annettu
    { merge: true }
  );
}

// Tallentaa arvosanan ja arvion katsotulle elokuvalle
export async function tallennaArvio(
  uid: string,
  elokuvaId: number,
  arvosana: number,
  arvio: string
) {
  await updateDoc(elokuvaDoc(uid, elokuvaId), {
    arvosana,
    arvio: arvio.trim(),
    paivitetty: serverTimestamp(),
  });
}

// Poistaa elokuvan listalta kokonaan
export async function poistaListalta(uid: string, elokuvaId: number) {
  await deleteDoc(elokuvaDoc(uid, elokuvaId));
}