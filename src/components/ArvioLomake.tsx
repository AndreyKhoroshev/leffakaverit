import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { tallennaArvio } from '../services/elokuvaLista';
import { ListaElokuva } from '../types/lista';

type Props = {
  listaElokuva: ListaElokuva;
};

// Arvosana-asteikon maksimi
const MAKSIMI = 10;

// Oma arvosana (1–10 tähteä) ja kirjallinen arvio katsotulle elokuvalle
export default function ArvioLomake({ listaElokuva }: Props) {
  const { kayttaja } = useAuth();
  // Lomake täytetään valmiiksi aiemmalla arviolla, jos sellainen on
  const [arvosana, setArvosana] = useState(listaElokuva.arvosana ?? 0);
  const [arvio, setArvio] = useState(listaElokuva.arvio ?? '');
  const [tallentaa, setTallentaa] = useState(false);
  const [tallennettu, setTallennettu] = useState(false);

  const valitseArvosana = (n: number) => {
    setArvosana(n);
    setTallennettu(false);
  };

  const muutaArvio = (teksti: string) => {
    setArvio(teksti);
    setTallennettu(false);
  };

  const tallenna = async () => {
    if (!kayttaja) return;
    if (arvosana === 0) {
      Alert.alert('Arvosana puuttuu', `Valitse ensin 1–${MAKSIMI} tähteä.`);
      return;
    }
    setTallentaa(true);
    try {
      await tallennaArvio(kayttaja.uid, listaElokuva.id, arvosana, arvio);
      setTallennettu(true);
    } catch {
      Alert.alert('Virhe', 'Arvion tallennus epäonnistui.');
    } finally {
      setTallentaa(false);
    }
  };

  // Luodaan taulukko [1, 2, ..., 10] tähtiä varten
  const tahdet = Array.from({ length: MAKSIMI }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <Text style={styles.otsikko}>Oma arvio</Text>

      {/* Tähdet: painettu tähti ja sitä edeltävät täyttyvät */}
      <View style={styles.tahtiRivi}>
        <View style={styles.tahdet}>
          {tahdet.map((n) => (
            <Pressable key={n} onPress={() => valitseArvosana(n)} hitSlop={4}>
              <Ionicons
                name={n <= arvosana ? 'star' : 'star-outline'}
                size={26}
                color="#FFB400"
              />
            </Pressable>
          ))}
        </View>
        {/* Arvosana numerona, esim. 7/10 */}
        <Text style={styles.numero}>
          {arvosana > 0 ? `${arvosana}/${MAKSIMI}` : ''}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Kirjoita oma arvio (valinnainen)"
        value={arvio}
        onChangeText={muutaArvio}
        multiline
        maxLength={500}
      />

      <Pressable style={styles.painike} onPress={tallenna} disabled={tallentaa}>
        {tallentaa ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.painikeTeksti}>
            {tallennettu ? 'Tallennettu ✓' : 'Tallenna arvio'}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

// Tyylit
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  otsikko: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tahtiRivi: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tahdet: {
    flexDirection: 'row',
    gap: 2,
  },
  numero: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  painike: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  painikeTeksti: {
    color: '#fff',
    fontWeight: 'bold',
  },
});