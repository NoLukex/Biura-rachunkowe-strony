import csv
import os

input_files = [
    "poznan/leady.csv",
    "poznan/leady_uslugi_ksiegowe.csv",
    "poznan/leady_ksiegowosc.csv"
]
output_file = "poznan/leady_unikalne.csv"

unique_leads = {}
fieldnames_set = set()

print("Rozpoczynanie łączenia i usuwania duplikatów...")

# First pass: collect all unique headers
for file in input_files:
    try:
        with open(file, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            if reader.fieldnames:
                for fn in reader.fieldnames:
                    fieldnames_set.add(fn)
    except FileNotFoundError:
        pass

fieldnames = sorted(list(fieldnames_set))

# Second pass: collect data
for file in input_files:
    try:
        print(f"Przetwarzanie pliku: {file}")
        with open(file, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # url is the most reliable unique identifier
                key = row.get('url') or row.get('cid') or row.get('name')
                if key and key not in unique_leads:
                    # fill missing keys with empty string
                    filtered_row = {k: row.get(k, '') for k in fieldnames}
                    unique_leads[key] = filtered_row
    except FileNotFoundError:
        print(f"Brak pliku: {file}")

print(f"\nZnaleziono {len(unique_leads)} unikalnych leadów po złączeniu.")

if unique_leads:
    with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(unique_leads.values())
    print(f"Pomyślnie zapisano unikalne wpisy w pliku: {output_file}")
else:
    print("Brak danych do zapisania.")
