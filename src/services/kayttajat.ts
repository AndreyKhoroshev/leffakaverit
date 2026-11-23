import { doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Nimet tallennetaan pienillä kirjaimilla, jotta "Andrey" ja "andrey" ovat sama nimi
export function normalisoi(kayttajanimi: string) {
  return kayttajanimi.trim().toLowerCase();
}

// Tarkistaa, onko käyttäjänimi vielä vapaana
export async function onkoNimiVapaa(kayttajanimi: string): Promise<boolean> {
  const nimiDoc = await getDoc(
    doc(db, 'kayttajanimet', normalisoi(kayttajanimi))
  );
  return !nimiDoc.exists();
}

// Luo profiilin ja varaa käyttäjänimen samalla kertaa
export async function luoProfiili(uid: string, kayttajanimi: string) {
  // Batch: molemmat tallennukset onnistuvat yhdessä tai kumpikaan ei
  const batch = writeBatch(db);
  batch.set(doc(db, 'kayttajanimet', normalisoi(kayttajanimi)), { uid });
  batch.set(doc(db, 'kayttajat', uid), {
    kayttajanimi: kayttajanimi.trim(),
    kayttajanimiPieni: normalisoi(kayttajanimi),
    luotu: serverTimestamp(),
  });
  await batch.commit();
}