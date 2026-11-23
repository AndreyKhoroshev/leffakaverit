import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useListaElokuva } from '../hooks/useListaElokuva';
import { asetaListalle, poistaListalta } from '../services/elokuvaLista';
import { ElokuvanPerustiedot, ListaTila } from '../types/lista';

type Props = {
  elokuva: ElokuvanPerustiedot;
};

// Painikkeet, joilla elokuvan voi lisätä listalle, siirtää tai poistaa
export default function ListaPainikkeet({ elokuva }: Props) {
  const { kayttaja } = useAuth();
  const { listaElokuva, lataa } = useListaElokuva(elokuva.id);

  if (!kayttaja) return null;
  if (lataa) return <ActivityIndicator style={styles.lataus} />;

  const nykyinenTila = listaElokuva?.tila;

  // Jos elokuva on jo valitulla listalla, se poistetaan. Muuten se asetetaan sille.
  const valitse = async (tila: ListaTila) => {
    try {
      if (nykyinenTila === tila) {
        await poistaListalta(kayttaja.uid, elokuva.id);
      } else {
        await asetaListalle(kayttaja.uid, elokuva, tila);
      }
    } catch {
      Alert.alert('Virhe', 'Tallennus epäonnistui. Yritä uudelleen.');
    }
  };

  return (
    <View style={styles.rivi}>
      <Painike
        teksti="Haluan katsoa"
        valittu={nykyinenTila === 'katsottava'}
        onPress={() => valitse('katsottava')}
      />
      <Painike
        teksti="Katsottu"
        valittu={nykyinenTila === 'katsottu'}
        onPress={() => valitse('katsottu')}
      />
    </View>
  );
}

// Yksi valintapainike, joka korostetaan, kun se on valittuna
function Painike({
  teksti,
  valittu,
  onPress,
}: {
  teksti: string;
  valittu: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.painike, valittu && styles.valittu]}
      onPress={onPress}
    >
      <Text style={[styles.teksti, valittu && styles.valittuTeksti]}>
        {teksti}
      </Text>
    </Pressable>
  );
}

// Tyylit
const styles = StyleSheet.create({
  lataus: {
    marginTop: 8,
  },
  rivi: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 4,
  },
  painike: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  valittu: {
    backgroundColor: '#007AFF',
  },
  teksti: {
    color: '#007AFF',
    fontWeight: '600',
  },
  valittuTeksti: {
    color: '#fff',
  },
});