import {
  doc,
  collection,
  getDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { normalisoi } from './kayttajat';
import { Profiili } from '../types/kayttaja';
import { Kaveripyynto } from '../types/kaveri';

// Oma virhetyyppi: sen viestin voi näyttää käyttäjälle sellaisenaan
export class KaveriVirhe extends Error {}

// Omat kaverit: kayttajat/{uid}/kaverit
export function kaveritKokoelma(uid: string) {
  return collection(db, 'kayttajat', uid, 'kaverit');
}

// Saapuneet pyynnöt: kayttajat/{uid}/pyynnot
export function pyynnotKokoelma(uid: string) {
  return collection(db, 'kayttajat', uid, 'pyynnot');
}

// Etsii käyttäjän uid:n ja profiilin käyttäjänimen perusteella
async function etsiKayttaja(kayttajanimi: string) {
  const nimiDoc = await getDoc(
    doc(db, 'kayttajanimet', normalisoi(kayttajanimi))
  );
  if (!nimiDoc.exists()) return null;

  const uid = nimiDoc.data().uid as string;
  const profiiliDoc = await getDoc(doc(db, 'kayttajat', uid));
  if (!profiiliDoc.exists()) return null;

  return { uid, profiili: profiiliDoc.data() as Profiili };
}

// Kertoo, onko toinen käyttäjä lisännyt minut kaverikseen
export async function onkoLisannytMinut(kaveriUid: string, omaUid: string) {
  const snap = await getDoc(doc(db, 'kayttajat', kaveriUid, 'kaverit', omaUid));
  return snap.exists();
}

// Lisää kaverin käyttäjänimellä (käytetään myös QR-koodin kanssa)
export async function lisaaKaveri(
  omaUid: string,
  omaNimi: string,
  kayttajanimi: string
) {
  const kohde = await etsiKayttaja(kayttajanimi);
  if (!kohde) {
    throw new KaveriVirhe('Käyttäjää ei löytynyt.');
  }
  if (kohde.uid === omaUid) {
    throw new KaveriVirhe('Et voi lisätä itseäsi kaveriksi.');
  }

  const omaKaveriDoc = doc(db, 'kayttajat', omaUid, 'kaverit', kohde.uid);
  if ((await getDoc(omaKaveriDoc)).exists()) {
    throw new KaveriVirhe('Olet jo lisännyt tämän käyttäjän.');
  }

  // Jos toinen on jo lisännyt minut, kaveruus on nyt molemminpuolinen
  const hanLisasiMinut = await onkoLisannytMinut(kohde.uid, omaUid);

  const batch = writeBatch(db);
  batch.set(omaKaveriDoc, {
    uid: kohde.uid,
    kayttajanimi: kohde.profiili.kayttajanimi,
    lisatty: serverTimestamp(),
  });

  if (hanLisasiMinut) {
    // Hänen pyyntönsä minulle on nyt turha, joten poistetaan se
    batch.delete(doc(db, 'kayttajat', omaUid, 'pyynnot', kohde.uid));
  } else {
    // Lähetetään pyyntö, jotta toinen voi hyväksyä
    batch.set(doc(db, 'kayttajat', kohde.uid, 'pyynnot', omaUid), {
      uid: omaUid,
      kayttajanimi: omaNimi,
      lahetetty: serverTimestamp(),
    });
  }

  await batch.commit();
  return {
    kayttajanimi: kohde.profiili.kayttajanimi,
    molemminpuolinen: hanLisasiMinut,
  };
}

// Hyväksyy saapuneen pyynnön: lähettäjä lisätään omiin kavereihin
export async function hyvaksyPyynto(omaUid: string, pyynto: Kaveripyynto) {
  const batch = writeBatch(db);
  batch.set(doc(db, 'kayttajat', omaUid, 'kaverit', pyynto.uid), {
    uid: pyynto.uid,
    kayttajanimi: pyynto.kayttajanimi,
    lisatty: serverTimestamp(),
  });
  batch.delete(doc(db, 'kayttajat', omaUid, 'pyynnot', pyynto.uid));
  await batch.commit();
}

// Hylkää saapuneen pyynnön
export async function hylkaaPyynto(omaUid: string, lahettajaUid: string) {
  await deleteDoc(doc(db, 'kayttajat', omaUid, 'pyynnot', lahettajaUid));
}

// Poistaa kaverin: hän ei enää näe omia listojani
export async function poistaKaveri(omaUid: string, kaveriUid: string) {
  await deleteDoc(doc(db, 'kayttajat', omaUid, 'kaverit', kaveriUid));
}