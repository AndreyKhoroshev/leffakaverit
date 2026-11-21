import { View, Text, StyleSheet } from 'react-native';

// Omat listat: katsottavat ja katsotut elokuvat
export default function ListatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listat</Text>
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