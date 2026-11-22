"""Build an allowlisted static deployment without runtime dependencies."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "dist"

def build():
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    for name in ("index.html", "styles.css", "app.js", "robots.txt", "sitemap.xml", "CNAME", ".nojekyll"):
        shutil.copy2(ROOT / name, OUTPUT / name)
    shutil.copytree(ROOT / "media", OUTPUT / "media")
    print(f"Built static site in {OUTPUT}")

if __name__ == "__main__":
    build()
