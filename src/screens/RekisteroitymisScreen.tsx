import { useState } from 'react';
import {
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { authVirheviesti } from '../services/authVirheet';

// Rekisteröitymisnäkymä: käyttäjänimi, sähköposti ja salasana
export default function RekisteroitymisScreen() {
  const { rekisteroidy } = useAuth();
  const [kayttajanimi, setKayttajanimi] = useState('');
  const [email, setEmail] = useState('');
  const [salasana, setSalasana] = useState('');
  const [salasana2, setSalasana2] = useState('');
  const [virhe, setVirhe] = useState<string | null>(null);
  const [lahettaa, setLahettaa] = useState(false);

  const kasitteleRekisteroityminen = async () => {
    // Tarkistetaan kentät ennen Firebase-kutsua
    if (kayttajanimi.trim().length < 3) {
      setVirhe('Käyttäjänimen täytyy olla vähintään 3 merkkiä.');
      return;
    }
    if (salasana !== salasana2) {
      setVirhe('Salasanat eivät täsmää.');
      return;
    }

    setVirhe(null);
    setLahettaa(true);
    try {
      await rekisteroidy(kayttajanimi, email, salasana);
      // Onnistuessa käyttäjä kirjautuu automaattisesti sisään
    } catch (e) {
      setVirhe(authVirheviesti(e));
      setLahettaa(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.input}
          placeholder="Käyttäjänimi"
          value={kayttajanimi}
          onChangeText={setKayttajanimi}
          autoCapitalize="none"
        />
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
          placeholder="Salasana (vähintään 6 merkkiä)"
          value={salasana}
          onChangeText={setSalasana}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Salasana uudelleen"
          value={salasana2}
          onChangeText={setSalasana2}
          secureTextEntry
        />

        {virhe && <Text style={styles.virhe}>{virhe}</Text>}

        <Pressable
          style={styles.painike}
          onPress={kasitteleRekisteroityminen}
          disabled={lahettaa}
        >
          {lahettaa ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.painikeTeksti}>Luo tili</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
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
  },
  painikeTeksti: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});