import { makeAutoObservable, action, runInAction } from "mobx";

// interfaces should have the same properties from the documents in the database
interface Building {
  acronym: string;
  full_name: string;
  imageId: string;
}

interface ParkingGarage {
  acronym: string;
  full_name: string;
  imageId: string;
}

export class LoutScoutViewStore {
  // class attributes
  buildings: Building[] = [];
  garages: ParkingGarage[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // methods
  setBuildings = action((buildings: Building[]) => {
    this.buildings = buildings;
  });

  setGarages = action((garages: ParkingGarage[]) => {
    this.garages = garages;
  });

  fetchBuildings = action(() => {
    //call database to fetch buildings
    // update state
    // this.buildings = buildings
  });

}