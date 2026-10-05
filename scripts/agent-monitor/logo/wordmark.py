# Outline text in Plus Jakarta Sans at a given weight → SVG path data (no font dependency, like the CI wordmark).
from functools import lru_cache
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen


@lru_cache(maxsize=None)
def face(weight):
    font = instantiateVariableFont(TTFont('jakarta.ttf'), {'wght': weight})
    return font.getGlyphSet(), font.getBestCmap(), font['head'].unitsPerEm


def glyph_box(ch, weight=800):
    """Ink box (xmin, ymin, xmax, ymax) and advance of one glyph, in em units (y up)."""
    gs, cmap, upm = face(weight)
    g = gs[cmap[ord(ch)]]
    pen = BoundsPen(gs)
    g.draw(pen)
    return tuple(v / upm for v in pen.bounds) + (g.width / upm,)


# pair kerning from GPOS is skipped; the face is evenly spaced at display sizes
def outline(text, size, x0=0, base=0, track=-0.02, weight=800):
    """Path data for text set from x0 on baseline `base`; returns (d, x after the last advance)."""
    gs, cmap, upm = face(weight)
    s = size / upm
    x = x0
    paths = []
    for ch in text:
        pen = SVGPathPen(gs)
        gs[cmap[ord(ch)]].draw(TransformPen(pen, (s, 0, 0, -s, x, base)))
        paths.append(pen.getCommands())
        x += gs[cmap[ord(ch)]].width * s + track * size
    return ' '.join(p for p in paths if p), x - track * size
