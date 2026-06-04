#!/usr/bin/env python3
"""Local, dependency-free Excalidraw → SVG renderer.

Renders the subset of Excalidraw elements used by this project's diagrams
(rectangle, ellipse, line, arrow, text) to a clean SVG. Because our diagrams
use roughness:0, the result matches Excalidraw's own clean export — without
needing the skill's esm.sh + headless-Chromium pipeline (which fails to load
the Excalidraw bundle in this environment).

Usage:
    python3 tools/render_svg.py diagrams-src/foo.excalidraw public/diagrams/foo.svg
"""
from __future__ import annotations
import json, sys, html, math
from pathlib import Path

PAD = 60


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def bbox(elements):
    minx = miny = float("inf"); maxx = maxy = float("-inf")
    for el in elements:
        if el.get("isDeleted"):
            continue
        x, y = el.get("x", 0), el.get("y", 0)
        w, h = el.get("width", 0), el.get("height", 0)
        if el.get("type") in ("arrow", "line") and "points" in el:
            for px, py in el["points"]:
                minx, miny = min(minx, x+px), min(miny, y+py)
                maxx, maxy = max(maxx, x+px), max(maxy, y+py)
        else:
            minx, miny = min(minx, x), min(miny, y)
            maxx, maxy = max(maxx, x+abs(w)), max(maxy, y+abs(h))
    if minx == float("inf"):
        return 0, 0, 800, 600
    return minx, miny, maxx, maxy


def text_lines(el):
    return (el.get("text") or "").split("\n")


def render_text(el, by_id):
    lines = text_lines(el)
    size = el.get("fontSize", 16)
    lh = size * el.get("lineHeight", 1.25)
    color = el.get("strokeColor", "#111111")
    align = el.get("textAlign", "left")
    anchor = {"left": "start", "center": "middle", "right": "end"}.get(align, "start")
    cid = el.get("containerId")
    if cid and cid in by_id:
        c = by_id[cid]
        cx, cy = c.get("x", 0), c.get("y", 0)
        cw, ch = c.get("width", 0), c.get("height", 0)
        tx = cx + cw / 2
        anchor = "middle"
        block_h = lh * len(lines)
        # vertically center the text block; baseline of first line
        start_y = cy + ch / 2 - block_h / 2 + size * 0.82
    else:
        x, y = el.get("x", 0), el.get("y", 0)
        w = el.get("width", 0)
        if anchor == "middle":
            tx = x + w / 2
        elif anchor == "end":
            tx = x + w
        else:
            tx = x
        valign = el.get("verticalAlign", "top")
        if valign == "middle":
            h = el.get("height", lh * len(lines))
            start_y = y + h / 2 - (lh * len(lines)) / 2 + size * 0.82
        else:
            start_y = y + size * 0.82
    out = [f'<text font-family="ui-sans-serif, Inter, Segoe UI, Helvetica, Arial, sans-serif" '
           f'font-size="{size}" fill="{color}" text-anchor="{anchor}" '
           f'font-weight="{"600" if size>=20 else "500"}">']
    for i, ln in enumerate(lines):
        out.append(f'<tspan x="{tx:.1f}" y="{start_y + i*lh:.1f}">{esc(ln)}</tspan>')
    out.append("</text>")
    return "".join(out)


def render_shape(el):
    stroke = el.get("strokeColor", "#111111")
    bg = el.get("backgroundColor", "transparent")
    if bg == "transparent":
        bg = "none"
    sw = el.get("strokeWidth", 2)
    x, y = el.get("x", 0), el.get("y", 0)
    w, h = el.get("width", 0), el.get("height", 0)
    t = el.get("type")
    if t == "rectangle":
        rx = 12 if el.get("roundness") else 0
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" ry="{rx}" '
                f'fill="{bg}" stroke="{stroke}" stroke-width="{sw}"/>')
    if t == "ellipse":
        return (f'<ellipse cx="{x+w/2}" cy="{y+h/2}" rx="{w/2}" ry="{h/2}" '
                f'fill="{bg}" stroke="{stroke}" stroke-width="{sw}"/>')
    if t in ("line", "arrow"):
        pts = el.get("points", [[0, 0], [w, h]])
        abspts = [(x+px, y+py) for px, py in pts]
        d = " ".join(f"{px:.1f},{py:.1f}" for px, py in abspts)
        dash = ' stroke-dasharray="8 6"' if el.get("strokeStyle") == "dashed" else ""
        seg = f'<polyline points="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{dash}/>'
        if t == "arrow" and el.get("endArrowhead", "arrow") and len(abspts) >= 2:
            (x1, y1), (x2, y2) = abspts[-2], abspts[-1]
            ang = math.atan2(y2 - y1, x2 - x1)
            L, spread = 11, math.radians(26)
            ax1 = x2 - L * math.cos(ang - spread)
            ay1 = y2 - L * math.sin(ang - spread)
            ax2 = x2 - L * math.cos(ang + spread)
            ay2 = y2 - L * math.sin(ang + spread)
            seg += (f'<polygon points="{x2:.1f},{y2:.1f} {ax1:.1f},{ay1:.1f} {ax2:.1f},{ay2:.1f}" '
                    f'fill="{stroke}"/>')
        return seg
    return ""


def render(infile: Path, outfile: Path):
    data = json.loads(infile.read_text())
    elements = [e for e in data.get("elements", []) if not e.get("isDeleted")]
    by_id = {e["id"]: e for e in elements if "id" in e}
    minx, miny, maxx, maxy = bbox(elements)
    W = maxx - minx + PAD * 2
    H = maxy - miny + PAD * 2
    bgc = data.get("appState", {}).get("viewBackgroundColor", "#ffffff")
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.0f}" height="{H:.0f}" '
        f'viewBox="{minx-PAD:.0f} {miny-PAD:.0f} {W:.0f} {H:.0f}">',
        f'<rect x="{minx-PAD:.0f}" y="{miny-PAD:.0f}" width="{W:.0f}" height="{H:.0f}" fill="{bgc}"/>',
    ]
    # shapes first, then text on top
    for el in elements:
        if el.get("type") in ("rectangle", "ellipse", "line", "arrow"):
            parts.append(render_shape(el))
    for el in elements:
        if el.get("type") == "text":
            parts.append(render_text(el, by_id))
    parts.append("</svg>")
    outfile.parent.mkdir(parents=True, exist_ok=True)
    outfile.write_text("\n".join(parts))
    print(f"✓ {outfile}  ({W:.0f}×{H:.0f})")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("usage: render_svg.py <in.excalidraw> <out.svg>", file=sys.stderr)
        sys.exit(1)
    render(Path(sys.argv[1]), Path(sys.argv[2]))
