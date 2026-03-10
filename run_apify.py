import requests
import json
import time
import sys
import os

API_TOKEN = os.getenv("APIFY_API_TOKEN")
ACTOR_ID = "poidata~google-maps-email-extractor"

if not API_TOKEN:
    print("Missing APIFY_API_TOKEN environment variable")
    sys.exit(1)

print(f"Starting Apify Actor {ACTOR_ID}...")

# 1. Start the run
run_url = f"https://api.apify.com/v2/acts/{ACTOR_ID}/runs?token={API_TOKEN}"
payload = {
    "term": [
        "biuro"
    ],  # The actor requires a concise term. "biuro" is 5 chars. Wait, biuro rachunkowe is 16. That's fine.
    "location": "Poznan, Polska",
    "total": 50,  # Max out the $0.50 budget (50 * $0.01 = $0.50)
    "has_email": False,
    "language": "en",
}
payload["term"] = ["księgowość"]
print("Input:", json.dumps(payload))

response = requests.post(run_url, json=payload)
if response.status_code != 201:
    print("Failed to start run:", response.text)
    sys.exit(1)

run_data = response.json()
run_id = run_data["data"]["id"]
dataset_id = run_data["data"]["defaultDatasetId"]
print(f"Run started. Run ID: {run_id}. Dataset ID: {dataset_id}")

# 2. Wait for it to finish
status_url = f"https://api.apify.com/v2/actor-runs/{run_id}?token={API_TOKEN}"
while True:
    res = requests.get(status_url).json()
    status = res["data"]["status"]
    print(f"Status: {status}")
    if status in ["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"]:
        if status != "SUCCEEDED":
            print(f"Run failed with status {status}")
            sys.exit(1)
        break
    time.sleep(5)

# 3. Get results
print("Fetching results...")
dataset_url = (
    f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={API_TOKEN}&format=csv"
)
os.makedirs("poznan", exist_ok=True)
csv_res = requests.get(dataset_url)
with open("poznan/leady_ksiegowosc.csv", "wb") as f:
    f.write(csv_res.content)

print(
    f"Results saved to poznan/leady_ksiegowosc.csv (Size: {len(csv_res.content)} bytes)."
)
