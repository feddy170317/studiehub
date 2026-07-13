# -*- coding: utf-8 -*-
"""
byg_videnskort.py — samler alle Kurser/<fag>/videnskort.json til én graf.

Output:
  Studiehub/html/videnskort/graph.json      (rå graf, til inspektion/tooling)
  Studiehub/html/videnskort/graph_data.js   (window.VIDENSKORT = {...}, file://-sikker)

Kørsel:  python tools/byg_videnskort.py   (fra Studiehub/ eller AI-roden)
"""
import json
import sys
import io
from pathlib import Path
from datetime import date

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HER = Path(__file__).resolve().parent          # Studiehub/tools
STUDIEHUB = HER.parent                          # Studiehub/
AI_ROD = STUDIEHUB.parent                       # Desktop/AI
KURSER = AI_ROD / "Kurser"
UD_DIR = STUDIEHUB / "html" / "videnskort"


def indlaes_fagfiler():
    filer = sorted(KURSER.glob("*/videnskort.json"))
    if not filer:
        sys.exit(f"FEJL: ingen videnskort.json fundet under {KURSER}")
    fagdata = []
    for f in filer:
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            sys.exit(f"FEJL i {f}: {e}")
        if d.get("_format") != "videnskort-v1":
            print(f"ADVARSEL: {f} har ukendt _format — springes over")
            continue
        fagdata.append((f, d))
    return fagdata


def byg_graf(fagdata):
    noder = {}   # id -> node
    kanter = []  # {source, target, type}
    rigtige_fag = {d["fag"]["id"] for _, d in fagdata}

    def tilfoej_node(nid, node):
        if nid in noder and noder[nid]["type"] != "ekstern":
            return  # rigtige noder vinder over stubs
        noder[nid] = node

    for fil, d in fagdata:
        fag = d["fag"]
        fid = fag["id"]
        tilfoej_node(fid, {
            "id": fid, "type": "fag", "navn": fag["navn"],
            "resume": fag.get("resume", ""), "semester": fag.get("semester"),
        })
        for eks in d.get("eksterne_fag", []):
            if eks["id"] not in rigtige_fag and eks["id"] not in noder:
                noder[eks["id"]] = {
                    "id": eks["id"], "type": "ekstern",
                    "navn": eks["navn"], "resume": eks.get("resume", ""),
                }
        for forud in fag.get("bygger_paa", []):
            kanter.append({"source": fid, "target": forud, "type": "bygger_paa"})

        for lek in d.get("lektioner", []):
            tilfoej_node(lek["id"], {
                "id": lek["id"], "type": "lektion", "navn": lek["titel"],
                "nummer": lek.get("nummer"), "kapitel": lek.get("kapitel", ""),
                "resume": lek.get("resume", ""), "sti": lek.get("sti", ""),
                "materialer": lek.get("materialer", {}), "fag": fid,
            })
            kanter.append({"source": lek["id"], "target": fid, "type": "del_af"})

        for b in d.get("begreber", []):
            tilfoej_node(b["id"], {
                "id": b["id"], "type": "begreb", "navn": b["navn"],
                "resume": b.get("resume", ""), "fag": fid,
            })
            for lid in b.get("lektioner", []):
                kanter.append({"source": b["id"], "target": lid, "type": "daekkes_i"})
            for forud in b.get("bygger_paa", []):
                kanter.append({"source": b["id"], "target": forud, "type": "bygger_paa"})

    # valider kanter — drop dem der peger på ukendte noder
    gyldige, droppede = [], []
    for k in kanter:
        if k["source"] in noder and k["target"] in noder:
            gyldige.append(k)
        else:
            droppede.append(k)
    for k in droppede:
        print(f"ADVARSEL: kant droppet ({k['source']} -> {k['target']}, ukendt node)")

    return {
        "version": 1,
        "_genereret": date.today().isoformat(),
        "noder": list(noder.values()),
        "kanter": gyldige,
    }


def main():
    fagdata = indlaes_fagfiler()
    graf = byg_graf(fagdata)
    UD_DIR.mkdir(parents=True, exist_ok=True)

    (UD_DIR / "graph.json").write_text(
        json.dumps(graf, ensure_ascii=False, indent=1), encoding="utf-8")
    js = "// Auto-genereret af tools/byg_videnskort.py — redigér IKKE i hånden.\n" \
         "window.VIDENSKORT = " + json.dumps(graf, ensure_ascii=False) + ";\n"
    (UD_DIR / "graph_data.js").write_text(js, encoding="utf-8")

    n_typer = {}
    for n in graf["noder"]:
        n_typer[n["type"]] = n_typer.get(n["type"], 0) + 1
    k_typer = {}
    for k in graf["kanter"]:
        k_typer[k["type"]] = k_typer.get(k["type"], 0) + 1
    print(f"OK: {len(fagdata)} fag-fil(er) -> {len(graf['noder'])} noder, {len(graf['kanter'])} kanter")
    print("  noder:", n_typer)
    print("  kanter:", k_typer)


if __name__ == "__main__":
    main()
