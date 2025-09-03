from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL=os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY= os.getenv("SUPABASE_SERVICE_KEY")

print(f"URL loaded: {SUPABASE_URL is not None}")
print(f"URL loaded: {SUPABASE_SERVICE_KEY is not None}")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Missing Supabase Creditentials.")

supabase= create_client(SUPABASE_URL,SUPABASE_SERVICE_KEY)
print("Supabase initialized")