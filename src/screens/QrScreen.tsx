import { useRef, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';
import { lisaaKaveri, KaveriVirhe } from '../services/kaverit';

// Etuliite, jonka avulla tunnistetaan vain Leffakaverit-sovelluksen koodit
export const QR_ETULIITE = 'leffakaverit:';

type Props = NativeStackScreenProps<RootStackParamList, 'Qr'>;

// QR-koodinäkymä: oma koodi ja kaverin koodin skannaus
export default function QrScreen({ navigation }: Props) {
  const { kayttaja, profiili } = useAuth();
  const [lupa, pyydaLupa] = useCameraPermissions();
  const [skannaa, setSkannaa] = useState(false);
  // Kamera lukee saman koodin monta kertaa sekunnissa, joten estetään tuplakäsittely
  const kasittelyssa = useRef(false);

  // Avaa kameran. Pyytää ensin käyttöoikeuden, jos sitä ei vielä ole.
  const avaaSkanneri = async () => {
    if (!lupa?.granted) {
      const vastaus = await pyydaLupa();
      if (!vastaus.granted) {
        Alert.alert(
          'Kameran käyttöoikeus',
          'Salli kameran käyttö puhelimen asetuksista, jotta voit skannata koodeja.'
        );
        return;
      }
    }
    kasittelyssa.current = false;
    setSkannaa(true);
  };

  // Käsittelee skannatun koodin
  const kasitteleSkannaus = async ({ data }: BarcodeScanningResult) => {
    if (kasittelyssa.current || !kayttaja || !profiili) return;
    kasittelyssa.current = true;
    setSkannaa(false);

    // Hyväksytään vain Leffakaverit-koodit
    if (!data.startsWith(QR_ETULIITE)) {
      Alert.alert('Tuntematon koodi', 'Tämä ei ole Leffakaverit-koodi.');
      return;
    }

    const kayttajanimi = data.slice(QR_ETULIITE.length);
    try {
      const tulos = await lisaaKaveri(
        kayttaja.uid,
        profiili.kayttajanimi,
        kayttajanimi
      );
      Alert.alert(
        'Valmis',
        tulos.molemminpuolinen
          ? `Olette nyt kavereita käyttäjän: ${tulos.kayttajanimi} kanssa`
          : `Kaveripyyntö lähetetty: ${tulos.kayttajanimi}`,
        // OK-painike palaa Kaverit-näkymään
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      Alert.alert(
        'Virhe',
        e instanceof KaveriVirhe ? e.message : 'Jotain meni pieleen.'
      );
    }
  };

  if (!profiili) return null;

  // Skannaustila: kamera koko näytöllä
  if (skannaa) {
    return (
      <View style={styles.flex}>
        <CameraView
          style={styles.flex}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={kasitteleSkannaus}
        />
        <Text style={styles.kameraOhje}>Kohdista kamera kaverin QR-koodiin</Text>
        <Pressable style={styles.peruuta} onPress={() => setSkannaa(false)}>
          <Text style={styles.valkoinen}>Peruuta</Text>
        </Pressable>
      </View>
    );
  }

  // Perustila: oma koodi ja skannauspainike
  return (
    <View style={styles.container}>
      <Text style={styles.otsikko}>Oma QR-koodisi</Text>
      <Text style={styles.ohje}>
        Näytä koodi kaverillesi tai skannaa hänen koodinsa. Skannaus lähettää
        kaveripyynnön.
      </Text>

      {/* Koodin sisältö on esim. "leffakaverit:andrey" */}
      <View style={styles.koodi}>
        <QRCode value={`${QR_ETULIITE}${profiili.kayttajanimi}`} size={220} />
      </View>
      <Text style={styles.nimi}>{profiili.kayttajanimi}</Text>

      <Pressable style={styles.skannaaPainike} onPress={avaaSkanneri}>
        <Text style={styles.valkoinen}>Skannaa kaverin QR-koodi</Text>
      </Pressable>
    </View>
  );
}

// Näkymän tyylit
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  skannaaPainike: {
    marginTop: 32,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  valkoinen: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  kameraOhje: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  peruuta: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
});