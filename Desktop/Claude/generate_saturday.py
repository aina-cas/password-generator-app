"""
Saturday Specials PDF Generator
Layout: A4 landscape, 2 identical copies (side by side), B&W, no border
Font: Century Gothic (Regular, Bold, Italic)
"""

import sys, os, json
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Register Century Gothic fonts ──────────────────────────────────────────
FONTS_DIR = "C:/Windows/Fonts"
pdfmetrics.registerFont(TTFont("CenturyGothic",            os.path.join(FONTS_DIR, "GOTHIC.TTF")))
pdfmetrics.registerFont(TTFont("CenturyGothic-Bold",       os.path.join(FONTS_DIR, "GOTHICB.TTF")))
pdfmetrics.registerFont(TTFont("CenturyGothic-Italic",     os.path.join(FONTS_DIR, "GOTHICI.TTF")))
pdfmetrics.registerFont(TTFont("CenturyGothic-BoldItalic", os.path.join(FONTS_DIR, "GOTHICBI.TTF")))

# ── Page layout (landscape A4) ─────────────────────────────────────────────
PAGE_W, PAGE_H = landscape(A4)   # 841.89 x 595.28 pts
COL_W   = 105 * mm               # max column width
COL_GAP = 15 * mm                # min gap between columns
H_MARGIN = (PAGE_W - 2 * COL_W - COL_GAP) / 2   # centre both columns on page

# EMPFEHLUNGEN settings (same as daily specials)
FS_LABEL        = 22
LABEL_FROM_EDGE = 6.5 * mm

_face    = pdfmetrics.getFont("CenturyGothic-Bold").face
_ASCENT  = _face.ascent  * FS_LABEL / 1000
_DESCENT = abs(_face.descent) * FS_LABEL / 1000

TEXT_GAP_FROM_LABEL = 6.5 * mm

# Font sizes
FS_ITEM_NAME   = 12
FS_DESC        = 10
FS_ALLERGEN    = 10
FS_ADDON_LABEL = 10
FS_ADDON_DESC  = 10
FS_DRINK_NAME  = 12
FS_DRINK_PRICE = 10

# Spacing
LINE_LEAD      = 1.15
ITEM_GAP       = 3.5 * mm
MAX_TOP_PAD    = 33 * mm    # preferred top padding
MIN_TOP_PAD    = 8 * mm     # minimum if content is too long


def lh(size):
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


def calc_content_height(c, content_w, specials):
    """Calculate total height of all content in pts (no drawing)."""
    total = 0

    def add(size):
        nonlocal total
        total += lh(size)

    def spacer(pts):
        nonlocal total
        total += pts

    for item in specials:
        itype = item.get("type", "food")

        if itype == "drink":
            add(FS_DRINK_NAME)
            for _ in item.get("prices", []):
                add(FS_DRINK_PRICE)
            spacer(ITEM_GAP)

        else:
            add(FS_ITEM_NAME)
            desc = item.get("description", "")
            if isinstance(desc, list):
                desc = " ".join(desc)
            for _ in wrapped_lines(c, desc, "CenturyGothic", FS_DESC, content_w):
                add(FS_DESC)
            if item.get("allergens"):
                add(FS_ALLERGEN)
            addon = item.get("addon")
            if addon:
                add(FS_ADDON_LABEL)
                addon_desc = addon.get("description", "")
                for _ in wrapped_lines(c, addon_desc, "CenturyGothic", FS_ADDON_DESC, content_w):
                    add(FS_ADDON_DESC)
            spacer(ITEM_GAP)

    return total - ITEM_GAP  # trim last spacer


def build_instructions(c, ox, oy, specials, top_pad):
    """
    Calculate all text positions. Returns (instructions, content_start_y, content_end_y, label_cx).
    """
    label_cx  = ox + LABEL_FROM_EDGE + _ASCENT
    content_x = label_cx + _DESCENT + TEXT_GAP_FROM_LABEL
    content_w = (ox + COL_W) - content_x - 4 * mm

    cell_top      = oy + PAGE_H
    cur_y         = cell_top - top_pad
    content_start = cur_y
    instructions  = []

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

            desc = item.get("description", "")
            if isinstance(desc, list):
                desc = " ".join(desc)
            for line in wrapped_lines(c, desc, "CenturyGothic", FS_DESC, content_w):
                emit(line, "CenturyGothic", FS_DESC)

            if item.get("allergens"):
                emit(f"({item['allergens']})", "CenturyGothic-Italic", FS_ALLERGEN)

            # Optional "Mach es komplett" add-on
            addon = item.get("addon")
            if addon:
                label = addon.get("label", "Mach es komplett")
                price = addon.get("price", "")
                addon_line = f"{label}  |  {price}" if price else label
                emit(addon_line, "CenturyGothic-Bold", FS_ADDON_LABEL)
                addon_desc = addon.get("description", "")
                if addon_desc:
                    for line in wrapped_lines(c, addon_desc, "CenturyGothic", FS_ADDON_DESC, content_w):
                        emit(line, "CenturyGothic", FS_ADDON_DESC)

            spacer(ITEM_GAP)

    content_end = cur_y + ITEM_GAP  # trim last spacer
    return instructions, content_start, content_end, label_cx, content_x


def draw_copy(c, ox, specials):
    """Draw one copy. ox = left edge of this column."""
    label_cx  = ox + LABEL_FROM_EDGE + _ASCENT
    content_x = label_cx + _DESCENT + TEXT_GAP_FROM_LABEL
    content_w = (ox + COL_W) - content_x - 4 * mm

    # Decide top padding dynamically
    content_h = calc_content_height(c, content_w, specials)
    available = PAGE_H - MIN_TOP_PAD
    if content_h <= PAGE_H - MAX_TOP_PAD:
        top_pad = MAX_TOP_PAD
    else:
        top_pad = max(MIN_TOP_PAD, PAGE_H - content_h)

    instructions, content_start, content_end, label_cx, content_x = \
        build_instructions(c, ox, 0, specials, top_pad)

    # ── EMPFEHLUNGEN ───────────────────────────────────────────────────────
    label_text = "EMPFEHLUNGEN"
    c.setFont("CenturyGothic-Bold", FS_LABEL)
    text_len = c.stringWidth(label_text, "CenturyGothic-Bold", FS_LABEL)
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
    c = canvas.Canvas(output_path, pagesize=landscape(A4))
    c.setTitle("Samstags-Empfehlungen")

    draw_copy(c, 6.5 * mm, specials)                        # left copy — 6.5mm from page edge
    draw_copy(c, 6.5 * mm + COL_W + COL_GAP, specials)     # right copy

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

    filename = f"Saturday_{date_str}.pdf"
    output   = os.path.join(out_dir, filename)
    counter  = 2
    while os.path.exists(output):
        filename = f"Saturday_{date_str}_{counter}.pdf"
        output   = os.path.join(out_dir, filename)
        counter += 1

    generate_pdf(specials, output)
