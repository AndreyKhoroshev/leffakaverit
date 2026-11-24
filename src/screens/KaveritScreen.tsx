import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useKaverit } from '../hooks/useKaverit';
import {
  lisaaKaveri,
  hyvaksyPyynto,
  hylkaaPyynto,
  KaveriVirhe,
} from '../services/kaverit';
import { Kaveripyynto } from '../types/kaveri';
import KaveriRivi from '../components/KaveriRivi';

// Kaverit: lisääminen, saapuneet pyynnöt ja kaverilista
export default function KaveritScreen() {
  const { kayttaja, profiili, kirjauduUlos } = useAuth();
  const { kaverit, pyynnot, lataa } = useKaverit(kayttaja?.uid);
  const [hakunimi, setHakunimi] = useState('');
  const [lahettaa, setLahettaa] = useState(false);
  const [viesti, setViesti] = useState<string | null>(null);
  const [onVirhe, setOnVirhe] = useState(false);

  // Lisää kaverin kirjoitetulla käyttäjänimellä
  const lisaa = async () => {
    if (!kayttaja || !profiili || !hakunimi.trim()) return;
    setLahettaa(true);
    setViesti(null);
    try {
      const tulos = await lisaaKaveri(
        kayttaja.uid,
        profiili.kayttajanimi,
        hakunimi
      );
      setOnVirhe(false);
      setViesti(
        tulos.molemminpuolinen
          ? `Olette nyt kavereita: ${tulos.kayttajanimi} ✓`
          : `Kaveripyyntö lähetetty: ${tulos.kayttajanimi}`
      );
      setHakunimi('');
    } catch (e) {
      setOnVirhe(true);
      setViesti(
        e instanceof KaveriVirhe
          ? e.message
          : 'Jotain meni pieleen. Yritä uudelleen.'
      );
    } finally {
      setLahettaa(false);
    }
  };

  // Hyväksyy saapuneen kaveripyynnön
  const hyvaksy = async (pyynto: Kaveripyynto) => {
    if (!kayttaja) return;
    try {
      await hyvaksyPyynto(kayttaja.uid, pyynto);
    } catch {
      Alert.alert('Virhe', 'Hyväksyminen epäonnistui.');
    }
  };

  // Hylkää saapuneen kaveripyynnön
  const hylkaa = async (pyynto: Kaveripyynto) => {
    if (!kayttaja) return;
    try {
      await hylkaaPyynto(kayttaja.uid, pyynto.uid);
    } catch {
      Alert.alert('Virhe', 'Hylkääminen epäonnistui.');
    }
  };

  // Listan yläosa: oma käyttäjä, lisäyslomake ja pyynnöt
  const ylaosa = (
    <View>
      {/* Oma käyttäjä ja uloskirjautuminen */}
      <View style={styles.omaRivi}>
        <Text style={styles.omaNimi}>👤 {profiili?.kayttajanimi}</Text>
        <Pressable onPress={kirjauduUlos}>
          <Text style={styles.linkki}>Kirjaudu ulos</Text>
        </Pressable>
      </View>

      {/* Kaverin lisääminen käyttäjänimellä */}
      <Text style={styles.otsikko}>Lisää kaveri</Text>
      <View style={styles.lisaysRivi}>
        <TextInput
          style={styles.input}
          placeholder="Käyttäjänimi"
          value={hakunimi}
          onChangeText={setHakunimi}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={lisaa}
          returnKeyType="send"
        />
        <Pressable
          style={styles.lisaaPainike}
          onPress={lisaa}
          disabled={lahettaa}
        >
          {lahettaa ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="person-add" size={20} color="#fff" />
          )}
        </Pressable>
      </View>
      {viesti ? (
        <Text style={onVirhe ? styles.virhe : styles.onnistui}>{viesti}</Text>
      ) : null}

      {/* Saapuneet kaveripyynnöt, näytetään vain jos niitä on */}
      {pyynnot.length > 0 ? (
        <View>
          <Text style={styles.otsikko}>Kaveripyynnöt ({pyynnot.length})</Text>
          {pyynnot.map((pyynto) => (
            <View key={pyynto.uid} style={styles.pyyntoRivi}>
              <Text style={styles.pyyntoNimi}>{pyynto.kayttajanimi}</Text>
              <Pressable style={styles.hyvaksy} onPress={() => hyvaksy(pyynto)}>
                <Text style={styles.valkoinen}>Hyväksy</Text>
              </Pressable>
              <Pressable style={styles.hylkaa} onPress={() => hylkaa(pyynto)}>
                <Text>Hylkää</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      <Text style={styles.otsikko}>Kaverit ({kaverit.length})</Text>
      {lataa ? <ActivityIndicator /> : null}
    </View>
  );

  // Teksti, joka näytetään, kun kavereita ei ole
   const tyhja = lataa ? undefined : (
    <Text style={styles.tyhja}>
      Ei vielä kavereita. Lisää kaveri käyttäjänimellä.
    </Text>
  );

  return (
    <FlatList
      data={kaverit}
      keyExtractor={(item) => item.uid}
      renderItem={({ item }) => <KaveriRivi kaveri={item} />}
      ListHeaderComponent={ylaosa}
      ListEmptyComponent={tyhja}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.sisalto}
    />
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  sisalto: {
    paddingBottom: 24,
  },
  omaRivi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  omaNimi: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkki: {
    color: '#007AFF',
  },
  otsikko: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  lisaysRivi: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  lisaaPainike: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  virhe: {
    color: 'red',
    marginHorizontal: 16,
    marginTop: 8,
  },
  onnistui: {
    color: 'green',
    marginHorizontal: 16,
    marginTop: 8,
  },
  pyyntoRivi: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  pyyntoNimi: {
    flex: 1,
    fontSize: 16,
  },
  hyvaksy: {
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  hylkaa: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  valkoinen: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tyhja: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});