import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import ListaNakyma from '../components/ListaNakyma';

type Props = NativeStackScreenProps<RootStackParamList, 'KaverinListat'>;

// Kaverin listat, arvosanat ja arviot
export default function KaverinListatScreen({ route }: Props) {
  const { uid, kayttajanimi } = route.params;

  return (
    <ListaNakyma
      uid={uid}
      naytaArviot
      tyhjaTeksti={`Käyttäjällä ${kayttajanimi} ei ole elokuvia tällä listalla.`}
    />
  );
}