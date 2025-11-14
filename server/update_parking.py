from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime
from services.supabase import supabase
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time

def get_parking_data():
    location_lookup = {
        "PG1: Gold Garage":   (25.754583796141546, -80.37218471436944),
        "PG2: Blue Garage":   (25.75423394600492,  -80.37237634252237),
        "PG3: Panther Garage":(25.758865523845564, -80.3797709571502),
        "PG4: Red Garage":    (25.760251692129792, -80.37318096140726),
        "PG5: Market Station":(25.760364737503448, -80.37107850986386),
        "PG6: Tech Station":  (25.760294084156044, -80.37460874566301),
        "Lot 1": (25.755202221297864, -80.37057324756857),
        "Lot 3": (25.758932468756335, -80.37821191491454),
        "Lot 5": (25.752790232472076, -80.37089269984887),
        "Lot 7": (25.752923404867392, -80.38047511424715),
        "Lot 9": (25.758932468756335, -80.37821191491454),
        "Lot 10": (25.7570975212894, -80.38127636614678),
    }

    chrome_opts = Options()
    chrome_opts.add_argument("--headless")
    chrome_opts.add_argument("--no-sandbox")
    chrome_opts.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_opts)

    try:
        driver.get("https://operations.fiu.edu/parking/space-availability/")
        wait = WebDriverWait(driver, 15)
        wait.until(EC.presence_of_element_located((By.ID, "parking-widget")))
        time.sleep(3)

        def scrape_section(section_id, search_keywords):
            section = driver.find_element(By.ID, section_id)
            items = section.find_elements(By.CSS_SELECTOR, "ul.parking-widget-data li[data-label]")
            
            for item in items:
                label = item.get_attribute("data-label")
                blocks = item.find_elements(By.CSS_SELECTOR, "div.donut-content")
                value = None

                for b in blocks:
                    try:
                        num_text = b.find_element(By.TAG_NAME, "strong").text.strip()
                        span = b.find_element(By.TAG_NAME, "span")
                        span_text = span.text.strip().lower() if span else ''

                        # Grab *either* garages student spaces or lots available spaces
                        if any(keyword in span_text for keyword in search_keywords) or num_text.lower() == "full":
                            value = 0 if num_text.lower() == "full" else int(num_text)
                            break

                    except Exception as e:
                        continue

                if value is None:
                    print(f"❌ {label}: could not parse a count using {search_keywords}")
                    continue

                lat, lng = location_lookup.get(label, (None, None))
                timestamp = datetime.utcnow().isoformat()

                record = {
                    "garage_name": label,
                    "student_spaces": value,
                    "location_lat": lat,
                    "location_lng": lng,
                    "updated_at": timestamp
                }

                try:
                    supabase.table("parking_garages") \
                        .upsert(record, on_conflict=["garage_name"]) \
                        .execute()
                    print(f"💾 Saved {label}: {value} spaces")
                except Exception as db_err:
                    print(f"❌ DB error for {label}: {db_err}")

        # Both garages and lots: parse for *either* "student" or "available"
        keywords = ["student", "available", "spaces"]
        print("🚗 Scraping all garages and lots using unified logic...")
        scrape_section("parking-widget", keywords)
        scrape_section("parking-lots-widget", keywords)

        print("🎉 All done!")

    finally:
        driver.quit()

if __name__ == "__main__":
    get_parking_data()