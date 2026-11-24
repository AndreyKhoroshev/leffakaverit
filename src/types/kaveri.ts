import { Timestamp } from 'firebase/firestore';

// Kaveri omalla kaverilistalla: kayttajat/{uid}/kaverit/{kaveriUid}
export type Kaveri = {
  uid: string;
  kayttajanimi: string;
  lisatty: Timestamp | null;
};

// Saapunut kaveripyyntö: kayttajat/{uid}/pyynnot/{lahettajaUid}
export type Kaveripyynto = {
  uid: string;
  kayttajanimi: string;
  lahetetty: Timestamp | null;
};