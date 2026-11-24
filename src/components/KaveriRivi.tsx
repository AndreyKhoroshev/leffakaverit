import { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { poistaKaveri } from '../services/kaverit';
import { useAuth } from '../context/AuthContext';
import { Kaveri } from '../types/kaveri';

type Props = {
  kaveri: Kaveri;
  onAvaa?: () => void;
};

// Yksi kaveri listalla: nimi, tila ja poistopainike
export default function KaveriRivi({ kaveri, onAvaa }: Props) {
  const { kayttaja } = useAuth();
  // null = vielä tarkistamatta, true = kaveri on lisännyt minut takaisin
  const [hyvaksytty, setHyvaksytty] = useState<boolean | null>(null);

  // Kuunnellaan, onko kaveri lisännyt minut omille kavereilleen
  useEffect(() => {
    if (!kayttaja) return;
    const lopetaKuuntelu = onSnapshot(
      doc(db, 'kayttajat', kaveri.uid, 'kaverit', kayttaja.uid),
      (snap) => setHyvaksytty(snap.exists()),
      () => setHyvaksytty(false)
    );
    return lopetaKuuntelu;
  }, [kayttaja, kaveri.uid]);

  // Varmistetaan ennen poistoa
  const poista = () => {
    Alert.alert(
      'Poista kaveri',
      `Haluatko varmasti poistaa ${kaveri.kayttajanimi} kavereista?`,
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            if (!kayttaja) return;
            try {
              await poistaKaveri(kayttaja.uid, kaveri.uid);
            } catch {
              Alert.alert('Virhe', 'Poistaminen epäonnistui.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.rivi}>
      {/* Vain hyväksytyn kaverin listat voi avata */}
      <Pressable
        style={styles.tiedot}
        onPress={onAvaa}
        disabled={!hyvaksytty || !onAvaa}
      >
        <Ionicons name="person-circle-outline" size={36} color="#007AFF" />
        <View style={styles.tekstit}>
          <Text style={styles.nimi}>{kaveri.kayttajanimi}</Text>
          {hyvaksytty !== null && (
            <Text style={hyvaksytty ? styles.ok : styles.odottaa}>
              {hyvaksytty ? 'Kaveri' : 'Odottaa hyväksyntää'}
            </Text>
          )}
        </View>
      </Pressable>

      <Pressable onPress={poista} hitSlop={8}>
        <Ionicons name="trash-outline" size={22} color="#cc0000" />
      </Pressable>
    </View>
  );
}

// Tyylit
const styles = StyleSheet.create({
  rivi: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tiedot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tekstit: {
    marginLeft: 10,
  },
  nimi: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ok: {
    color: 'green',
  },
  odottaa: {
    color: '#999',
  },
});