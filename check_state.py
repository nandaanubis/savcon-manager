import json
import urllib.request

B = 'http://172.20.20.43:8111'

def c(p, m='GET', d=None, t=None):
    h = {'Content-Type':'application/json'}
    if t: h['Authorization'] = 'Bearer '+t
    req = urllib.request.Request(B+p, data=json.dumps(d).encode() if d else None, headers=h, method=m)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode())

t = c('/api/auth/login','POST',{'username':'admin','password':'admin123'})['token']
print('DEVICES:', [(d['id'], d['name'], d['host']) for d in c('/api/devices', t=t)])
print('BACKUPS:', len(c('/api/backups', t=t)))
print('GROUPS:', [(g['id'], g['name']) for g in c('/api/groups', t=t)])
print('USERS:', [(u['id'], u['username']) for u in c('/api/users', t=t)])
s = c('/api/settings', t=t)
print('BACKGROUND:', s.get('login_background'))
print('OPACITY:', s.get('login_opacity'))
