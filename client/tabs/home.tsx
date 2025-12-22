import React, { useState, useEffect } from "react";
import { styles } from "../_layout";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRootStore } from "../store/RootStoreProvider";
import { observer } from "mobx-react";

const normalizeSearchQuery = (query: string) => {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "");
};

// Home Screen Component
const HomeScreen = observer(({ }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [loading, setLoading] = useState(null);

  // Get the view store
  const { lotScoutViewStore } = useRootStore();
  const {
    buildings,
    garages,
    fetchBuildings,
    fetchGarages,
    closestGarage,
    garageWithMostSpace,
    recommendedGarage,
    garagesSortedByDistance

  } = lotScoutViewStore;

  useEffect(() => {
    fetchBuildings();
    fetchGarages();
  },[]);
  

  const searchBuilding = () => {
    if (!searchQuery) {
      setSearchResult([]);
      return;
    }
    let q = normalizeSearchQuery(searchQuery);
    let partialMatches = buildings.filter((b) =>
      b.full_name.toLowerCase().includes(q)
    );
    console.log(partialMatches);
    setSearchResult(partialMatches);
  };

  const findParking = async () => {
    if (!selectedBuilding.trim()) {
      Alert.alert("Error", "Please enter a building name");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/find-parking", {
        building: selectedBuilding.trim(),
      });

      // navigation.navigate("Garages", {
      //   garages: response.data.garages,
      //   recommended: response.data.recommended,
      //   building: selectedBuilding,
      // });
    } catch (error) {
      Alert.alert("Error", "Failed to find parking. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {selectedBuilding ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end", // push children to the right
            }}
          >
            <Pressable
              onPress={() => setSelectedBuilding(null)}
              style={{
                backgroundColor: "#eee",
                borderRadius: 20,
                padding: 6,
              }}
            >
              <Ionicons name="close" size={20} color="black" />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "column", // put children in a row
              width:'100%',
              alignItems: 'center'
            }}
          >
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
            <View style={styles.cardContainer}>
              <Image
                source={require("../assets/buildings/gc-graham-center.jpg")}
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 8,
                  resizeMode: "cover",
                  paddingBottom: 10,
                }}
              />
              <Text
                style={{
                  color: "#404040",
                  fontSize: 18,
                }}
              >
                {selectedBuilding.acronym} - {selectedBuilding.full_name}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter building name (e.g., GC, Graham Center)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
            onSubmitEditing={searchBuilding}
          />
          <ScrollView
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {searchResult.length > 0
              ? searchResult.map((building, idx) => (
                  <Pressable
                    key={`${building.acronym}-${idx}`}
                    style={styles.cardContainer}
                    onPress={() => setSelectedBuilding(building)}
                  >
                    <Image
                      source={require("../assets/buildings/gc-graham-center.jpg")}
                      style={{
                        width: "100%",
                        height: 120,
                        borderRadius: 8,
                        resizeMode: "cover",
                        paddingBottom: 10,
                      }}
                    />
                    <Text
                      style={{
                        color: "black",
                        fontSize: 18,
                      }}
                    >
                      {building.acronym} - {building.full_name}
                    </Text>
                  </Pressable>
                ))
              : buildings.map((building, idx) => (
                  <Pressable
                    key={`${building.acronym}-${idx}`}
                    style={styles.cardContainer}
                    onPress={() => setSelectedBuilding(building)}
                  >
                    <Image
                      source={require("../assets/buildings/gc-graham-center.jpg")}
                      style={{
                        width: "100%",
                        height: 120,
                        borderRadius: 8,
                        resizeMode: "cover",
                        paddingBottom: 10,
                      }}
                    />
                    <Text
                      style={{
                        color: "#404040",
                        fontSize: 18,
                      }}
                    >
                      {building.acronym} - {building.full_name}
                    </Text>
                  </Pressable>
                ))}
          </ScrollView>
        </>
      )}
    </View>
  );
});

export default HomeScreen
