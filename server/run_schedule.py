import schedule
import time
from update_parking import get_parking_data


def schedule_run():
    print("Starting the parking data scheduler...")
    print("Fetching parking data every 3 minutes...")

    schedule.every(3).minutes.do(get_parking_data)

    print("Running initial update")
    get_parking_data()

    while True:
        schedule.run_pending()
        time.sleep(60)