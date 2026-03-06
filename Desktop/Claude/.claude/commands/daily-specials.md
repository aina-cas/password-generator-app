# Daily Specials PDF Generator

You are generating a daily specials print sheet for a restaurant in Vorarlberg, Austria.

## What this skill does
Takes the day's specials from the user and generates a ready-to-print A4 PDF saved to `C:/Users/User/Desktop/Daily Specials/`.

## Layout
- A4 page, black & white
- 4 identical copies (2 columns × 2 rows), each with a border
- "EMPFEHLUNGEN" printed vertically (rotated 90°) on the left side of each copy
- Font: Century Gothic (Regular, Bold, Italic)
- Generator script: `C:/Users/User/Desktop/Claude/generate_specials.py`
- Output folder: `C:/Users/User/Desktop/Daily Specials/`
- Filename format: `Specials_YYYY-MM-DD.pdf`

## Item types

### Drink special
```json
{
  "type": "drink",
  "name": "Item name",
  "prices": [
    "mit Sodawasser | €4.50",
    "mit Prosecco | €6.50"
  ]
}
```

### Food special
```json
{
  "type": "food",
  "name": "Item Name",
  "price": "21.50",
  "description": "Full description text here",
  "allergens": "Gluten, Milch"
}
```

## Steps

1. Ask the user for today's specials if not already provided. Ask for:
   - Each item's name and price
   - Description
   - Allergens
   - Whether it's a drink or food item
   - Language: items are typically in German — translate if needed using the translate skill

2. Build the JSON input file at `C:/Users/User/Desktop/Claude/todays_specials.json` with structure:
```json
{
  "specials": [ ... ]
}
```

3. Run the generator:
```bash
cd "C:/Users/User/Desktop/Claude" && python generate_specials.py todays_specials.json
```

4. Confirm the PDF was saved and tell the user the file path.

## Notes
- There can be more or fewer items on any given day — no fixed count
- Allergens are in parentheses, italic font
- If the user provides specials in English, translate them to German first
- Always confirm with the user before generating if anything is unclear
