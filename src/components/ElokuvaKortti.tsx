import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { ElokuvanPerustiedot } from '../types/lista';
import { julisteUrl } from '../services/tmdb';

type Props = {
  elokuva: ElokuvanPerustiedot;
  onPress: () => void;
  // Valinnainen lisärivi, esim. oma arvosana
  lisatieto?: string;
};

// Yksi rivi elokuvalistassa: juliste, nimi, vuosi ja mahdollinen lisätieto
export default function ElokuvaKortti({ elokuva, onPress, lisatieto }: Props) {
  const kuva = julisteUrl(elokuva.poster_path);
  const vuosi = elokuva.release_date?.slice(0, 4);

  return (
    <Pressable style={styles.kortti} onPress={onPress}>
      {kuva ? (
        <Image source={{ uri: kuva }} style={styles.juliste} />
      ) : (
        // Harmaa laatikko, jos julistetta ei ole
        <View style={[styles.juliste, styles.eiKuvaa]} />
      )}
      <View style={styles.tiedot}>
        <Text style={styles.nimi}>{elokuva.title}</Text>
        {vuosi ? <Text style={styles.vuosi}>{vuosi}</Text> : null}
        {lisatieto ? <Text style={styles.lisatieto}>{lisatieto}</Text> : null}
      </View>
    </Pressable>
  );
}

// Kortin tyylit
const styles = StyleSheet.create({
  kortti: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  juliste: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  eiKuvaa: {
    backgroundColor: '#ccc',
  },
  tiedot: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nimi: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vuosi: {
    color: '#666',
    marginTop: 4,
  },
  lisatieto: {
    marginTop: 4,
    fontWeight: '600',
  },
});