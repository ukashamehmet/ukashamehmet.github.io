"""One-off extractor: turns the original static site's case studies and field
notes into JSON so the React app renders the exact same copy.

Usage: python -I scripts/extract.py <crawl-dir> <out-dir>
"""
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, Comment

KEEP_CLASSES = {"c", "r", "y", "article-callout"}  # code highlight spans + callouts


def fix_href(href):
    if not href or href.startswith(("http", "mailto:", "tel:", "#")):
        return href
    href = re.sub(r"^(\.\./)+", "/", href)
    href = href.replace("index.html", "")
    if not href.startswith("/"):
        href = "/blog/posts/" + href  # sibling post links
    return href


def clean(node):
    """Return inner HTML with svgs, comments and presentational classes removed."""
    for svg in node.find_all("svg"):
        svg.decompose()
    for c in node.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()
    for el in node.find_all(True):
        cls = [c for c in el.get("class", []) if c in KEEP_CLASSES]
        el.attrs.pop("style", None)
        if cls:
            el["class"] = cls
        else:
            el.attrs.pop("class", None)
        if el.name == "a" and el.get("href"):
            el["href"] = fix_href(el["href"])
    html = node.decode_contents()
    return re.sub(r"\n\s*\n+", "\n", html).strip()


def text(node):
    return re.sub(r"\s+", " ", node.get_text(" ", strip=True)).strip() if node else ""


def soup_of(path):
    return BeautifulSoup(Path(path).read_text(encoding="utf-8"), "html.parser")


def extract_cases(crawl):
    s = soup_of(crawl / "projects" / "index.html")
    cases = []
    for d in s.select("details.case"):
        summ = d.select_one(".case-summary")
        heading = summ.select(".case-heading > span")
        body = d.select_one(".case-body")
        sections = []
        outcomes, callout, tags = [], "", []
        for sec in body.select(".case-section"):
            og = sec.select_one(".outcome-grid")
            if og:
                outcomes = [
                    {"value": text(o.find("strong")), "label": text(o.find("span"))}
                    for o in og.select(".outcome")
                ]
                og.decompose()
            co = sec.select_one(".case-callout")
            if co:
                callout = clean(co.find("p"))
                co.decompose()
            ft = sec.select_one(".case-footer")
            if ft:
                tags = [text(t) for t in ft.select(".tag")]
                ft.decompose()
            h = sec.find("h3")
            title = text(h)
            h.decompose()
            sections.append({"title": title, "html": clean(sec)})
        cases.append({
            "id": d["id"],
            "no": text(summ.select_one(".case-no")),
            "filters": d.get("data-cases", "").split(),
            "category": text(heading[0]),
            "severity": text(heading[1]),
            "sector": text(heading[2]),
            "title": text(summ.find("h2")),
            "summary": text(summ.find("p")),
            "summaryTags": [text(t) for t in summ.select(".case-summary-meta .tag")],
            "meta": [
                {"label": text(x.find("dt")), "value": text(x.find("dd"))}
                for x in body.select(".case-meta-grid > div")
            ],
            "sections": sections,
            "outcomes": outcomes,
            "callout": callout,
            "tags": tags,
        })
    archive = [
        [text(td) for td in tr.find_all("td")]
        for tr in s.select(".archive-table tbody tr")
    ]
    return cases, archive


def extract_post(path):
    s = soup_of(path)
    art = s.select_one("article")
    aside = s.select_one(".article-aside")
    hdr = art.select_one(".article-header")
    byline = [text(x) for x in hdr.select(".article-byline > span")]
    end = art.select_one(".article-end")
    rel = end.find("p")
    rel_link = end.select_one(".article-end-actions a")
    nxt = art.select_one(".article-next")
    head = s.find("head")
    desc = head.find("meta", attrs={"name": "description"})
    return {
        "slug": Path(path).stem,
        "eyebrow": text(hdr.select_one(".eyebrow")),
        "title": text(hdr.find("h1")),
        "dek": text(hdr.select_one(".article-dek")),
        "byline": byline,
        "details": [
            {"label": text(dt), "value": text(dt.find_next_sibling("dd"))}
            for dt in aside.find_all("dt")
        ],
        "html": clean(art.select_one(".prose")),
        "relatedHtml": clean(rel),
        "relatedHref": fix_href(rel_link["href"]) if rel_link else "",
        "next": {
            "href": fix_href(nxt["href"]),
            "title": text(nxt.find("strong")),
        } if nxt else None,
        "metaTitle": text(head.find("title")),
        "metaDescription": desc["content"] if desc else "",
    }


def main():
    crawl, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    cases, archive = extract_cases(crawl)
    posts = [
        extract_post(crawl / "blog" / "posts" / f"{n}.html")
        for n in ["tenant-boundaries", "waf-origin", "android-vpn", "findings-engineers-fix"]
    ]
    (out / "cases.json").write_text(json.dumps({"cases": cases, "archive": archive}, ensure_ascii=False, indent=1), encoding="utf-8")
    (out / "posts.json").write_text(json.dumps(posts, ensure_ascii=False, indent=1), encoding="utf-8")
    print(len(cases), "cases,", len(archive), "archive rows,", len(posts), "posts")


if __name__ == "__main__":
    main()

