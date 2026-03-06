# Saturday Specials PDF Generator

You are generating a Saturday specials print sheet for a restaurant in Vorarlberg, Austria.

## What this skill does
Takes the Saturday specials from the user and generates a ready-to-print landscape A4 PDF saved to `C:/Users/User/Desktop/Daily Specials/`.

## Layout
- A4 landscape page, black & white, no border
- 2 identical copies side by side (left and right)
- "EMPFEHLUNGEN" printed vertically (rotated 90° CCW) on the left side of each copy
- Font: Century Gothic (Regular, Bold, Italic)
- Generator script: `C:/Users/User/Desktop/Claude/generate_saturday.py`
- Output folder: `C:/Users/User/Desktop/Daily Specials/`
- Filename format: `Saturday_YYYY-MM-DD.pdf` (never overwrites — appends _2, _3 etc.)

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

### Food special with add-on ("Mach es komplett")
```json
{
  "type": "food",
  "name": "Item Name",
  "price": "18.50",
  "description": "Full description text here",
  "allergens": "Gluten",
  "addon": {
    "label": "Mach es komplett",
    "price": "3.50",
    "description": "mit Sous-Vide-Hähnchenbrust oder Haugemachter Forelle"
  }
}
```

## Steps

1. Ask the user for Saturday's specials if not already provided. Ask for:
   - Each item's name and price
   - Description
   - Allergens
   - Whether it's a drink or food item
   - Whether any food items have a "Mach es komplett" add-on option
   - Language: items are typically in German — translate if needed

2. Build the JSON input file at `C:/Users/User/Desktop/Claude/saturday_specials.json` with structure:
```json
{
  "specials": [ ... ]
}
```

3. Run the generator:
```bash
cd "C:/Users/User/Desktop/Claude" && python generate_saturday.py saturday_specials.json
```

4. Confirm the PDF was saved and tell the user the file path.

## Notes
- There can be more or fewer items on any given Saturday — no fixed count
- If specials take up too much space, top padding automatically shrinks (min 8mm) to fit
- Allergens are in parentheses, italic font
- Add-on label and price are bold, add-on description is regular
- If the user provides specials in English, translate them to German first
- Always confirm with the user before generating if anything is unclear
- Reference layout: C:\Users\User\Documents\Saturday lunch multi  March.ai
