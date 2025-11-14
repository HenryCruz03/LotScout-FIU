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

const exampleBuildings = [
  { acronym: "AHC1", full_name: "Academic Health Center 1" },
  { acronym: "AHC2", full_name: "Academic Health Center 2" },
  { acronym: "AHC3", full_name: "Academic Health Center 3" },
  { acronym: "AHC4", full_name: "Academic Health Center 4" },
  { acronym: "AHC5", full_name: "Academic Health Center 5" },
  { acronym: "AS", full_name: "Artist Studio" },
  { acronym: "BBS", full_name: "Baseball Stadium" },
  { acronym: "PG2", full_name: "Blue Parking Garage" },
  { acronym: "BD10", full_name: "Building 10" },
  { acronym: "CSC", full_name: "Campus Support Complex" },
  { acronym: "CFES", full_name: "Carlos Finlay Elementary School" },
  { acronym: "CU", full_name: "Central Utilities" },
  { acronym: "W01C", full_name: "Ceramics" },
  { acronym: "PC", full_name: "Charles Perry & Primera Casa" },
  { acronym: "CP", full_name: "Chemistry & Physics" },
  { acronym: "CCLC", full_name: "Children's Creative Learning Center" },
  { acronym: "CBC", full_name: "College of Business Complex" },
  { acronym: "CASE", full_name: "Computing, Arts, Sciences & Education" },
  { acronym: "DM", full_name: "Deuxieme Maison" },
  { acronym: "DC", full_name: "Duplicating Center" },
  { acronym: "GC", full_name: "Ernest R. Graham Center" },
  { acronym: "EH", full_name: "Everglades Residence Hall" },
  { acronym: "SSF", full_name: "FIU Soccer Stadium" },
  { acronym: "PG1", full_name: "Gold Parking Garage" },
  {
    acronym: "WPAC",
    full_name: "Herbert and Nicole Wertheim Performing Arts Center",
  },
  { acronym: "IC", full_name: "Information Center" },
  { acronym: "LC", full_name: "Labor Center" },
  { acronym: "LVN", full_name: "Lakeview Housing North" },
  { acronym: "LVS", full_name: "Lakeview Housing South" },
  { acronym: "MARC", full_name: "Management and Advanced Research Center" },
  {
    acronym: "MANGO",
    full_name: "Management and New Growth Opportunities Building",
  },
  { acronym: "NOAA", full_name: "National Hurricane Center" },
  { acronym: "NP", full_name: "Nature Preserve" },
  { acronym: "OBC", full_name: "Ocean Bank Convocation Center" },
  { acronym: "OE", full_name: "Owa Ehan" },
  { acronym: "PG3", full_name: "Panther Parking Garage" },
  { acronym: "PH", full_name: "Panther Residence Hall" },
  { acronym: "PVH", full_name: "Parkview Housing" },
  { acronym: "PPFAM", full_name: "Patricia & Philip Frost Art Museum" },
  { acronym: "PCA", full_name: "Paul L. Cejas School of Architecture" },
  { acronym: "PG5", full_name: "PG5 Market Station" },
  { acronym: "PG6", full_name: "PG6 Parking Garage 6" },
  { acronym: "PGD", full_name: "Phi Gamma Delta" },
  { acronym: "PKP", full_name: "Pi Kappa Phi" },
  { acronym: "PBST", full_name: "Pitbull Stadium" },
  { acronym: "TWR", full_name: "Public Safety Tower" },
  { acronym: "RDB", full_name: "Rafael Diaz-Balart Hall" },
  { acronym: "RC", full_name: "Recreation Complex" },
  { acronym: "PG4", full_name: "Red Parking Garage" },
  { acronym: "RH", full_name: "Ronald W. Reagan Presidential House" },
  { acronym: "W10A", full_name: "ROTC-Reserve Officer Training Corps" },
  { acronym: "RB", full_name: "Ryder Business Building" },
  { acronym: "ZEB", full_name: "Sanford and Dolores Ziff Education Building" },
  { acronym: "GL", full_name: "Steve and Dorothea Green Library" },
  {
    acronym: "SIPA",
    full_name: "Steven J. Green School of International and Public Affairs",
  },
  { acronym: "ASTRO", full_name: "Stocker AstroScience Center" },
  { acronym: "SASC", full_name: "Student Academic Success Center" },
  { acronym: "SAAC", full_name: "Student Athletic Academic Center" },
  { acronym: "SHC", full_name: "Student Health Center" },
  { acronym: "TAM", full_name: "Tamiami Hall" },
  { acronym: "PG6T", full_name: "Tech Station" },
  { acronym: "UA", full_name: "University Apartments" },
  { acronym: "UT", full_name: "University Towers" },
  { acronym: "VH", full_name: "Viertes Haus" },
  { acronym: "W10B", full_name: "W10B-Support" },
  { acronym: "W10C", full_name: "W10C-Support" },
  { acronym: "WFC", full_name: "Wellness & Fitness Center" },
  { acronym: "WC", full_name: "Wertheim Conservatory" },
  { acronym: "W01", full_name: "West 1 - Sculpture + Art Foundation" },
  { acronym: "W10", full_name: "West 10 - Drawing + MFA Studios" },
  { acronym: "W02", full_name: "West 2" },
  { acronym: "W03", full_name: "West 3" },
  { acronym: "W05", full_name: "West 5" },
  { acronym: "W06", full_name: "West 6" },
  { acronym: "W07", full_name: "West 7" },
  { acronym: "W09", full_name: "West 9" },
  { acronym: "WSTC", full_name: "Women's Softball & Tennis Center" },
];

// Create quick lookup maps
let acronymMap = {};
let nameMap = {};

for (let b of exampleBuildings) {
  acronymMap[b.acronym.toLowerCase()] = b;
  nameMap[b.full_name.toLowerCase()] = b;
}

const normalizeSearchQuery = (query: string) => {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "");
};

// Home Screen Component
export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [loading, setLoading] = useState(null);

  // Get the view store
  const { lotScoutViewStore } = useRootStore();
  const {
    buildings,
    fetchBuildings
  } = lotScoutViewStore;

  const searchBuilding = () => {
    if (!searchQuery) {
      setSearchResult([]);
      return;
    }
    let q = normalizeSearchQuery(searchQuery);
    // Exact acronym match
    let result = [];
    if (acronymMap[q]) result = [acronymMap[q]];
    // Exact full name match
    else if (nameMap[q]) result = [nameMap[q]];
    // Partial match (full name contains query)
    else {
      let partialMatches = buildings.filter((b) =>
        b.full_name.toLowerCase().includes(q)
      );
      result = partialMatches;
    }
    console.log(result);
    setSearchResult(result);
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

      navigation.navigate("Garages", {
        garages: response.data.garages,
        recommended: response.data.recommended,
        building: selectedBuilding,
      });
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
              : exampleBuildings.map((building, idx) => (
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
}
