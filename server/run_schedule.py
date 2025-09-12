import schedule
import time
from update_parking import get_parking_data

print("Starting the parking data scheduler...")
print("Fetching parking data every 5 minutes...")

schedule.every(5).minutes.do(get_parking_data)

print("Running initial update")
get_parking_data()

while True:
    schedule.run_pending()
    time.sleep(60)