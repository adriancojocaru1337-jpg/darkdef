from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-art" / "stage-backgrounds-v2"
OUTPUT = ROOT / "assets" / "terrain"
RUNTIME_SIZE = (1536, 864)

STAGES = {
    1: "stage01-forest.webp",
    2: "stage02-ruins.webp",
    3: "stage03-graveyard.webp",
    4: "stage04-castle.webp",
    5: "stage05-catacombs.webp",
    6: "stage06-dark-portal.webp",
    7: "stage07-broken-gate.webp",
    8: "stage08-ashen-road.webp",
    9: "stage09-hollow-village.webp",
    10: "stage10-sunken-crossing.webp",
    11: "stage11-first-flame.webp",
    12: "stage12-field-of-dawn.webp",
}


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for stage, source_name in STAGES.items():
        source_path = SOURCE / source_name
        output_path = OUTPUT / f"ground_{stage}.webp"
        with Image.open(source_path) as source:
            runtime = ImageOps.fit(
                source.convert("RGB"),
                RUNTIME_SIZE,
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.5),
            )
            runtime.save(
                output_path,
                format="WEBP",
                quality=90,
                method=6,
            )
        print(f"built {output_path.relative_to(ROOT)} ({RUNTIME_SIZE[0]}x{RUNTIME_SIZE[1]})")


if __name__ == "__main__":
    main()
