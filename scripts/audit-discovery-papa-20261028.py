"""Check actual discovery links on ordinary public URLs after cache refresh."""
import datetime
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://manualdecocina.com"
DATA = ROOT / "editorial/siete-mercados-20261027"
SLUGS = json.loads((DATA / "groups.json").read_text())
RECORDS = []
for slug in SLUGS:
    RECORDS.extend(json.loads((DATA / (slug + ".json")).read_text())["records"])
LANGS = ("es", "en", "de", "fr", "it", "ja", "pt")
PAPA_ID = "98322e50-1f0c-406c-8681-b5718d3801ee"

class VisiblePage(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = set()
        self.skip = 0
        self.text = []
        self.chips = []
        self.in_chip = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("script", "style"):
            self.skip += 1
        if tag == "button" and "md-pantry-chip" in attrs.get("class", "").split():
            self.in_chip = True
        if tag == "a" and attrs.get("href"):
            self.links.add(urllib.parse.unquote(urllib.parse.urlsplit(
                urllib.parse.urljoin(BASE, attrs["href"])).path))
    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)
        if tag == "button":
            self.in_chip = False
    def handle_data(self, text):
        if not self.skip:
            self.text.append(text)
            if self.in_chip:
                self.chips.append(text.strip())

def fetch(path, rsc=False):
    headers = {"User-Agent": "ManualDeCocina-Discovery-QA/1.0"}
    if rsc:
        headers["RSC"] = "1"
    request = urllib.request.Request(BASE + path, headers=headers)
    with urllib.request.urlopen(request, timeout=35) as response:
        return response, response.read().decode()

def check(path, expected, rsc=False, papa=False):
    attempts = []
    for attempt in range(2):
        try:
            response, body = fetch(path, rsc)
            page = VisiblePage()
            page.feed(body)
            present = page.links if not rsc else {value for value in expected if value in urllib.parse.unquote(body)}
            missing = sorted(set(expected) - present)
            label_ok = not papa or ("Papa" in page.chips and "Papas" not in page.chips and PAPA_ID in body)
            ok = response.status == 200 and not missing and label_ok
            result = {
                "status": response.status, "final_url": response.url,
                "cdn_cache": response.headers.get("x-hcdn-cache-status"),
                "cache_control": response.headers.get("cache-control"),
                "content_type": response.headers.get("content-type"),
                "missing_links": missing, "papa_label_ok": label_ok, "ok": ok,
            }
        except Exception as error:
            result = {"ok": False, "error": str(error)}
        attempts.append(result)
        if result["ok"]:
            break
        if attempt == 0:
            time.sleep(3)
    return {"path": path, "rsc": rsc, "attempts": attempts, "ok": attempts[-1]["ok"]}

def main():
    report = {"checked_at": datetime.datetime.now(datetime.timezone.utc).isoformat(), "checks": []}
    for lang in LANGS:
        expected = [row["public_path"] for row in RECORDS if row["language"] == lang]
        assert len(expected) == 7
        for path in ("/" + lang, "/" + lang + "/recetas"):
            result = check(path, expected)
            report["checks"].append(result)
            print(path, "PASS" if result["ok"] else "FAIL", flush=True)
            time.sleep(0.5)
    es_paths = [row["public_path"] for row in RECORDS if row["language"] == "es"]
    report["checks"].append(check("/es/recetas?_rsc=discovery20261028", es_paths, rsc=True))
    report["checks"].append(check("/es/recetas?q=patatas+bravas", ["/patatas-bravas-freidora-aire"]))
    report["checks"].append(check("/es/que-puedo-cocinar", [], papa=True))
    report["passed"] = sum(item["ok"] for item in report["checks"])
    report["total"] = len(report["checks"])
    output = ROOT / "discovery-papa-20261028-qa.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"passed": report["passed"], "total": report["total"], "report": output.name}), flush=True)
    return 0 if report["passed"] == report["total"] else 1

if __name__ == "__main__":
    raise SystemExit(main())

