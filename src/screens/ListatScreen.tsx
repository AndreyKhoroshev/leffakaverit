import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';
import { useElokuvaLista } from '../hooks/useElokuvaLista';
import ElokuvaKortti from '../components/ElokuvaKortti';
import { ListaTila } from '../types/lista';

// Omat listat: katsottavat ja katsotut elokuvat
export default function ListatScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { kayttaja } = useAuth();
  const { katsottavat, katsotut, lataa } = useElokuvaLista(kayttaja?.uid);
  const [valittu, setValittu] = useState<ListaTila>('katsottava');

  // Näytetään valitun listan elokuvat
  const naytettavat = valittu === 'katsottava' ? katsottavat : katsotut;

  return (
    <View style={styles.container}>
      {/* Valinta listojen välillä */}
      <View style={styles.valinnat}>
        <Valinta
          teksti={`Katsottavat (${katsottavat.length})`}
          aktiivinen={valittu === 'katsottava'}
          onPress={() => setValittu('katsottava')}
        />
        <Valinta
          teksti={`Katsotut (${katsotut.length})`}
          aktiivinen={valittu === 'katsottu'}
          onPress={() => setValittu('katsottu')}
        />
      </View>

      {lataa ? (
        <ActivityIndicator style={styles.lataus} />
      ) : (
        <FlatList
          data={naytettavat}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ElokuvaKortti
              elokuva={item}
              // Katsotuille näytetään oma arvosana
              lisatieto={item.arvosana ? `⭐ ${item.arvosana}/10` : undefined}
              onPress={() =>
                navigation.navigate('Elokuva', { elokuvaId: item.id })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.tyhja}>
              Lista on tyhjä. Hae elokuvia Haku-välilehdeltä.
            </Text>
          }
        />
      )}
    </View>
  );
}

// Yksi listavalinta, korostetaan kun se on aktiivinen
function Valinta({
  teksti,
  aktiivinen,
  onPress,
}: {
  teksti: string;
  aktiivinen: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.valinta, aktiivinen && styles.aktiivinen]}
      onPress={onPress}
    >
      <Text style={[styles.valintaTeksti, aktiivinen && styles.aktiivinenTeksti]}>
        {teksti}
      </Text>
    </Pressable>
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  valinnat: {
    flexDirection: 'row',
    margin: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  valinta: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  aktiivinen: {
    backgroundColor: '#007AFF',
  },
  valintaTeksti: {
    color: '#007AFF',
    fontWeight: '600',
  },
  aktiivinenTeksti: {
    color: '#fff',
  },
  lataus: {
    marginTop: 20,
  },
  tyhja: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
    paddingHorizontal: 20,
  },
});