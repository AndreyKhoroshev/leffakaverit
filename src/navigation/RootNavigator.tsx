import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ElokuvaScreen from '../screens/ElokuvaScreen';

// Päänavigaation näkymät ja niiden parametrit
export type RootStackParamList = {
  Tabs: undefined;
  Elokuva: { elokuvaId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Päänavigaatio: alavalikko + näkymät, jotka avautuvat sen päälle
export default function RootNavigator() {
  return (
    <Stack.Navigator>
      {/* Alavalikolla on oma otsikko, joten Stackin otsikko piilotetaan */}
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
    </Stack.Navigator>
  );
}