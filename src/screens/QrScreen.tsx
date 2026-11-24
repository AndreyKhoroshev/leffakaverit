import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';

// Etuliite, jonka avulla tunnistetaan vain Leffakaverit-sovelluksen koodit
export const QR_ETULIITE = 'leffakaverit:';

// QR-koodinäkymä: oma koodi, jonka kaveri voi skannata
export default function QrScreen() {
  const { profiili } = useAuth();

  if (!profiili) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.otsikko}>Oma QR-koodisi</Text>
      <Text style={styles.ohje}>
        Näytä koodi kaverillesi. Kun hän skannaa sen, saat häneltä
        kaveripyynnön.
      </Text>

      {/* Koodin sisältö on esim. "leffakaverit:andrey" */}
      <View style={styles.koodi}>
        <QRCode value={`${QR_ETULIITE}${profiili.kayttajanimi}`} size={220} />
      </View>

      <Text style={styles.nimi}>{profiili.kayttajanimi}</Text>
    </View>
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  otsikko: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ohje: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  koodi: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  nimi: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
});