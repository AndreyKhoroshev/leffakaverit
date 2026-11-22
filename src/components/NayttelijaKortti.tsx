import { View, Text, Image, StyleSheet } from 'react-native';
import { Nayttelija } from '../types/tmdb';
import { julisteUrl } from '../services/tmdb';

type Props = {
  nayttelija: Nayttelija;
};

// Yksi näyttelijä: kuva, nimi ja rooli
export default function NayttelijaKortti({ nayttelija }: Props) {
  // Sama kuvapalvelin toimii myös näyttelijöiden kuville
  const kuva = julisteUrl(nayttelija.profile_path);

  return (
    <View style={styles.kortti}>
      {kuva ? (
        <Image source={{ uri: kuva }} style={styles.kuva} />
      ) : (
        <View style={[styles.kuva, styles.eiKuvaa]} />
      )}
      <Text style={styles.nimi} numberOfLines={2}>
        {nayttelija.name}
      </Text>
      <Text style={styles.rooli} numberOfLines={2}>
        {nayttelija.character}
      </Text>
    </View>
  );
}

// Kortin tyylit
const styles = StyleSheet.create({
  kortti: {
    width: 90,
    marginRight: 10,
  },
  kuva: {
    width: 90,
    height: 135,
    borderRadius: 6,
  },
  eiKuvaa: {
    backgroundColor: '#ccc',
  },
  nimi: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },
  rooli: {
    fontSize: 12,
    color: '#666',
  },
});