import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Elokuva'>;

// Yksittäisen elokuvan tiedot ja näyttelijät
export default function ElokuvaScreen({ route }: Props) {
  // Elokuvan id tulee edelliseltä näkymältä
  const { elokuvaId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elokuvan id: {elokuvaId}</Text>
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