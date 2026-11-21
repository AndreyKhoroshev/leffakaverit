import { View, Text, StyleSheet } from 'react-native';

// Hakunäkymä: täällä käyttäjä hakee elokuvia TMDB:stä
export default function HakuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Haku</Text>
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