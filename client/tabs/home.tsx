import React, { useState, useEffect } from "react";
import { styles } from "../_layout";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRootStore } from "../store/RootStoreProvider";
import { observer } from "mobx-react";

const normalizeSearchQuery = (query: string) => {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "");
};

const HomeScreen = observer(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const { lotScoutViewStore } = useRootStore();
  const {
    buildings,
    garages,
    fetchBuildings,
    fetchGarages,
    selectedBuilding,
    setSelectedBuilding,
    closestGarage,
    garageWithMostSpace,
    recommendedGarage,
    garagesSortedByDistance,
  } = lotScoutViewStore;

  useEffect(() => {
    fetchBuildings();
    fetchGarages();
  }, []);

  const searchBuilding = () => {
    if (!searchQuery) {
      setSearchResult([]);
      return;
    }
    let q = normalizeSearchQuery(searchQuery);
    let partialMatches = buildings.filter((b) =>
      b.full_name.toLowerCase().includes(q)
    );
    setSearchResult(partialMatches);
  };

  const findParking = () => {
    if (!selectedBuilding) {
      return;
    }
    setShowResults(true);
  };

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    setShowResults(false);
  };

  return (
    <View style={styles.container}>
      {selectedBuilding ? (
        <>
          {/* Close Button */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
            <Pressable
              onPress={() => {
                setSelectedBuilding(null);
                setShowResults(false);
              }}
              style={{
                backgroundColor: "#eee",
                borderRadius: 20,
                padding: 6,
              }}
            >
              <Ionicons name="close" size={20} color="black" />
            </Pressable>
          </View>

          <ScrollView style={{ width: "100%" }}>
            {/* Selected Building Card */}
            <View style={styles.cardContainer}>
              <Image
                source={require("../assets/buildings/gc-graham-center.jpg")}
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 8,
                  resizeMode: "cover",
                }}
              />
              <Text style={styles.garageName}>
                {selectedBuilding.acronym} - {selectedBuilding.full_name}
              </Text>
            </View>

            {/* Find Parking Button */}
            {!showResults && (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <TouchableOpacity style={styles.button} onPress={findParking}>
                  <Text style={styles.buttonText}>Find Parking</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Display Results */}
            {showResults && (
              <View style={{ marginTop: 20 }}>
                {/* Recommended Garage */}
                {recommendedGarage && (
                  <View style={[styles.garageCard, styles.recommendedCard]}>
                    <Text style={styles.recommendedText}>
                      ⭐ RECOMMENDED
                    </Text>
                    <Text style={styles.garageName}>
                      {recommendedGarage.acronym} - {recommendedGarage.full_name}
                    </Text>
                    <Text style={styles.garageInfo}>
                      📍 Distance: {recommendedGarage.distance.toFixed(2)} miles
                    </Text>
                    <Text style={styles.garageInfo}>
                      🅿️ Available Spaces: {recommendedGarage.student_spaces}
                    </Text>
                  </View>
                )}

                {/* Closest Garage */}
                {closestGarage && (
                  <View style={styles.garageCard}>
                    <Text style={[styles.garageInfo, { fontWeight: "bold" }]}>
                      🎯 CLOSEST GARAGE
                    </Text>
                    <Text style={styles.garageName}>
                      {closestGarage.acronym} - {closestGarage.full_name}
                    </Text>
                    <Text style={styles.garageInfo}>
                      📍 Distance: {closestGarage.distance.toFixed(2)} miles
                    </Text>
                    <Text style={styles.garageInfo}>
                      🅿️ Available Spaces: {closestGarage.student_spaces}
                    </Text>
                  </View>
                )}

                {/* Most Available Space */}
                {garageWithMostSpace && (
                  <View style={styles.garageCard}>
                    <Text style={[styles.garageInfo, { fontWeight: "bold" }]}>
                      🅿️ MOST AVAILABLE SPACE
                    </Text>
                    <Text style={styles.garageName}>
                      {garageWithMostSpace.acronym} - {garageWithMostSpace.full_name}
                    </Text>
                    <Text style={styles.garageInfo}>
                      🅿️ Available Spaces: {garageWithMostSpace.student_spaces}
                    </Text>
                  </View>
                )}

                {/* All Garages Sorted by Distance */}
                <View style={styles.detailCard}>
                  <Text style={styles.screenTitle}>
                    All Garages (by Distance)
                  </Text>
                  {garagesSortedByDistance.map((garage, idx) => (
                    <View
                      key={garage.acronym}
                      style={{
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ddd",
                      }}
                    >
                      <Text style={styles.detailText}>
                        {idx + 1}. {garage.acronym} - {garage.full_name}
                      </Text>
                      <Text style={styles.garageInfo}>
                        📍 {garage.distance.toFixed(2)} miles · 🅿️{" "}
                        {garage.student_spaces} spaces
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <>
          {/* Search Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter building name (e.g., GC, Graham Center)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
            onSubmitEditing={searchBuilding}
          />

          {/* Building List */}
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
                    onPress={() => handleBuildingSelect(building)}
                  >
                    <Image
                      source={require("../assets/buildings/gc-graham-center.jpg")}
                      style={{
                        width: "100%",
                        height: 120,
                        borderRadius: 8,
                        resizeMode: "cover",
                      }}
                    />
                    <Text style={styles.garageName}>
                      {building.acronym} - {building.full_name}
                    </Text>
                  </Pressable>
                ))
              : buildings.map((building, idx) => (
                  <Pressable
                    key={`${building.acronym}-${idx}`}
                    style={styles.cardContainer}
                    onPress={() => handleBuildingSelect(building)}
                  >
                    <Image
                      source={require("../assets/buildings/gc-graham-center.jpg")}
                      style={{
                        width: "100%",
                        height: 120,
                        borderRadius: 8,
                        resizeMode: "cover",
                      }}
                    />
                    <Text style={styles.garageName}>
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

export default HomeScreen;