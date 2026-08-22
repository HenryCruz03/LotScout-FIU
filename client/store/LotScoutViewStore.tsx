import { makeAutoObservable, action, runInAction } from "mobx";
import { createClient,SupabaseClient } from "@supabase/supabase-js";


// interfaces should have the same properties from the documents in the database
interface Buildings {
  acronym: string;
  full_name: string;
  imageId: string;
  latitude: number;
  longitude: number;
}

interface parking_garages {
  acronym: string;
  full_name: string;
  imageId: string;
  student_spaces: number;
  location_lat: number;
  location_lng: number;
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 3959; // Earth's radius in MILES (instead of 6371 km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in MILES
}

export class LoutScoutViewStore {
  // class attributes
  buildings: Buildings[] = [];
  garages: parking_garages[] = [];
  selectedBuilding: Buildings | null = null;
  private supabase: SupabaseClient;

  constructor() {
     // You need to initialize the client here!
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_KEY;
    this.supabase = createClient(supabaseUrl, supabaseKey); 
    makeAutoObservable(this);
  }

  // methods
   setSelectedBuilding = (building: Buildings|null) => {
    this.selectedBuilding = building;
  };
 
  setBuildings = action((buildings: Buildings[]) => {
    this.buildings = buildings;
  });

  setGarages = action((garages: parking_garages[]) => {
    this.garages = garages;
  });

  fetchBuildings = action(async() => {
    try{
      const { data, error } = await this.supabase.from("buildings").select("*").order("acronym",{ ascending: true});
      if (error) throw error;
      this.buildings = data || [];
      console.log(this.buildings);
    } catch (error) {
      this.buildings = [];
    }
  });

  fetchGarages = action(async() => {
    try {
      console.log("fetching garages ")
      const { data, error } = await this.supabase.from("parking_garages").select("*").order("acronym",{ ascending: true});
      if (error) throw error;
      this.garages = data || [];
      console.log("garages")
      console.log("garages: ", this.garages)
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.garages = [];
      });
    }
  });

get garagesWithDistances() {
    if (!this.selectedBuilding) return [];
    console.log(this.selectedBuilding.full_name)
    console.log("calculating garages distances")
    return this.garages.map((garage) => ({
      ...garage,
      distance: haversineDistance(
        this.selectedBuilding.latitude,
        this.selectedBuilding.longitude,
        garage.location_lat,
        garage.location_lng
      ),
    }));
  }

  get closestGarage() {
    if (this.garagesWithDistances.length === 0) return null;
    return this.garagesWithDistances.reduce((closest, current) =>
      current.distance < closest.distance ? current : closest
    );
  }

  get garageWithMostSpace() {
    if (this.garages.length === 0) return null;
    return this.garages.reduce((mostSpace, current) =>
      current.student_spaces > mostSpace.student_spaces
        ? current
        : mostSpace
    );
  }

    get recommendedGarage() {
    if (this.garagesWithDistances.length === 0) return null;
    const garagesWithSpace = this.garagesWithDistances.filter(
      (g) => g.student_spaces > 0
    );
      if (garagesWithSpace.length === 0) return null;
    return garagesWithSpace.reduce((closest, current) =>
      current.distance < closest.distance ? current : closest
    );
  }
 get garagesSortedByDistance() {
    return [...this.garagesWithDistances].sort((a, b) => a.distance - b.distance);
  }
 get garagesSortedBySpace() {
    return [...this.garages].sort(
      (a, b) => b.student_spaces - a.student_spaces
    );
  }
};