# Outline "website factory" in Plus Jakarta Sans ExtraBold 800 → SVG path data (no font dependency, like the CI wordmark).
import sys, json
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

font = instantiateVariableFont(TTFont('jakarta.ttf'), {'wght': 800})
gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font['head'].unitsPerEm
# pair kerning from GPOS is skipped; the face is evenly spaced at display sizes
def outline(text, size, x0=0, base=0, track=-0.02):
    s = size / upm; x = x0; paths = []
    for ch in text:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x, base)))
        paths.append(pen.getCommands())
        x += gs[g].width * s + track * size
    return ' '.join(p for p in paths if p), x - track * size
def xheight(size):
    return font['OS/2'].sxHeight * size / upm
if __name__ == '__main__':
    d, w = outline(sys.argv[1], float(sys.argv[2]))
    print(json.dumps({'d': d, 'w': w, 'xh': xheight(float(sys.argv[2]))}))
