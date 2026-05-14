import re

input_path = r'C:\Users\celen\Desktop\REMAX\veriler\opus_bionic_reading.md'
output_path = r'C:\Users\celen\Desktop\REMAX\veriler\opus_bionic_reading.html'

with open(input_path, 'r', encoding='utf-8') as f:
    raw = f.read()

def md_bold(line):
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', line)

cards = []
current_card = None
lines = raw.split('\n')

for line in lines:
    s = line.strip()
    if s.startswith('### **KART'):
        if current_card:
            cards.append(current_card)
        title = re.sub(r'\*\*', '', s.replace('### ', ''))
        current_card = {'title': title, 'kanca': '', 'metin': ''}
    elif s.startswith('**Kanca:**') and current_card:
        text = s.replace('**Kanca:**', '').strip().strip('"')
        current_card['kanca'] = md_bold(text)
    elif s.startswith('"') and current_card and not current_card['metin']:
        current_card['metin'] = md_bold(s.strip('"'))

if current_card:
    cards.append(current_card)

card_html = ''
for i, c in enumerate(cards):
    n = i + 1
    card_html += (
        f'<div class="card" id="kart{n}">'
        f'<div class="card-header">'
        f'<span class="card-num">KART {n}</span>'
        f'<h2>{c["title"]}</h2>'
        f'</div>'
        f'<div class="kanca">'
        f'<span class="kanca-label">KANCA</span>'
        f'<p>"{c["kanca"]}"</p>'
        f'</div>'
        f'<div class="metin">'
        f'<span class="metin-label">KONUSMA METNI</span>'
        f'<p>"{c["metin"]}"</p>'
        f'</div>'
        f'</div>\n'
    )

nav_links = ''.join([f'<a href="#kart{i+1}">K{i+1}</a>' for i in range(len(cards))])

html = """<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Diamond Standard Opus Metinleri</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Inter', sans-serif;
  background: #0a0a0f;
  color: #e8e8f0;
  font-size: 19px;
  line-height: 1.85;
  padding: 16px;
}
h1 {
  text-align: center;
  font-size: 1.1rem;
  color: #a78bfa;
  margin: 16px 0 24px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.card {
  background: #13131e;
  border: 1px solid #2a2a40;
  border-radius: 16px;
  padding: 20px 18px;
  margin-bottom: 24px;
}
.card-header {
  margin-bottom: 14px;
  border-bottom: 1px solid #2a2a40;
  padding-bottom: 10px;
}
.card-num {
  font-size: 0.7rem;
  color: #a78bfa;
  font-weight: 800;
  letter-spacing: 3px;
}
h2 {
  font-size: 1rem;
  color: #fff;
  font-weight: 700;
  margin-top: 4px;
}
.kanca {
  background: #1a1a2e;
  border-left: 3px solid #a78bfa;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 14px;
}
.metin {
  background: #0f1a12;
  border-left: 3px solid #34d399;
  border-radius: 8px;
  padding: 14px 16px;
}
.kanca-label, .metin-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 8px;
  color: #666;
}
.kanca p { color: #c4b5fd; font-style: italic; }
.metin p { color: #d1fae5; font-size: 1.05rem; }
strong { font-weight: 800; }
.kanca p strong { color: #fff; }
.metin p strong { color: #6ee7b7; }
.nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: #0d0d18;
  border-top: 1px solid #2a2a40;
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 8px 10px;
  flex-wrap: wrap;
}
.nav a {
  color: #a78bfa;
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 10px;
  border: 1px solid #2a2a40;
  border-radius: 20px;
}
.main { padding-bottom: 70px; }
</style>
</head>
<body>
<div class="main">
<h1>Diamond Standard — Opus Kayit Metinleri</h1>
""" + card_html + """
</div>
<nav class="nav">
""" + nav_links + """
</nav>
</body>
</html>"""

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'Tamamlandi: {output_path}')
print(f'Kart sayisi: {len(cards)}')
