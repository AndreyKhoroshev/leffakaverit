import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useElokuvaHaku } from '../hooks/useElokuvaHaku';
import ElokuvaKortti from '../components/ElokuvaKortti';

// Hakunäkymä: käyttäjä hakee elokuvia TMDB:stä
export default function HakuScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [hakusana, setHakusana] = useState('');
  const { tulokset, lataa, virhe, hae } = useElokuvaHaku();

  return (
    <View style={styles.container}>
      {/* Hakukenttä: haku käynnistyy näppäimistön hakupainikkeesta */}
      <TextInput
        style={styles.input}
        placeholder="Hae elokuvaa..."
        value={hakusana}
        onChangeText={setHakusana}
        onSubmitEditing={() => hae(hakusana)}
        returnKeyType="search"
      />

      {lataa && <ActivityIndicator style={styles.lataus} />}
      {virhe && <Text style={styles.virhe}>{virhe}</Text>}

      {/* Hakutulokset listana */}
      <FlatList
        data={tulokset}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ElokuvaKortti
            elokuva={item}
            onPress={() =>
              navigation.navigate('Elokuva', { elokuvaId: item.id })
            }
          />
        )}
      />
    </View>
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
  },
  lataus: {
    marginTop: 10,
  },
  virhe: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
});