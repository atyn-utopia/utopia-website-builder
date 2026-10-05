# Website Factory logo, built from the Utopia Brand CI and drawn like the Utopia
# product logos (autopayroll, slipmatch): two weights of Plus Jakarta Sans.
# "website" small and Light, set flush right above a large ExtraBold
# "factory" whose o is a gear the size of that o, a red triangle in its counter.
#   cd scripts/agent-monitor/logo
#   curl -fsSL -o jakarta.ttf "https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
#   python3 build.py        # needs fontTools; writes ../public/brand/logo-*.svg
import math
from wordmark import outline, glyph_box

OUT = '../public/brand'
INK = {'light': '#17181C', 'dark': '#F4F4F2'}
THIN = {'light': '#4A4D53', 'dark': '#D6D7DA'}   # between Slate and Concrete / Ash and Paper: light weight needs the extra contrast
GEAR = {'light': '#2774AE', 'dark': '#4A9DD0'}   # Utopia Blue; Blue Light reads better on Obsidian
RED = '#D72638'                                  # Utopia Red
SIZE = 64
TRACK = -0.02


def gear(cx, cy, r_body, teeth=8):
    """Gear that fits the o's box: tooth tips on the o's edge, a ring a little
    lighter than the ExtraBold strokes, and a round counter (even-odd), as SVG path data."""
    r_tip = r_body * 1.04
    r_root = r_tip * 0.86
    pts = []
    step = 2 * math.pi / teeth
    for i in range(teeth):
        a = i * step - math.pi / 2
        for ang, r in ((a - step * 0.24, r_root), (a - step * 0.14, r_tip), (a + step * 0.14, r_tip), (a + step * 0.24, r_root)):
            pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    d = 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in pts) + ' Z'
    r_hole = r_tip * 0.58
    d += f' M{cx + r_hole:.2f} {cy:.2f} A{r_hole:.2f} {r_hole:.2f} 0 1 0 {cx - r_hole:.2f} {cy:.2f} A{r_hole:.2f} {r_hole:.2f} 0 1 0 {cx + r_hole:.2f} {cy:.2f} Z'
    return d, r_hole


def triangle(cx, cy, r):
    # equilateral, centred on the counter's optical centre, with a ring of
    # clear space between it and the gear
    h = r * 0.95
    w = h * 1.15
    top = cy - h * 0.58
    return f'<polygon points="{cx:.2f},{top:.2f} {cx + w / 2:.2f},{top + h:.2f} {cx - w / 2:.2f},{top + h:.2f}" fill="{RED}"/>'


def gear_mark(cx, cy, r_body, theme):
    d, r_hole = gear(cx, cy, r_body)
    return f'<path d="{d}" fill="{GEAR[theme]}" fill-rule="evenodd"/>' + triangle(cx, cy, r_hole)


def svg(w, h, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:.0f}" height="{h:.0f}" viewBox="0 0 {w:.1f} {h:.1f}">{body}</svg>\n'


SMALL = SIZE * 0.36          # "website" size, as in the round-2 drafts
SMALL_TRACK = 0.005
THIN_WEIGHT = 300           # Light; ExtraLight (200) disappeared at header size
GAP = SIZE * 0.05 + 1.5      # clear space between "website" and the letters right under it (+1px at header size)
PAD = 3

oxmin, oymin, oxmax, oymax, oadv = glyph_box('o')
y_rsb = (glyph_box('y')[4] - glyph_box('y')[2]) * SIZE
e_rsb = (glyph_box('e', THIN_WEIGHT)[4] - glyph_box('e', THIN_WEIGHT)[2]) * SMALL
w_top = max(glyph_box(c, THIN_WEIGHT)[3] for c in 'websit') * SMALL
y_bottom = -glyph_box('y')[1] * SIZE
r_body = (oymax - oymin) / 2 * SIZE
gear_top = (oymin + oymax) / 2 * SIZE + r_body * 1.04   # tooth tips stand just above the o


def factory_layout(x0):
    """x positions and heights (above baseline) of each piece of "factory"."""
    pieces, x = [], x0
    for ch in 'factory':
        xmin, _, xmax, ymax, adv = glyph_box(ch)
        top = gear_top if ch == 'o' else ymax * SIZE
        pieces.append((ch, x, x + xmin * SIZE, x + xmax * SIZE, top))
        x += adv * SIZE + TRACK * SIZE
    return pieces, x - TRACK * SIZE


pieces, end = factory_layout(PAD)
right = end - y_rsb                                      # ink edge of the y
_, w_end = outline('website', SMALL, x0=0, base=0, track=SMALL_TRACK, weight=THIN_WEIGHT)
w_left = right - (w_end - e_rsb)
# "website" drops down until it just clears whatever part of factory sits under it
under = max(top for _, _, l, r, top in pieces if r > w_left - GAP)
small_base = PAD + w_top
base = small_base + GAP + under
for theme in ('light', 'dark'):
    xs = {ch: x for ch, x, *_ in pieces}
    d1, _ = outline('fact', SIZE, x0=PAD, base=base, track=TRACK)
    # the gear takes the o's slot exactly: same centre, same width
    cx = xs['o'] + (oxmin + oxmax) / 2 * SIZE
    cy = base - (oymin + oymax) / 2 * SIZE
    g = gear_mark(cx, cy, r_body, theme)
    d2, _ = outline('ry', SIZE, x0=xs['r'], base=base, track=TRACK)
    d3, _ = outline('website', SMALL, x0=w_left, base=small_base, track=SMALL_TRACK, weight=THIN_WEIGHT)
    # the f rises above "website"'s baseline, so the canvas top is whichever is higher
    top_f = base - glyph_box('f')[3] * SIZE
    lift = max(0, PAD - top_f)
    w, h = right + PAD, base + y_bottom + PAD + lift
    body = f'<g transform="translate(0 {lift:.2f})"><path d="{d3}" fill="{THIN[theme]}"/><path d="{d1} {d2}" fill="{INK[theme]}"/>{g}</g>'
    open(f'{OUT}/logo-lockup-{theme}.svg', 'w').write(svg(w, h, body))
    open(f'{OUT}/logo-mark-{theme}.svg', 'w').write(svg(64, 64, gear_mark(32, 32, 29, theme)))
# App icon for the PWA: full-bleed paper square, gear inside the maskable safe zone (centre 80%).
open(f'{OUT}/logo-app.svg', 'w').write(svg(512, 512, '<rect width="512" height="512" fill="#F4F4F2"/>' + gear_mark(256, 256, 150, 'light')))
print('ok', round(under, 1), round(w_left, 1))
