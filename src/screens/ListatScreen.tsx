import { useAuth } from '../context/AuthContext';
import ListaNakyma from '../components/ListaNakyma';

// Omat listat: katsottavat ja katsotut elokuvat
export default function ListatScreen() {
  const { kayttaja } = useAuth();

  return (
    <ListaNakyma
      uid={kayttaja?.uid}
      tyhjaTeksti="Lista on tyhjä. Hae elokuvia Haku-välilehdeltä."
    />
  );
}