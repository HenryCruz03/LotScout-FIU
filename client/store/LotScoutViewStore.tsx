import { makeAutoObservable, action, runInAction } from "mobx";
import { createClient,SupabaseClient } from "@supabase/supabase-js";


// interfaces should have the same properties from the documents in the database
interface buidlings {
  acronym: string;
  full_name: string;
  imageId: string;
}

interface parking_garages {
  acronym: string;
  full_name: string;
  imageId: string;
}

export class LoutScoutViewStore {
  // class attributes
  buildings: buidlings[] = [];
  garages: parking_garages[] = [];
  private supabase: SupabaseClient;

  constructor() {
     // You need to initialize the client here!
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
    this.supabase = createClient(supabaseUrl, supabaseKey); 
    makeAutoObservable(this);
  }

  // methods
  setBuildings = action((buildings: buidlings[]) => {
    this.buildings = buildings;
  });

  setGarages = action((garages: parking_garages[]) => {
    this.garages = garages;
  });

  fetchBuildings= async() => {
    try{

     
    const { data, error } = await this.supabase.from("buildings").select("*");
    if (error) throw error;
    
    runInAction(() => {
      this.buildings = data || [];
    });
  } catch (error) {
   
    runInAction(() => {
      this.buildings = [];
      console.log(this.buildings)
    });
  }
  };

 fetchGarages = async () => {
    try {
      console.log("fetching garages ")
      const { data, error } = await this.supabase.from("parking_garages").select("*");
      if (error) throw error;
      runInAction(() => {
        this.garages = data || [];
      });
    } catch (error) {
      runInAction(() => {
        this.garages = [];
            console.log(this.garages)

      });
    }
  };

}