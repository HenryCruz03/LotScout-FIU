import schedule
import time
from update_parking import run


schedule.every(5).minutes.do(run)

while True:
    schedule.run_pending()
    time.sleep(1)