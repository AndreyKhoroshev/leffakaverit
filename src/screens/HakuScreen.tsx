import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

// Hakunäkymä: täällä käyttäjä hakee elokuvia TMDB:stä
export default function HakuScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Haku</Text>

      {/* Väliaikainen testipainike: avaa elokuvan id:llä 556 */}
      <Button
        title="Avaa testielokuva"
        onPress={() => navigation.navigate('Elokuva', { elokuvaId: 556 })}
      />
    </View>
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});