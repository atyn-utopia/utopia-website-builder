# Website Factory logo, built from the Utopia Brand CI.
#   cd scripts/agent-monitor/logo
#   curl -fsSL -o jakarta.ttf "https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
#   python3 build.py        # needs fontTools; writes ../public/brand/a-*.svg
from wordmark import outline
OUT = '../public/brand'
INK = {'light': '#17181C', 'dark': '#F4F4F2'}
BLUE = '#2774AE'
RAMP = {'light': ['#003B5C', '#1B5687', '#2774AE'], 'dark': ['#1B5687', '#2774AE', '#4A9DD0']}

def tri_after(x, base, size):
    # Same proportions as the parent's terminal triangle (21.7 wide, 17.9 tall at 64px)
    k = size / 64; gap = 6.4 * k; w = 21.7 * k; h = 17.9 * k
    x0 = x + gap
    return f'<polygon points="{x0:.1f},{base} {x0+w:.1f},{base} {x0+w/2:.1f},{base-h:.1f}" fill="{BLUE}"/>', x0 + w

def sawtooth(x, y, s, theme):
    # 64-unit mark: three sawtooth roof triangles (the CI's triangle motif) over a browser-window body
    t = lambda v: v * s
    body = INK[theme]; dot = '#F4F4F2' if theme == 'light' else '#17181C'
    roofs = ''.join(
        f'<polygon points="{x+t(4+i*18.67):.1f},{y+t(30)} {x+t(4+(i+1)*18.67):.1f},{y+t(30)} {x+t(4+(i+1)*18.67):.1f},{y+t(8)}" fill="{RAMP[theme][i]}"/>'
        for i in range(3))
    win = f'<rect x="{x+t(4):.1f}" y="{y+t(32):.1f}" width="{t(56):.1f}" height="{t(28):.1f}" rx="{t(6):.1f}" fill="{body}"/>'
    dots = ''.join(f'<circle cx="{x+t(12+i*7):.1f}" cy="{y+t(39):.1f}" r="{t(2.4):.1f}" fill="{dot}"/>' for i in range(3))
    bar = f'<rect x="{x+t(10):.1f}" y="{y+t(47):.1f}" width="{t(30):.1f}" height="{t(5):.1f}" rx="{t(2.5):.1f}" fill="{BLUE}"/>'
    return roofs + win + dots + bar

def svg(w, h, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:.0f}" height="{h:.0f}" viewBox="0 0 {w:.1f} {h:.1f}">{body}</svg>\n'

for theme in ('light', 'dark'):
    ink = INK[theme]
    d, w = outline('website factory', 64, x0=92, base=64)
    open(f'{OUT}/a-lockup-{theme}.svg', 'w').write(svg(92 + w + 4, 84, sawtooth(0, 4, 1.25, theme) + f'<path d="{d}" fill="{ink}"/>'))
    open(f'{OUT}/a-mark-{theme}.svg', 'w').write(svg(64, 64, sawtooth(0, 0, 1, theme)))
