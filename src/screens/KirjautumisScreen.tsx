import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';
import { authVirheviesti } from '../services/authVirheet';

type Props = NativeStackScreenProps<RootStackParamList, 'Kirjautuminen'>;

// Kirjautumisnäkymä
export default function KirjautumisScreen({ navigation }: Props) {
  const { kirjaudu } = useAuth();
  const [email, setEmail] = useState('');
  const [salasana, setSalasana] = useState('');
  const [virhe, setVirhe] = useState<string | null>(null);
  const [lahettaa, setLahettaa] = useState(false);

  const kasitteleKirjautuminen = async () => {
    setVirhe(null);
    setLahettaa(true);
    try {
      await kirjaudu(email, salasana);
      // Onnistuessa RootNavigator vaihtaa näkymät automaattisesti
    } catch (e) {
      setVirhe(authVirheviesti(e));
      setLahettaa(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      // iOS:llä näppäimistö ei saa peittää kenttiä
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>Leffakaverit</Text>

      <TextInput
        style={styles.input}
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        value={salasana}
        onChangeText={setSalasana}
        secureTextEntry
      />

      {virhe && <Text style={styles.virhe}>{virhe}</Text>}

      <Pressable
        style={styles.painike}
        onPress={kasitteleKirjautuminen}
        disabled={lahettaa}
      >
        {lahettaa ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.painikeTeksti}>Kirjaudu</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Rekisteroityminen')}>
        <Text style={styles.linkki}>Eikö sinulla ole tiliä? Rekisteröidy</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  virhe: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  painike: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  painikeTeksti: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkki: {
    color: '#007AFF',
    textAlign: 'center',
  },
});