import json, urllib.request, re, sys, pathlib

env = pathlib.Path(r'C:/Users/kda11/AppData/Local/hermes/.env').read_text()
m = re.search(r'OPENROUTER_API_KEY=(\S+)', env)
key = m.group(1)
model = sys.argv[1]
prompt = sys.argv[2]

req = urllib.request.Request(
    'https://openrouter.ai/api/v1/chat/completions',
    data=json.dumps({
        'model': model,
        'modalities': ['image', 'text'],
        'messages': [{'role': 'user', 'content': prompt}],
    }).encode(),
    headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
)
try:
    r = json.loads(urllib.request.urlopen(req, timeout=180).read())
except urllib.error.HTTPError as e:
    print('HTTP ERROR', e.code, e.read().decode()[:2000]); sys.exit(1)

usage = r.get('usage', {})
imgs = []
msg = r['choices'][0]['message']
for part in (msg.get('images') or []):
    url = part.get('image_url', {}).get('url', '')
    if url.startswith('data:'):
        imgs.append(('dataurl', url, len(url)))
    else:
        imgs.append(('url', url, 0))
print(json.dumps({'usage': usage, 'provider': r.get('provider'), 'n_images': len(imgs), 'img_info': [(k, s) for k, _, s in imgs], 'text': (msg.get('content') or '')[:300]}, indent=2))
# save image
for i, (kind, raw, size) in enumerate(imgs):
    out = pathlib.Path(sys.argv[3]) / f'{sys.argv[1].split("/")[-1].replace(".", "_")}_{i}.png'
    if kind == 'dataurl':
        out.write_bytes(__import__('base64').b64decode(raw.split(',', 1)[1]))
    else:
        out.write_bytes(urllib.request.urlopen(raw, timeout=60).read())
    print('saved', out)
