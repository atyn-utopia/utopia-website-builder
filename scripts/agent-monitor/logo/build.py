# Website Factory logo, built from the Utopia Brand CI: "website factory" in
# Plus Jakarta Sans ExtraBold, with the o of factory replaced by a gear the
# size of that o, a red triangle in its counter.
#   cd scripts/agent-monitor/logo
#   curl -fsSL -o jakarta.ttf "https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
#   python3 build.py        # needs fontTools; writes ../public/brand/logo-*.svg
import math
from fontTools.pens.boundsPen import BoundsPen
from wordmark import outline, gs, cmap, upm

OUT = '../public/brand'
INK = {'light': '#17181C', 'dark': '#F4F4F2'}
GEAR = {'light': '#2774AE', 'dark': '#4A9DD0'}   # Utopia Blue; Blue Light reads better on Obsidian
RED = '#D72638'                                  # Utopia Red
SIZE = 64
TRACK = -0.02


def o_box():
    """The o's ink box and advance, in em units (y up)."""
    pen = BoundsPen(gs)
    gs[cmap[ord('o')]].draw(pen)
    xmin, ymin, xmax, ymax = pen.bounds
    return xmin / upm, ymin / upm, xmax / upm, ymax / upm, gs[cmap[ord('o')]].width / upm


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


xmin, ymin, xmax, ymax, adv = o_box()
base = 64
for theme in ('light', 'dark'):
    ink = INK[theme]
    d1, x = outline('website fact', SIZE, x0=2, base=base, track=TRACK)
    x += TRACK * SIZE
    # the gear's body is the o: same centre, same outer radius; only the teeth stick out
    # the gear takes the o's slot exactly: same centre, same width
    r_body = (ymax - ymin) / 2 * SIZE
    room = 0
    cx = x + room + (xmin + xmax) / 2 * SIZE
    cy = base - (ymin + ymax) / 2 * SIZE
    g = gear_mark(cx, cy, r_body, theme)
    d2, end = outline('ry', SIZE, x0=x + 2 * room + adv * SIZE + TRACK * SIZE, base=base, track=TRACK)
    open(f'{OUT}/logo-lockup-{theme}.svg', 'w').write(svg(end + 4, 84, f'<path d="{d1} {d2}" fill="{ink}"/>' + g))
    open(f'{OUT}/logo-mark-{theme}.svg', 'w').write(svg(64, 64, gear_mark(32, 32, 29, theme)))
print('ok')
