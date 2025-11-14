import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './tabs/home'
import GaragesScreen from './tabs/garages';
import MapScreen from './tabs/map';
import { RootStoreProvider } from './store/RootStoreProvider';

const Stack = createStackNavigator();

// Main App Component
export default function App() {
  return (
    <RootStoreProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" id={null}>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'LotScout' }}
          />
          <Stack.Screen 
            name="Garages" 
            component={GaragesScreen} 
            options={{ title: 'Available Garages' }}
          />
          <Stack.Screen 
            name="Map" 
            component={MapScreen} 
            options={{ title: 'Map View' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RootStoreProvider>
  );
}