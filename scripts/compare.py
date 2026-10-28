"""Checks that every text block from the original site appears in the new build.

Usage: python -I scripts/compare.py <crawl-dir> <dist-site-dir>
"""
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

PAGES = ["index.html", "projects/index.html", "blog/index.html", "resume.html", "admin/index.html",
         "blog/posts/tenant-boundaries.html", "blog/posts/waf-origin.html",
         "blog/posts/android-vpn.html", "blog/posts/findings-engineers-fix.html"]


def norm(s):
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", s).strip().lower()


def blocks(html):
    s = BeautifulSoup(html, "html.parser")
    for t in s(["script", "style", "svg", "noscript", "head"]):
        t.decompose()
    out = []
    for el in s.find_all(["p", "li", "h1", "h2", "h3", "h4", "td", "th", "dt", "dd", "blockquote", "pre", "strong", "small", "summary", "option", "label", "button", "a"]):
        t = norm(el.get_text(" ", strip=True))
        if len(t) > 3:
            out.append(t)
    return out


def text_of(html):
    s = BeautifulSoup(html, "html.parser")
    for t in s(["script", "style", "svg"]):
        t.decompose()
    return norm(s.get_text(" ", strip=True))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    crawl, site = Path(sys.argv[1]), Path(sys.argv[2])
    total_missing = 0
    for page in PAGES:
        orig = blocks((crawl / page).read_text(encoding="utf-8"))
        new = text_of((site / page).read_text(encoding="utf-8"))
        squashed = new.replace(" ", "")
        missing = sorted({b for b in orig if b not in new and b.replace(" ", "") not in squashed})
        total_missing += len(missing)
        print(f"== {page}: {len(orig)} blocks, {len(missing)} not found verbatim")
        for m in missing:
            print("   -", m[:150])
    print("TOTAL missing:", total_missing)


if __name__ == "__main__":
    main()
