
import * as Location from 'expo-location';
import { styles } from '../_layout';
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
import { useEffect, useState } from 'react';

// Garages Screen Component
export default function GaragesScreen({ route, navigation }) {
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