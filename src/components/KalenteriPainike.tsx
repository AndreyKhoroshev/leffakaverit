import { useState } from 'react';
import { Text, Pressable, Alert, StyleSheet } from 'react-native';
import { lisaaEnsiIltaKalenteriin } from '../services/kalenteri';
import { muotoilePaiva, onTulossa } from '../utils/paivat';

type Props = {
  nimi: string;
  julkaisupaiva: string;
};

// Painike, joka lisää tulevan ensi-illan puhelimen kalenteriin
export default function KalenteriPainike({ nimi, julkaisupaiva }: Props) {
  const [lisatty, setLisatty] = useState(false);

  // Painike näytetään vain elokuville, joiden ensi-ilta on vielä tulossa
  if (!julkaisupaiva || !onTulossa(julkaisupaiva)) return null;

  const lisaa = async () => {
    try {
      const onnistui = await lisaaEnsiIltaKalenteriin(nimi, julkaisupaiva);
      if (onnistui) setLisatty(true);
    } catch {
      Alert.alert('Virhe', 'Kalenteriin lisääminen epäonnistui.');
    }
  };

  return (
    <Pressable
      style={[styles.painike, lisatty && styles.lisatty]}
      onPress={lisaa}
      disabled={lisatty}
    >
      <Text style={styles.teksti}>
        {lisatty
          ? 'Lisätty kalenteriin'
          : `Lisää kalenteriin (${muotoilePaiva(julkaisupaiva)})`}
      </Text>
    </Pressable>
  );
}

// Tyylit
const styles = StyleSheet.create({
  painike: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FF9500',
    alignItems: 'center',
  },
  lisatty: {
    backgroundColor: '#34C759',
  },
  teksti: {
    color: '#fff',
    fontWeight: 'bold',
  },
});