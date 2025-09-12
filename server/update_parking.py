import requests
from datetime import datetime
from bs4 import BeautifulSoup
from  services.supabase import supabase

def get_parking_data():
    location_lookup= {
        "PG1: Gold Parking Garage": (25.754583796141546, -80.37218471436944),
        "PG2: Blue Parking Garage": (25.75423394600492, -80.37237634252237),
        "PG3: Panther Parking Garage":(25.758865523845564, -80.3797709571502),
        "PG4: Red Parking Garage":(25.760251692129792, -80.37318096140726),
        "PG5: Market Station":(25.760364737503448, -80.37107850986386),
        "PG6: Tech Building":(25.760294084156044, -80.37460874566301),
        "Lot 3":(25.755202221297864, -80.37057324756857),
        "Lot 5":(25.752790232472076, -80.37089269984861),
        "Lot 7":(25.752923404867392, -80.38047511424715),
        "Lot 9":(25.758932468756335, -80.37821191491454)
    }
    url ="https://operations.fiu.edu/parking/space-availability/"

    resp=requests.get(url,timeout=10)
    if resp.status_code != 200:
        print("Error fetching the page:", resp.status_code)
        return
    
    soup= BeautifulSoup(resp.text,'html.parser')
    widget= soup.find("div",id="parking-widget")
    if not widget:
        print("Error: Parking widget not found on the page.")
        return
    items= widget.select("ul.parking-widget-data li[data-label]")
    print(f"found {len(items)} rows to process")
    
    for li in items:
        garage_name= li['data-label'].strip()
        student_spaces= None
        for block in li.select("div.donut-content"):
            num_text=block.find("strong").text.strip()
            desc=block.find("span").text.strip().lower()
            if "student" in desc:
                    if num_text.lower() in ["full","0"]:
                        student_spaces=0
                        print(f"Student spaces full in {garage_name}")
                    else:
                        try:
                                student_spaces=int(num_text)
                        except ValueError:
                                print(f"Unexpected student spaces available:'{num_text}'" )
                                student_spaces=0
            
        lat,lng= location_lookup.get(garage_name,(None,None))
        timestamp=datetime.utcnow().isoformat()
        if student_spaces is None:
            print(f"Skipping {garage_name} due to missing student spaces data")
            continue
     
        
        data= {
        "garage_name": garage_name,
        "student_spaces": student_spaces,
        "location_lat": lat,
        "location_lng":lng,
        "updated_at": timestamp
    }
    # Insert into Supabase table
        try:    
            supabase.table("parking_garages").upsert(data,on_conflict=["garage_name"]).execute()
            if student_spaces ==0:
                print(f"{timestamp}: {garage_name} - Student Spaces Full")
            else:
             print(f"{timestamp}: {garage_name} - {student_spaces} Student Spaces Available")
        except Exception as e:
            print(f"Error inserting data for {garage_name}: {e}")
            
if __name__ == "__main__":
    get_parking_data()
