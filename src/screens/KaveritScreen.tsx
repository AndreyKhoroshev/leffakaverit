import { View, Text, StyleSheet } from 'react-native';

// Kaverit ja heidän listansa
export default function KaveritScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kaverit</Text>
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