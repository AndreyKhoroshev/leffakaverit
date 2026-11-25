import { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useElokuvanTiedot } from '../hooks/useElokuvanTiedot';
import { julisteUrl } from '../services/tmdb';
import NayttelijaKortti from '../components/NayttelijaKortti';
import ListaPainikkeet from '../components/ListaPainikkeet';
import KalenteriPainike from '../components/KalenteriPainike';

type Props = NativeStackScreenProps<RootStackParamList, 'Elokuva'>;

// Yksittäisen elokuvan tiedot ja näyttelijät
export default function ElokuvaScreen({ route, navigation }: Props) {
  const { elokuvaId } = route.params;
  const { tiedot, lataa, virhe } = useElokuvanTiedot(elokuvaId);

  // Asetetaan elokuvan nimi otsikkopalkkiin, kun tiedot on haettu
  useEffect(() => {
    if (tiedot) {
      navigation.setOptions({ title: tiedot.title });
    }
  }, [tiedot, navigation]);

  // Latauksen aikana näytetään pyörivä ikoni
  if (lataa) {
    return (
      <View style={styles.keskella}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Virheen sattuessa näytetään viesti
  if (virhe || !tiedot) {
    return (
      <View style={styles.keskella}>
        <Text>{virhe ?? 'Elokuvaa ei löytynyt.'}</Text>
      </View>
    );
  }

  const juliste = julisteUrl(tiedot.poster_path, 'w342');
  const vuosi = tiedot.release_date?.slice(0, 4);
  const genret = tiedot.genres.map((g) => g.name).join(', ');
  // Näytetään vain 15 ensimmäistä näyttelijää
  const nayttelijat = tiedot.credits.cast.slice(0, 15);

  return (
    <ScrollView style={styles.container}>
      {/* Yläosa: juliste ja perustiedot vierekkäin */}
      <View style={styles.ylaosa}>
        {juliste ? (
          <Image source={{ uri: juliste }} style={styles.juliste} />
        ) : (
          <View style={[styles.juliste, styles.eiKuvaa]} />
        )}
        <View style={styles.perustiedot}>
          <Text style={styles.nimi}>{tiedot.title}</Text>
          {vuosi ? <Text style={styles.harmaa}>{vuosi}</Text> : null}
          {tiedot.runtime ? (
            <Text style={styles.harmaa}>{tiedot.runtime} min</Text>
          ) : null}
          {genret ? <Text style={styles.harmaa}>{genret}</Text> : null}
          <Text style={styles.arvosana}>
            ⭐ {tiedot.vote_average.toFixed(1)} / 10
          </Text>
        </View>
      </View>

      {/* Listapainikkeet: haluan katsoa / katsottu */}
      <ListaPainikkeet elokuva={tiedot} />

      {/* Tuleville elokuville: ensi-ilta kalenteriin */}
      <KalenteriPainike
        nimi={tiedot.title}
        julkaisupaiva={tiedot.release_date}
      />

      {/* Juonikuvaus */}
      <Text style={styles.otsikko}>Juoni</Text>
      <Text style={styles.kuvaus}>
        {tiedot.overview || 'Kuvausta ei ole saatavilla.'}
      </Text>

      {/* Näyttelijät vaakasuuntaisena listana */}
      <Text style={styles.otsikko}>Näyttelijät</Text>
      <FlatList
        horizontal
        data={nayttelijat}
        keyExtractor={(item) => item.credit_id}
        renderItem={({ item }) => <NayttelijaKortti nayttelija={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.nayttelijaLista}
      />
    </ScrollView>
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keskella: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ylaosa: {
    flexDirection: 'row',
    padding: 16,
  },
  juliste: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  eiKuvaa: {
    backgroundColor: '#ccc',
  },
  perustiedot: {
    flex: 1,
    marginLeft: 16,
  },
  nimi: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  harmaa: {
    color: '#666',
    marginBottom: 2,
  },
  arvosana: {
    fontSize: 16,
    marginTop: 8,
  },
  otsikko: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  kuvaus: {
    marginHorizontal: 16,
    lineHeight: 20,
  },
  nayttelijaLista: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});