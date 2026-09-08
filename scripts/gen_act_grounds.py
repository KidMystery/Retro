import json, urllib.request, re, base64, pathlib, sys

env = pathlib.Path(r'C:/Users/kda11/AppData/Local/hermes/.env').read_text()
KEY = re.search(r'OPENROUTER_API_KEY=(\S+)', env).group(1)

OUT = pathlib.Path('src/assets/textures')
themes = {
    'act2_ground': 'A seamless tileable 256x256 pixel-art texture of a decayed abandoned market-hall floor: cracked and stained flagstones with rotted wooden plank sections and scattered broken coins, muted mossy green-gray palette, rot stains, 16-bit SNES RPG top-down overworld ground tile, crisp pixels, no text, no characters',
    'act3_ground': 'A seamless tileable 256x256 pixel-art texture of an open sunlit plaza: warm sandy limestone paving tiles in a regular grid with bright light patches and small paving cracks, warm tan and pale gold palette, 16-bit SNES RPG top-down overworld ground tile, crisp pixels, no text, no characters',
    'act4_ground': 'A seamless tileable 256x256 pixel-art texture of a dark vault floor: cold blue-gray cut stone blocks with iron inlay seams and faint engraved sigils, dim torch-lit highlights, deep shadows, 16-bit SNES RPG top-down overworld ground tile, crisp pixels, no text, no readable letters',
    'act5_ground': 'A seamless tileable 256x256 pixel-art texture of an obsidian gauntlet floor: glossy black volcanic glass tiles with sharp angular purple-red fracture glints and glowing ember cracks, near-black palette with magenta ember accents, 16-bit SNES RPG top-down overworld ground tile, crisp pixels, no text, no characters',
}

results = {}
for name, prompt in themes.items():
    req = urllib.request.Request(
        'https://openrouter.ai/api/v1/chat/completions',
        data=json.dumps({
            'model': 'google/gemini-2.5-flash-image',
            'modalities': ['image', 'text'],
            'messages': [{'role': 'user', 'content': prompt}],
        }).encode(),
        headers={'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json'},
    )
    r = json.loads(urllib.request.urlopen(req, timeout=240).read())
    url = r['choices'][0]['message']['images'][0]['image_url']['url']
    raw = base64.b64decode(url.split(',', 1)[1])
    (OUT / f'{name}_raw.png').write_bytes(raw)
    results[name] = r.get('usage', {}).get('cost')
    print(name, 'cost', results[name])

print('TOTAL', sum(v or 0 for v in results.values()))
json.dump(results, open('tmp_art/act_costs.json', 'w'))
