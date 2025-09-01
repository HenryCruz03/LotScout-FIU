from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="LotScout API", description="API for FIU parking garage information")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your React Native app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase (you'll need to add your service account key)
# cred = credentials.Certificate("path/to/serviceAccountKey.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# Pydantic models
class Garage(BaseModel):
    id: str
    name: str
    location: dict
    capacity: int
    current_occupancy: int
    hourly_rate: float
    is_open: bool

class ParkingRequest(BaseModel):
    building: str
    user_location: Optional[dict] = None

# Sample garage data (replace with webscraped data)
sample_garages = [
    {
        "id": "1",
        "name": "PG1 - Panther Garage",
        "location": {"lat": 25.7569, "lng": -80.3741},
        "capacity": 1000,
        "current_occupancy": 750,
        "hourly_rate": 2.00,
        "is_open": True
    },
    {
        "id": "2", 
        "name": "PG2 - Panther Garage",
        "location": {"lat": 25.7570, "lng": -80.3742},
        "capacity": 800,
        "current_occupancy": 600,
        "hourly_rate": 2.00,
        "is_open": True
    }
]

@app.get("/")
async def root():
    return {"message": "LotScout API is running!"}

@app.get("/garages", response_model=List[Garage])
async def get_garages():
    """Get all available parking garages"""
    return sample_garages

@app.post("/find-parking")
async def find_parking(request: ParkingRequest):
    """Find parking near a specific building"""
    # This would integrate with your webscraper and location logic
    building = request.building.lower()
    
    # Simple logic - in production, you'd use actual building coordinates
    if "gc" in building or "graham" in building:
        return {
            "message": f"Found parking near {request.building}",
            "garages": [garage for garage in sample_garages if garage["is_open"]],
            "recommended": sample_garages[0]
        }
    
    return {
        "message": f"Found parking near {request.building}",
        "garages": [garage for garage in sample_garages if garage["is_open"]],
        "recommended": sample_garages[1]
    }

@app.get("/garage/{garage_id}")
async def get_garage(garage_id: str):
    """Get specific garage information"""
    for garage in sample_garages:
        if garage["id"] == garage_id:
            return garage
    raise HTTPException(status_code=404, detail="Garage not found")

@app.get("/scrape-garages")
async def scrape_garages():
    """Webscrape current garage information from FIU website"""
    try:
        # This is a placeholder - you'll need to implement actual webscraping
        # url = "https://parking.fiu.edu/garages/"
        # response = requests.get(url)
        # soup = BeautifulSoup(response.content, 'html.parser')
        
        return {
            "message": "Garage inforx`mation updated",
            "garages_scraped": len(sample_garages)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 