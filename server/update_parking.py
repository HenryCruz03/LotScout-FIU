import requests
from datetime import datetime
from bs4 import BeautifulSoup
from  services.supabase import supabase

def get_parking_data():
    location_lookup= {
        "PG1- Gold Parking Garage": (25.754583796141546, -80.37218471436944),
        "PG2- Blue Parking Garage": (25.75423394600492, -80.37237634252237),
        "PG3- Panther Parking Garage":(25.758865523845564, -80.3797709571502),
        "PG4- Red Parking Garage":(25.760251692129792, -80.37318096140726),
        "PG5- Market Station":(25.760364737503448, -80.37107850986386),
        "PG6- Tech Building":(25.760294084156044, -80.37460874566301),
        "Lot 3":(25.755202221297864, -80.37057324756857),
        "Lot 5":(25.752790232472076, -80.37089269984861),
        "Lot 7":(25.752923404867392, -80.38047511424715),
        "Lot 9":(25.758932468756335, -80.37821191491454)
    }
    response = requests.get("https://operations.fiu.edu/parking/space-availability/  ")
    
    if response.status_code != 200:
        print("Error fetching the page:", response.status_code)
        exit()
    soup= BeautifulSoup(response.text,'html.parser')
    rows= soup.select('tbody tr')
    
    print(f"found{len(rows)} rows to process")
    
    for row in rows:
        cols=row.find_all('td')
        if len(cols) < 4:
            continue
        
        garage_name=cols[0].text.strip()
        total_spaces =int(cols[1].text.strip())
        available_spaces = int(cols[2].text.strip())
        
        lat,lng = location_lookup.get(garage_name,(None,None))
        timestamp= datetime.utcnow().isoformat()

        
    data= {
        "garage_name": garage_name,
        "capacity": total_spaces,
        "available_spaces": available_spaces,
        "location_lat": lat,
        "location_lng":lng,
        "updated_at": timestamp
    }
    # Insert into Supabase table
    supabase.table("parking_garages").upsert(data,on_conflict=["garage_name"]).execute()
    