"""Use the currently published cover images in isolated PDF QA builds.

Recipe media lives on production hosting rather than in Git. This downloads the
three existing covers only; it creates no images and publishes no media.
"""
from html.parser import HTMLParser
import hashlib
import json
from pathlib import Path
from urllib.parse import parse_qs, urljoin, urlparse
from urllib.request import Request, urlopen


class CoverParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hero = False
        self.source = None
        self.variants = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "figure" and "md-recipe-hero-photo" in attrs.get("class", "").split():
            self.hero = True
        if tag == "img" and self.hero:
            self.source = attrs.get("src")
            self.variants = [candidate.strip().rsplit(" ", 1) for candidate in attrs.get("srcset", "").split(",") if candidate.strip()]

    def handle_endtag(self, tag):
        if tag == "figure":
            self.hero = False


root = (Path(__file__).resolve().parents[1] / "public").resolve()
output = root.parent / "recipe-print-qa"
(output / "assets").mkdir(parents=True, exist_ok=True)
manifest = []
for path in ["/tiramisu", "/receta-guacamole/", "/es/receta/tamal-tolimense"]:
    url = "https://manualdecocina.com" + path
    with urlopen(Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as response:
        parser = CoverParser()
        parser.feed(response.read().decode("utf-8"))
    if not parser.source:
        raise ValueError(f"No published cover in {url}")
    source = parse_qs(urlparse(parser.source).query).get("url", [parser.source])[0]
    variants = [(candidate, int(width[:-1])) for candidate, width in parser.variants if width.endswith("w") and width[:-1].isdigit()]
    # At 46 mm on paper, a 640px web variant supplies over 300dpi. Fetch the
    # declared display variant instead of embedding a multi-megapixel original.
    display = min((item for item in variants if item[1] >= 640), key=lambda item: item[1], default=(parser.source, 0))[0]
    if not source.startswith("/recetas/") and urlparse(source).scheme != "https":
        raise ValueError(f"Expected a public recipe image, got {source}")
    target = output / "assets" / (hashlib.sha256(source.encode()).hexdigest()[:16] + ".webp")
    with urlopen(Request(urljoin(url, display), headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as response:
        if not response.headers.get("Content-Type", "").startswith("image/"):
            raise ValueError("Cover response is not an image")
        mime = response.headers["Content-Type"].split(";")[0]
        target.write_bytes(response.read())
    manifest.append({"source": source, "file": str(target.relative_to(root.parent)), "mime": mime})
    print(f"QA cover: {source} ({target.stat().st_size} bytes)")
(output / "assets.json").write_text(json.dumps(manifest), encoding="utf-8")
