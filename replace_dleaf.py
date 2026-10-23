import os

for root_dir in ['backend', 'prisma']:
    if not os.path.exists(root_dir):
        continue
    for r, d, files in os.walk(root_dir):
        if 'node_modules' in r or '.git' in r:
            continue
        for f in files:
            if f.endswith(('.ts', '.json', '.html', '.md', '.txt')):
                p = os.path.join(r, f)
                try:
                    with open(p, 'r', encoding='utf-8') as file:
                        c = file.read()
                    nc = c.replace('DleafTech', 'Dleaf').replace('dleaftech', 'dleaf').replace('DLEAFTECH', 'DLEAF').replace('DLeafTech', 'Dleaf')
                    if nc != c:
                        with open(p, 'w', encoding='utf-8') as file:
                            file.write(nc)
                        print(f"Updated: {p}")
                except Exception as e:
                    pass

for root_file in ['server.ts', 'package.json']:
    if os.path.exists(root_file):
        with open(root_file, 'r', encoding='utf-8') as file:
            c = file.read()
        nc = c.replace('DleafTech', 'Dleaf').replace('dleaftech', 'dleaf').replace('DLEAFTECH', 'DLEAF').replace('DLeafTech', 'Dleaf')
        if nc != c:
            with open(root_file, 'w', encoding='utf-8') as file:
                file.write(nc)
            print(f"Updated: {root_file}")

print("Replacement complete.")
