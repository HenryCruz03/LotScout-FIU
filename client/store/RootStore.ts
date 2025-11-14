import { LoutScoutViewStore } from "./LotScoutViewStore";


export class StoreRegistry {
  private static instance: StoreRegistry;
  private stores: Map<string, any> = new Map();
  private constructor() {}
  static getInstance(): StoreRegistry {
    if (!StoreRegistry.instance) {
      StoreRegistry.instance = new StoreRegistry();
    }
    return StoreRegistry.instance;
  }
  register(name: string, store: any): void {
    this.stores.set(name, store);
  }
  get<T>(name: string): T {
    return this.stores.get(name) as T;
  }
}

export class RootStore {
  lotScoutViewStore: LoutScoutViewStore;

  constructor() {
    this.lotScoutViewStore = new LoutScoutViewStore();
    const registry = StoreRegistry.getInstance();

    registry.register("lotScoutViewStore", this.lotScoutViewStore);
    registry.register("rootStore", this);
  }
}