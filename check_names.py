import csv

for f in ['poznan/leady.csv', 'poznan/leady_uslugi_ksiegowe.csv']:
    try:
        with open(f, 'r', encoding='utf-8-sig') as f_in:
            reader = csv.DictReader(f_in)
            names = [r.get('name') for r in reader]
            print(f"File {f}: {len(names)} rows, {len(set(names))} unique names")
            if len(names) > 0 and len(set(names)) < 11:
                print("Names are:", set(names))
    except Exception as e:
        print("Error reading", f, e)
