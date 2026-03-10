import csv

total = 0
with_email = 0

try:
    with open('poznan/leady_unikalne.csv', 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            # Sprawdzamy wszystkie kolumny, które mogą zawierać maila
            # (Aktor rozbija je na website_emails/0, uncertain_emails/0 itp.)
            found = False
            for key, value in row.items():
                if 'email' in key.lower() and value and '@' in value:
                    found = True
                    break
            if found:
                with_email += 1

    print(f"RESULT:Total={total},WithEmail={with_email}")
except Exception as e:
    print(f"ERROR: {e}")
