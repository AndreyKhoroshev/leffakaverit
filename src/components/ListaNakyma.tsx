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
import { useElokuvaLista } from '../hooks/useElokuvaLista';
import ElokuvaKortti from './ElokuvaKortti';
import { ListaElokuva, ListaTila } from '../types/lista';

type Props = {
  // Kenen listat näytetään
  uid: string | undefined;
  // Näytetäänkö kirjallinen arvio arvosanan perässä
  naytaArviot?: boolean;
  // Teksti, kun valittu lista on tyhjä
  tyhjaTeksti: string;
};

// Yhteinen listanäkymä: valinta katsottavat/katsotut ja elokuvat listana
export default function ListaNakyma({
  uid,
  naytaArviot = false,
  tyhjaTeksti,
}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { katsottavat, katsotut, lataa } = useElokuvaLista(uid);
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
              lisatieto={muodostaLisatieto(item, naytaArviot)}
              onPress={() =>
                navigation.navigate('Elokuva', { elokuvaId: item.id })
              }
            />
          )}
          ListEmptyComponent={<Text style={styles.tyhja}>{tyhjaTeksti}</Text>}
        />
      )}
    </View>
  );
}

// Kortin lisätieto: arvosana ja halutessa myös kirjallinen arvio
function muodostaLisatieto(elokuva: ListaElokuva, naytaArviot: boolean) {
  if (!elokuva.arvosana) return undefined;
  const arvosana = `⭐ ${elokuva.arvosana}/10`;
  return naytaArviot && elokuva.arvio
    ? `${arvosana}\n"${elokuva.arvio}"`
    : arvosana;
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

// Tyylit
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