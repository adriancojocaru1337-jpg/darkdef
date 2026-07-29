from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-art" / "completion-screens"
OUTPUT = ROOT / "assets" / "ui"

ASSETS = {
    "act1-complete-background.webp": "act1-complete-background.webp",
    "act2-complete-background.webp": "act2-complete-background.webp",
}


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for source_name, output_name in ASSETS.items():
        source_path = SOURCE / source_name
        output_path = OUTPUT / output_name
        with Image.open(source_path) as image:
            image.convert("RGB").save(
                output_path,
                format="WEBP",
                lossless=True,
                method=6,
            )
        print(f"built {output_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
