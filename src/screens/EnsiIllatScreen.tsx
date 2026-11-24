import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useTulevat } from '../hooks/useTulevat';
import { muotoilePaiva } from '../utils/paivat'; 
import ElokuvaKortti from '../components/ElokuvaKortti';

// Tulevat ensi-illat Suomessa
export default function EnsiIllatScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { elokuvat, lataa, virhe, paivita } = useTulevat();

  // Virheen sattuessa näytetään viesti ja uudelleenyritys
  if (virhe) {
    return (
      <View style={styles.keskella}>
        <Text style={styles.virhe}>{virhe}</Text>
        <Button title="Yritä uudelleen" onPress={paivita} />
      </View>
    );
  }

  // Teksti, jos ensi-iltoja ei löytynyt
  const tyhja = lataa ? undefined : (
    <Text style={styles.tyhja}>Tulevia ensi-iltoja ei löytynyt.</Text>
  );

  return (
    <FlatList
      data={elokuvat}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ElokuvaKortti
          elokuva={item}
          lisatieto={`Ensi-ilta ${muotoilePaiva(item.release_date)}`}
          onPress={() => navigation.navigate('Elokuva', { elokuvaId: item.id })}
        />
      )}
      // Listan voi päivittää vetämällä alaspäin
      refreshing={lataa}
      onRefresh={paivita}
      ListEmptyComponent={tyhja}
    />
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  keskella: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  virhe: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  tyhja: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
  },
});