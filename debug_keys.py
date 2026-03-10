import csv

k = set()
for f in ['poznan/leady.csv', 'poznan/leady_uslugi_ksiegowe.csv']:
    with open(f, 'r', encoding='utf-8') as file:
        r = csv.DictReader(file)
        c = 0
        for row in r:
            key = row.get('placeId')
            if not key: key = row.get('url')
            if not key: key = row.get('name')
            k.add(key)
            c += 1
        print(f"File {f} had {c} rows.")

print("Total unique keys:", len(k))
print("Some keys:", list(k)[:10])
