import { FirebaseError } from 'firebase/app';

// Muuttaa Firebasen virhekoodit käyttäjälle ymmärrettäviksi viesteiksi
export function authVirheviesti(virhe: unknown): string {
  if (virhe instanceof FirebaseError) {
    switch (virhe.code) {
      case 'auth/invalid-email':
        return 'Sähköpostiosoite on virheellinen.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Väärä sähköposti tai salasana.';
      case 'auth/email-already-in-use':
        return 'Sähköpostiosoite on jo käytössä.';
      case 'auth/weak-password':
        return 'Salasanan täytyy olla vähintään 6 merkkiä.';
      case 'auth/missing-password':
        return 'Anna salasana.';
      case 'auth/network-request-failed':
        return 'Verkkovirhe. Tarkista internetyhteys.';
      case 'auth/too-many-requests':
        return 'Liian monta yritystä. Yritä myöhemmin uudelleen.';
    }
  }
  return 'Jotain meni pieleen. Yritä uudelleen.';
}