"""Check navigation, publishing, accessibility, and content privacy invariants."""
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

class PortfolioChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = (ROOT / "index.html").read_text()
        cls.page = Page(cls.source)

    def test_unique_ids_and_anchor_targets(self):
        ids = [attrs["id"] for _, attrs in self.page.elements if "id" in attrs]
        self.assertEqual(len(ids), len(set(ids)))
        for tag, attrs in self.page.elements:
            href = attrs.get("href", "")
            if tag == "a" and href.startswith("#"):
                self.assertIn(href[1:], ids, href)

    def test_local_assets_exist(self):
        for _, attrs in self.page.elements:
            for attribute in ("href", "src"):
                value = attrs.get(attribute, "")
                parsed = urlsplit(value)
                if value and not parsed.scheme and not value.startswith("#"):
                    self.assertTrue((ROOT / unquote(parsed.path)).is_file(), value)
        for path in re.findall(r'url\(["\']?([^"\')]+)', (ROOT / "styles.css").read_text()):
            self.assertTrue((ROOT / path).is_file(), path)

    def test_images_and_landmarks(self):
        for tag, attrs in self.page.elements:
            if tag == "img":
                self.assertIn("alt", attrs)
                self.assertIn("width", attrs)
                self.assertIn("height", attrs)
            if tag == "button":
                self.assertEqual(attrs.get("type"), "button")
        self.assertEqual(sum(tag == "h1" for tag, _ in self.page.elements), 1)
        self.assertEqual(sum(tag == "main" for tag, _ in self.page.elements), 1)

    def test_external_windows_are_isolated(self):
        for _, attrs in self.page.elements:
            if attrs.get("target") == "_blank":
                self.assertTrue({"noopener", "noreferrer"} <= set(attrs.get("rel", "").split()))

    def test_self_hosted_scripts_and_fonts(self):
        for tag, attrs in self.page.elements:
            if tag == "script" or (tag == "link" and attrs.get("as") == "font"):
                self.assertFalse(urlsplit(attrs.get("src", attrs.get("href", ""))).netloc)
        self.assertNotIn("innerHTML", (ROOT / "app.js").read_text())
        self.assertIn("prefers-reduced-motion", (ROOT / "styles.css").read_text())

    def test_government_description_stays_limited(self):
        self.assertIn("Government Cryptanalyst Internship", self.source)
        entry = re.search(r'<article class="timeline-entry compact-entry">(.*?)</article>', self.source).group(1)
        content = re.sub(r"<[^>]+>", " ", entry)
        self.assertEqual(" ".join(content.split()), "Internship Government Cryptanalyst Internship")

    def test_canonical_domain_preserved(self):
        self.assertEqual((ROOT / "CNAME").read_text().strip(), "georgiavrana.com")
        self.assertIn('rel="canonical" href="https://georgiavrana.com/"', self.source)

if __name__ == "__main__":
    unittest.main()
