import { View, Text, Pressable, Alert, Vibration, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';
import { useElokuvaLista } from '../hooks/useElokuvaLista';
import { useRavistus } from '../hooks/useRavistus';
import { haeSatunnainenElokuva } from '../services/tmdb';
import ListaNakyma from '../components/ListaNakyma';

// Omat listat: katsottavat ja katsotut elokuvat + ravistusarvonta
export default function ListatScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { kayttaja } = useAuth();
  const { katsottavat } = useElokuvaLista(kayttaja?.uid);
  // true vain, kun tämä välilehti on näkyvissä
  const onAktiivinen = useIsFocused();

  // Arpoo elokuvan: ensin omalta katsottavat-listalta, muuten TMDB:n suosituista
  const arvoElokuva = async () => {
    Vibration.vibrate(100);
    try {
      let elokuvaId: number;
      if (katsottavat.length > 0) {
        const satunnainen = Math.floor(Math.random() * katsottavat.length);
        elokuvaId = katsottavat[satunnainen].id;
      } else {
        elokuvaId = (await haeSatunnainenElokuva()).id;
      }
      navigation.navigate('Elokuva', { elokuvaId });
    } catch {
      Alert.alert('Virhe', 'Elokuvan arpominen epäonnistui.');
    }
  };

  // Ravistus toimii vain, kun Listat-välilehti on auki
  useRavistus(arvoElokuva, onAktiivinen);

  return (
    <View style={styles.container}>
      {/* Vihje ja painike, jolla arvonnan voi tehdä myös ilman ravistusta */}
      <Pressable style={styles.vihje} onPress={arvoElokuva}>
        <Text style={styles.vihjeTeksti}>
           Ravista puhelinta tai paina tästä, niin arvon sinulle elokuvan!
        </Text>
      </Pressable>

      <ListaNakyma
        uid={kayttaja?.uid}
        tyhjaTeksti="Lista on tyhjä. Hae elokuvia Haku-välilehdeltä."
      />
    </View>
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  vihje: {
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFF4D6',
  },
  vihjeTeksti: {
    textAlign: 'center',
    color: '#8A6100',
  },
});