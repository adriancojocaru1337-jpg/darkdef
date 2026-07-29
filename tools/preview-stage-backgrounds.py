from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "tmp" / "stage-backgrounds-v2-contact.webp"
TILE_SIZE = (480, 270)
LABEL_HEIGHT = 34
STAGE_NAMES = (
    "Forest",
    "Ruins",
    "Graveyard",
    "Castle",
    "Catacombs",
    "Dark Portal",
    "Broken Gate",
    "Ashen Road",
    "Hollow Village",
    "Sunken Crossing",
    "First Flame",
    "Field of Dawn",
)


def main() -> None:
    sheet = Image.new("RGB", (TILE_SIZE[0] * 4, (TILE_SIZE[1] + LABEL_HEIGHT) * 3), "#080b10")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=18)

    for index, stage_name in enumerate(STAGE_NAMES):
        stage = index + 1
        column = index % 4
        row = index // 4
        x = column * TILE_SIZE[0]
        y = row * (TILE_SIZE[1] + LABEL_HEIGHT)
        source = ROOT / "assets" / "terrain" / f"ground_{stage}.webp"
        with Image.open(source) as image:
            sheet.paste(image.convert("RGB").resize(TILE_SIZE, Image.Resampling.LANCZOS), (x, y))
        label = f"STAGE {stage} · {stage_name}"
        draw.rectangle((x, y + TILE_SIZE[1], x + TILE_SIZE[0], y + TILE_SIZE[1] + LABEL_HEIGHT), fill="#090c12")
        draw.text((x + 12, y + TILE_SIZE[1] + 7), label, font=font, fill="#e7c078")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUTPUT, "WEBP", quality=88, method=6)
    print(f"preview {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
