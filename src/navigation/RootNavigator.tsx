import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ElokuvaScreen from '../screens/ElokuvaScreen';
import KaverinListatScreen from '../screens/KaverinListatScreen';
import KirjautumisScreen from '../screens/KirjautumisScreen';
import RekisteroitymisScreen from '../screens/RekisteroitymisScreen';
import { useAuth } from '../context/AuthContext';

// Päänavigaation näkymät ja niiden parametrit
export type RootStackParamList = {
  Kirjautuminen: undefined;
  Rekisteroityminen: undefined;
  Tabs: undefined;
  Elokuva: { elokuvaId: number };
  KaverinListat: { uid: string; kayttajanimi: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Päänavigaatio: näytettävät näkymät riippuvat siitä, onko käyttäjä kirjautunut
export default function RootNavigator() {
  const { kayttaja, lataa } = useAuth();

  // Odotetaan, kunnes Firebase kertoo kirjautumistilan
  if (lataa) {
    return (
      <View style={styles.keskella}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {kayttaja ? (
        // Kirjautuneen käyttäjän näkymät
        <>
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Elokuva"
            component={ElokuvaScreen}
            options={{ title: 'Elokuva' }}
          />
          <Stack.Screen
            name="KaverinListat"
            component={KaverinListatScreen}
            // Otsikoksi kaverin käyttäjänimi
            options={({ route }) => ({ title: route.params.kayttajanimi })}
          />
        </>
      ) : (
        // Kirjautumattoman käyttäjän näkymät
        <>
          <Stack.Screen
            name="Kirjautuminen"
            component={KirjautumisScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Rekisteroityminen"
            component={RekisteroitymisScreen}
            options={{ title: 'Rekisteröidy' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

// Tyylit
const styles = StyleSheet.create({
  keskella: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});