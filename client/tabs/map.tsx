import MapView, { Marker } from 'react-native-maps';
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
import { styles } from '../_layout';
import { useEffect, useState } from 'react';

// Map Screen Component
export default function MapScreen({ route }) {
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