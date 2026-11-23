import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Kaverit ja heidän listansa
export default function KaveritScreen() {
  const { kayttaja, kirjauduUlos } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kaverit</Text>

      {/* Väliaikainen: näytetään kirjautunut käyttäjä ja uloskirjautuminen */}
      <Text style={styles.info}>Kirjautunut: {kayttaja?.email}</Text>
      <Button title="Kirjaudu ulos" onPress={kirjauduUlos} />
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
  info: {
    marginVertical: 12,
    color: '#666',
  },
});