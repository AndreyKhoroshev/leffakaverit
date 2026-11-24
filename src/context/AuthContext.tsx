import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { onkoNimiVapaa, luoProfiili } from '../services/kayttajat';
import { Profiili } from '../types/kayttaja';

// Kontekstin sisältö: kirjautunut käyttäjä, profiili ja kirjautumistoiminnot
type AuthContextType = {
  kayttaja: User | null;
  profiili: Profiili | null;
  lataa: boolean;
  kirjaudu: (email: string, salasana: string) => Promise<void>;
  rekisteroidy: (
    kayttajanimi: string,
    email: string,
    salasana: string
  ) => Promise<void>;
  kirjauduUlos: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tarjoaa kirjautumistiedot koko sovellukselle
export function AuthProvider({ children }: { children: ReactNode }) {
  const [kayttaja, setKayttaja] = useState<User | null>(null);
  const [profiili, setProfiili] = useState<Profiili | null>(null);
  const [lataa, setLataa] = useState(true);

  // Firebase ilmoittaa aina, kun käyttäjä kirjautuu sisään tai ulos
  useEffect(() => {
    const lopetaKuuntelu = onAuthStateChanged(auth, (user) => {
      setKayttaja(user);
      setLataa(false);
    });
    // Kuuntelu lopetetaan, kun komponentti poistuu
    return lopetaKuuntelu;
  }, []);

  // Kuunnellaan kirjautuneen käyttäjän profiilia Firestoresta.
  // onSnapshot päivittyy heti, kun profiili luodaan rekisteröitymisessä.
  useEffect(() => {
    if (!kayttaja) {
      setProfiili(null);
      return;
    }
    const lopetaKuuntelu = onSnapshot(
      doc(db, 'kayttajat', kayttaja.uid),
      (snap) => {
        setProfiili(snap.exists() ? (snap.data() as Profiili) : null);
      },
      // Uloskirjautuessa lukuoikeus loppuu, virhe voidaan ohittaa
      () => setProfiili(null)
    );
    return lopetaKuuntelu;
  }, [kayttaja]);

  const kirjaudu = async (email: string, salasana: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), salasana);
  };

  const rekisteroidy = async (
    kayttajanimi: string,
    email: string,
    salasana: string
  ) => {
    // 1. Tarkistetaan ensin, ettei käyttäjänimi ole jo käytössä
    if (!(await onkoNimiVapaa(kayttajanimi))) {
      throw new Error('KAYTTAJANIMI_VARATTU');
    }
    // 2. Luodaan tili Firebase Authiin
    const tulos = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      salasana
    );
    await updateProfile(tulos.user, { displayName: kayttajanimi.trim() });
    // 3. Tallennetaan profiili ja käyttäjänimi Firestoreen
    await luoProfiili(tulos.user.uid, kayttajanimi);
  };

  const kirjauduUlos = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        kayttaja,
        profiili,
        lataa,
        kirjaudu,
        rekisteroidy,
        kirjauduUlos,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Oma hook, jolla mikä tahansa näkymä saa kirjautumistiedot
export function useAuth() {
  const konteksti = useContext(AuthContext);
  if (!konteksti) {
    throw new Error('useAuth täytyy käyttää AuthProviderin sisällä');
  }
  return konteksti;
}