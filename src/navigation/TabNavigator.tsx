import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HakuScreen from '../screens/HakuScreen';
import ListatScreen from '../screens/ListatScreen';
import EnsiIllatScreen from '../screens/EnsiIllatScreen';
import KaveritScreen from '../screens/KaveritScreen';

// Välilehtien nimet (parametreja ei vielä ole, siksi undefined)
export type TabParamList = {
  Haku: undefined;
  Listat: undefined;
  EnsiIllat: undefined;
  Kaverit: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Alavalikko, jossa ovat sovelluksen päänäkymät
export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Haku" component={HakuScreen} />
      <Tab.Screen name="Listat" component={ListatScreen} />
      <Tab.Screen
        name="EnsiIllat"
        component={EnsiIllatScreen}
        options={{ title: 'Ensi-illat' }}
      />
      <Tab.Screen name="Kaverit" component={KaveritScreen} />
    </Tab.Navigator>
  );
}