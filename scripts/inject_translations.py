# -*- coding: utf-8 -*-
import json
import re

print("Starting clean injection of translations into script.js...")

with open('scripts/build_full_i18n.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract CITY_COMMON_TRANSLATIONS dictionary using python exec in a safe scope
scope = {}
# Grab only up to 'print(f"Total keys prepared'
end_marker = 'print(f"Total keys prepared'
idx = text.find(end_marker)
if idx != -1:
    exec_code = text[:idx]
    exec(exec_code, scope)
    dict_to_inject = scope.get('CITY_COMMON_TRANSLATIONS', {})
    print(f"Loaded {len(dict_to_inject)} translations from CITY_COMMON_TRANSLATIONS.")
else:
    print("Could not find end marker in build_full_i18n.py!")
    exit(1)

with open('script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

marker = 'const translations = {'
pos = script_content.find(marker)
if pos == -1:
    print("Could not find marker 'const translations = {' in script.js!")
    exit(1)

insert_pos = pos + len(marker)
js_entries = []

for k, v in dict_to_inject.items():
    # Only inject if key doesn't already exist
    pattern = rf'\b{k}\s*:'
    if not re.search(pattern, script_content):
        fr_val = json.dumps(v["fr"], ensure_ascii=False)
        en_val = json.dumps(v["en"], ensure_ascii=False)
        ar_val = json.dumps(v["ar"], ensure_ascii=False)
        entry = f"\n    {k}: {{\n        fr: {fr_val},\n        en: {en_val},\n        ar: {ar_val}\n    }},"
        js_entries.append(entry)

if js_entries:
    script_content = script_content[:insert_pos] + ''.join(js_entries) + script_content[insert_pos:]
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(script_content)
    print(f"Successfully injected {len(js_entries)} keys into script.js!")
else:
    print("All keys already present in script.js.")
