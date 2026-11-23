import { Timestamp } from 'firebase/firestore';
import { Elokuva } from './tmdb';

// Listan tila: haluan katsoa tai katsottu
export type ListaTila = 'katsottava' | 'katsottu';

// Elokuvan perustiedot, jotka tallennetaan listalle
export type ElokuvanPerustiedot = Pick<
  Elokuva,
  'id' | 'title' | 'poster_path' | 'release_date'
>;

// Elokuva käyttäjän listalla Firestoressa
export type ListaElokuva = ElokuvanPerustiedot & {
  tila: ListaTila;
  arvosana?: number;
  arvio?: string;
  paivitetty: Timestamp | null;
};