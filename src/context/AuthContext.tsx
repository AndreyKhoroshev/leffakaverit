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
import { auth } from '../services/firebase';

// Kontekstin sisältö: kirjautunut käyttäjä ja kirjautumistoiminnot
type AuthContextType = {
  kayttaja: User | null;
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
  const [lataa, setLataa] = useState(true);

  useEffect(() => {
    // Firebase ilmoittaa aina, kun käyttäjä kirjautuu sisään tai ulos
    const lopetaKuuntelu = onAuthStateChanged(auth, (user) => {
      setKayttaja(user);
      setLataa(false);
    });
    // Kuuntelu lopetetaan, kun komponentti poistuu
    return lopetaKuuntelu;
  }, []);

  const kirjaudu = async (email: string, salasana: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), salasana);
  };

  const rekisteroidy = async (
    kayttajanimi: string,
    email: string,
    salasana: string
  ) => {
    const tulos = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      salasana
    );
    // Tallennetaan käyttäjänimi Firebasen käyttäjäprofiiliin
    await updateProfile(tulos.user, { displayName: kayttajanimi.trim() });
  };

  const kirjauduUlos = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ kayttaja, lataa, kirjaudu, rekisteroidy, kirjauduUlos }}
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