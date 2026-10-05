# Website Factory logo, built from the Utopia Brand CI and drawn like the Utopia
# product logos (autopayroll, slipmatch): two weights of Plus Jakarta Sans.
# "website" small and ExtraLight, set flush right above a large ExtraBold
# "factory" whose o is a gear the size of that o, a red triangle in its counter.
#   cd scripts/agent-monitor/logo
#   curl -fsSL -o jakarta.ttf "https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
#   python3 build.py        # needs fontTools; writes ../public/brand/logo-*.svg
import math
from wordmark import outline, glyph_box

OUT = '../public/brand'
INK = {'light': '#17181C', 'dark': '#F4F4F2'}
THIN = {'light': '#7A7D82', 'dark': '#B5B7BC'}   # CI Concrete / Ash
GEAR = {'light': '#2774AE', 'dark': '#4A9DD0'}   # Utopia Blue; Blue Light reads better on Obsidian
RED = '#D72638'                                  # Utopia Red
SIZE = 64
TRACK = -0.02


def gear(cx, cy, r_body, teeth=8):
    """Gear that fits the o's box: tooth tips on the o's edge, a heavy ring
    to match ExtraBold, and a round counter (even-odd), as SVG path data."""
    r_tip = r_body * 1.04
    r_root = r_tip * 0.84
    pts = []
    step = 2 * math.pi / teeth
    for i in range(teeth):
        a = i * step - math.pi / 2
        for ang, r in ((a - step * 0.27, r_root), (a - step * 0.16, r_tip), (a + step * 0.16, r_tip), (a + step * 0.27, r_root)):
            pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    d = 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in pts) + ' Z'
    r_hole = r_tip * 0.47
    d += f' M{cx + r_hole:.2f} {cy:.2f} A{r_hole:.2f} {r_hole:.2f} 0 1 0 {cx - r_hole:.2f} {cy:.2f} A{r_hole:.2f} {r_hole:.2f} 0 1 0 {cx + r_hole:.2f} {cy:.2f} Z'
    return d, r_hole


def triangle(cx, cy, r):
    # equilateral, centred on the counter's optical centre, with a ring of
    # clear space between it and the gear
    h = r * 0.82
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
GAP = SIZE * 0.08            # between website's baseline and factory's top
PAD = 3

oxmin, oymin, oxmax, oymax, oadv = glyph_box('o')
f_top = glyph_box('f')[3] * SIZE                 # tallest letter in factory
y_rsb = (glyph_box('y')[4] - glyph_box('y')[2]) * SIZE
e_rsb = (glyph_box('e', 200)[4] - glyph_box('e', 200)[2]) * SMALL
w_top = max(glyph_box(c, 200)[3] for c in 'websit') * SMALL
y_bottom = -glyph_box('y')[1] * SIZE

small_base = PAD + w_top
base = small_base + GAP + f_top
for theme in ('light', 'dark'):
    d1, x = outline('fact', SIZE, x0=PAD, base=base, track=TRACK)
    x += TRACK * SIZE
    # the gear takes the o's slot exactly: same centre, same width
    r_body = (oymax - oymin) / 2 * SIZE
    cx = x + (oxmin + oxmax) / 2 * SIZE
    cy = base - (oymin + oymax) / 2 * SIZE
    g = gear_mark(cx, cy, r_body, theme)
    d2, end = outline('ry', SIZE, x0=x + oadv * SIZE + TRACK * SIZE, base=base, track=TRACK)
    right = end - y_rsb                          # ink edge of the y
    # set "website" once to measure it, then again flush with that edge
    _, w_end = outline('website', SMALL, x0=0, base=small_base, track=SMALL_TRACK, weight=200)
    d3, _ = outline('website', SMALL, x0=right - (w_end - e_rsb), base=small_base, track=SMALL_TRACK, weight=200)
    w, h = right + PAD, base + y_bottom + PAD
    body = f'<path d="{d3}" fill="{THIN[theme]}"/><path d="{d1} {d2}" fill="{INK[theme]}"/>' + g
    open(f'{OUT}/logo-lockup-{theme}.svg', 'w').write(svg(w, h, body))
    open(f'{OUT}/logo-mark-{theme}.svg', 'w').write(svg(64, 64, gear_mark(32, 32, 29, theme)))
print('ok')
