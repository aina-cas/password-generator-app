"""
Daily Specials PDF Generator
Layout: A4, 4 identical copies (2 cols x 2 rows), B&W, no border
Font: Century Gothic (Regular, Bold, Italic)
"""

import sys, os, json
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Register Century Gothic fonts ──────────────────────────────────────────
FONTS_DIR = "C:/Windows/Fonts"
pdfmetrics.registerFont(TTFont("CenturyGothic",            os.path.join(FONTS_DIR, "GOTHIC.TTF")))
pdfmetrics.registerFont(TTFont("CenturyGothic-Bold",       os.path.join(FONTS_DIR, "GOTHICB.TTF")))
pdfmetrics.registerFont(TTFont("CenturyGothic-Italic",     os.path.join(FONTS_DIR, "GOTHICI.TTF")))
pdfmetrics.registerFont(TTFont("CenturyGothic-BoldItalic", os.path.join(FONTS_DIR, "GOTHICBI.TTF")))

# ── Page layout ────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4          # 595.28 x 841.89 pts — no outer margin, copies fill page
COL_W = PAGE_W / 2
ROW_H = PAGE_H / 2

# EMPFEHLUNGEN settings
FS_LABEL       = 22          # pt — 22pt minimum as requested
LABEL_FROM_EDGE = 6.5 * mm  # left edge of EMPFEHLUNGEN from cell left edge

# Get actual font ascent so we can position precisely
_face        = pdfmetrics.getFont("CenturyGothic-Bold").face
_ASCENT      = _face.ascent  * FS_LABEL / 1000   # ascent in pts at FS_LABEL
_DESCENT     = abs(_face.descent) * FS_LABEL / 1000  # descent in pts (positive value)

# When EMPFEHLUNGEN is rotated 90° CCW:
#   left edge of text strip  = label_cx - _ASCENT
#   right edge of text strip = label_cx + _DESCENT
# We want left edge = LABEL_FROM_EDGE from cell left:
#   label_cx = ox + LABEL_FROM_EDGE + _ASCENT
# Right edge = label_cx + _DESCENT  (this is where text block must start + gap)
TEXT_GAP_FROM_LABEL = 6.5 * mm   # gap between right edge of EMPFEHLUNGEN and text block
# content_x = ox + LABEL_FROM_EDGE + _ASCENT + _DESCENT + TEXT_GAP_FROM_LABEL

# Font sizes
FS_ITEM_NAME   = 12
FS_DESC        = 10
FS_ALLERGEN    = 10
FS_DRINK_NAME  = 12
FS_DRINK_PRICE = 10

# Spacing
LINE_LEAD      = 1.15        # line height multiplier (× font size)
ITEM_GAP       = 3.5 * mm   # vertical gap between items
TITLE_DESC_GAP = 0.0         # pts — no gap between item title and description
TOP_PAD        = 33 * mm    # from cell top to first line (≥33mm from page top / from midpoint)


def lh(size):
    """Line height in pts for a given font size."""
    return size * LINE_LEAD


def wrapped_lines(c, text, font, size, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = (current + " " + word).strip()
        if c.stringWidth(test, font, size) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def build_instructions(c, ox, oy, specials):
    """
    First pass: calculate all text positions without drawing.
    Returns (instructions list, content_start_y, content_end_y).
    """
    cell_top  = oy + ROW_H
    label_cx  = ox + LABEL_FROM_EDGE + _ASCENT
    content_x = label_cx + _DESCENT + TEXT_GAP_FROM_LABEL
    content_w = (ox + COL_W) - content_x - 4 * mm  # right margin

    cur_y        = cell_top - TOP_PAD
    content_start = cur_y
    instructions = []

    def emit(text, font, size, x=None):
        nonlocal cur_y
        cur_y -= lh(size)
        instructions.append((text, font, size, x if x is not None else content_x, cur_y))

    def spacer(pts):
        nonlocal cur_y
        cur_y -= pts

    for item in specials:
        itype = item.get("type", "food")

        if itype == "drink":
            emit(item["name"].upper(), "CenturyGothic-Bold", FS_DRINK_NAME)
            for price_line in item.get("prices", []):
                emit(price_line, "CenturyGothic", FS_DRINK_PRICE)
            spacer(ITEM_GAP)

        else:
            cur_y -= lh(FS_ITEM_NAME)
            instructions.append((
                [(f"{item['name'].upper()}  |  ", "CenturyGothic-Bold"), (item['price'], "CenturyGothic")],
                None, FS_ITEM_NAME, content_x, cur_y
            ))

            # No gap between title and description
            desc = item.get("description", "")
            if isinstance(desc, list):
                desc = " ".join(desc)
            for line in wrapped_lines(c, desc, "CenturyGothic", FS_DESC, content_w):
                emit(line, "CenturyGothic", FS_DESC)

            allergens = item.get("allergens", "")
            if allergens:
                emit(f"({allergens})", "CenturyGothic-Italic", FS_ALLERGEN)

            spacer(ITEM_GAP)

    content_end = cur_y + ITEM_GAP  # trim last spacer
    return instructions, content_start, content_end, label_cx


def draw_copy(c, ox, oy, specials):
    """Draw one copy of the specials block."""
    instructions, content_start, content_end, label_cx = build_instructions(c, ox, oy, specials)

    # ── EMPFEHLUNGEN (rotated 90° CCW, bottom aligned to content bottom) ──
    label_text = "EMPFEHLUNGEN"
    c.setFont("CenturyGothic-Bold", FS_LABEL)
    text_len = c.stringWidth(label_text, "CenturyGothic-Bold", FS_LABEL)

    # bottom of EMPFEHLUNGEN = content_end → center = content_end + text_len/2
    label_cy = content_end + text_len / 2

    c.saveState()
    c.setFillColorRGB(0, 0, 0)
    c.translate(label_cx, label_cy)
    c.rotate(90)
    c.drawCentredString(0, 0, label_text)
    c.restoreState()

    # ── Content text ───────────────────────────────────────────────────────
    for text, font, size, x, y in instructions:
        c.setFillColorRGB(0, 0, 0)
        if isinstance(text, list):
            cx = x
            for seg_text, seg_font in text:
                c.setFont(seg_font, size)
                c.drawString(cx, y, seg_text)
                cx += c.stringWidth(seg_text, seg_font, size)
        else:
            c.setFont(font, size)
            c.drawString(x, y, text)


def generate_pdf(specials, output_path):
    c = canvas.Canvas(output_path, pagesize=A4)
    c.setTitle("Tages-Empfehlungen")

    for col, row in [(0, 1), (1, 1), (0, 0), (1, 0)]:
        draw_copy(c, col * COL_W, row * ROW_H, specials)

    c.save()
    print(f"Saved: {output_path}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = json.loads(sys.stdin.read())

    specials = data["specials"]
    date_str = datetime.now().strftime("%Y-%m-%d")
    out_dir  = "C:/Users/User/Desktop/Daily Specials"

    # Never overwrite — append _2, _3 etc. if file already exists
    filename = f"Specials_{date_str}.pdf"
    output   = os.path.join(out_dir, filename)
    counter  = 2
    while os.path.exists(output):
        filename = f"Specials_{date_str}_{counter}.pdf"
        output   = os.path.join(out_dir, filename)
        counter += 1

    generate_pdf(specials, output)
