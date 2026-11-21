import { View, Text, StyleSheet } from 'react-native';

// Tulevat ensi-illat 
export default function EnsiIllatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ensi-illat</Text>
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