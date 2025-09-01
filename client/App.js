import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { supabase } from '../services/supabase';

const Stack = createStackNavigator();

// Home Screen Component
function HomeScreen({ navigation }) {
  const [garages,setGarages] = useState([]);
  const [building, setBuilding] = useState('');
  const [loading, setLoading] = useState(false);

  const findParking = async () => {
    if (!building.trim()) {
      Alert.alert('Error', 'Please enter a building name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/find-parking', {
        building: building.trim()
      });
      
      navigation.navigate('Garages', {
        garages: response.data.garages,
        recommended: response.data.recommended,
        building: building
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to find parking. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LotScout</Text>
      <Text style={styles.subtitle}>Find parking near your class</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter building name (e.g., GC, Graham Center)"
          value={building}
          onChangeText={setBuilding}
          autoCapitalize="words"
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={findParking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Find Parking</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Garages Screen Component
function GaragesScreen({ route, navigation }) {
  const { garages, recommended, building } = route.params;
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const renderGarage = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.garageCard,
        item.id === recommended?.id && styles.recommendedCard
      ]}
      onPress={() => navigation.navigate('GarageDetail', { garage: item })}
    >
      <Text style={styles.garageName}>{item.name}</Text>
      <Text style={styles.garageInfo}>
        Available: {item.capacity - item.current_occupancy} spots
      </Text>
      <Text style={styles.garageInfo}>
        Rate: ${item.hourly_rate}/hour
      </Text>
      {item.id === recommended?.id && (
        <Text style={styles.recommendedText}>⭐ Recommended</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>
        Parking near {building}
      </Text>
      
      <FlatList
        data={garages}
        renderItem={renderGarage}
        keyExtractor={(item) => item.id}
        style={styles.garageList}
      />
      
      <TouchableOpacity 
        style={styles.mapButton}
        onPress={() => navigation.navigate('Map', { garages, userLocation })}
      >
        <Text style={styles.mapButtonText}>View on Map</Text>
      </TouchableOpacity>
    </View>
  );
}

// Map Screen Component
function MapScreen({ route }) {
  const { garages, userLocation } = route.params;
  const [region, setRegion] = useState({
    latitude: 25.7569,
    longitude: -80.3741,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    if (userLocation) {
      setRegion({
        ...region,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    }
  }, [userLocation]);

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
      >
        {garages.map((garage) => (
          <Marker
            key={garage.id}
            coordinate={garage.location}
            title={garage.name}
            description={`${garage.capacity - garage.current_occupancy} spots available`}
          />
        ))}
      </MapView>
    </View>
  );
}

// Garage Detail Screen Component
function GarageDetailScreen({ route }) {
  const { garage } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>{garage.name}</Text>
      
      <View style={styles.detailCard}>
        <Text style={styles.detailText}>
          Capacity: {garage.capacity} spots
        </Text>
        <Text style={styles.detailText}>
          Available: {garage.capacity - garage.current_occupancy} spots
        </Text>
        <Text style={styles.detailText}>
          Hourly Rate: ${garage.hourly_rate}
        </Text>
        <Text style={styles.detailText}>
          Status: {garage.is_open ? 'Open' : 'Closed'}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.navigateButton}>
        <Text style={styles.navigateButtonText}>Navigate to Garage</Text>
      </TouchableOpacity>
    </View>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
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
        <Stack.Screen 
          name="GarageDetail" 
          component={GarageDetailScreen} 
          options={{ title: 'Garage Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#7f8c8d',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  garageList: {
    flex: 1,
  },
  garageCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recommendedCard: {
    borderColor: '#f39c12',
    borderWidth: 2,
  },
  garageName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  garageInfo: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  recommendedText: {
    color: '#f39c12',
    fontWeight: 'bold',
    marginTop: 5,
  },
  mapButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  mapButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  detailCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2c3e50',
  },
  navigateButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
