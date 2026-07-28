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
STANDARDBOG_INDEX = AI_ROD / "referencer" / "standardbog_index.json"
HAANDBOG_INDEX = AI_ROD / "referencer" / "haandbog_index.json"


def indlaes_standarder():
    if not STANDARDBOG_INDEX.exists():
        return {}
    d = json.loads(STANDARDBOG_INDEX.read_text(encoding="utf-8"))
    return {s["id"]: s for s in d.get("standarder", [])}


def indlaes_haandbog():
    if not HAANDBOG_INDEX.exists():
        return {}
    d = json.loads(HAANDBOG_INDEX.read_text(encoding="utf-8"))
    return {s["id"]: s for s in d.get("sektioner", [])}


def indlaes_figurer():
    figurer = {}
    for f in sorted(KURSER.glob("**/Figurkatalog/catalog.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        fag_navn = d.get("fag", "")
        for fig in d.get("figurer", []):
            fig = dict(fig, fag=fag_navn)
            figurer[fig["id"]] = fig
    return figurer


def indlaes_fagfiler():
    filer = sorted(KURSER.glob("**/videnskort.json"))
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


def byg_graf(fagdata, standarder=None, figurer=None, haandbog=None):
    standarder = standarder or {}
    figurer = figurer or {}
    haandbog = haandbog or {}
    ukendte_standarder = []
    ukendte_figurer = []
    ukendte_haandbog = []
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
            node = {
                "id": b["id"], "type": "begreb", "navn": b["navn"],
                "resume": b.get("resume", ""), "fag": fid,
            }
            fig_stubs = []
            for fig_id in b.get("figurer", []):
                fig = figurer.get(fig_id)
                if fig is None:
                    ukendte_figurer.append((b["id"], fig_id))
                    continue
                fig_stubs.append({"id": fig["id"], "titel": fig.get("titel", ""), "fag": fig.get("fag", "")})
            if fig_stubs:
                node["figurer"] = fig_stubs
            std_stubs = []
            for std_id in b.get("standarder", []):
                std = standarder.get(std_id)
                if std is None:
                    ukendte_standarder.append((b["id"], std_id))
                    continue
                std_stubs.append({"id": std["id"], "titel": std.get("titel", ""), "side": std.get("side")})
            if std_stubs:
                node["standarder"] = std_stubs
            hb_stubs = []
            for hb_id in b.get("haandbog", []):
                hb = haandbog.get(hb_id)
                if hb is None:
                    ukendte_haandbog.append((b["id"], hb_id))
                    continue
                hb_stubs.append({
                    "id": hb["id"], "titel": hb.get("titel", ""),
                    "kapitel": hb.get("kapitel", ""), "fil": hb.get("fil", ""),
                    "side_fra": hb.get("side_fra"), "side_til": hb.get("side_til"),
                })
            if hb_stubs:
                node["haandbog"] = hb_stubs
            tilfoej_node(b["id"], node)
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

    for bid, fig_id in ukendte_figurer:
        print(f"ADVARSEL: begreb '{bid}' refererer ukendt figur '{fig_id}'")
    for bid, std_id in ukendte_standarder:
        print(f"ADVARSEL: begreb '{bid}' refererer ukendt standard '{std_id}'")
    for bid, hb_id in ukendte_haandbog:
        print(f"ADVARSEL: begreb '{bid}' refererer ukendt haandbog-sektion '{hb_id}'")

    return {
        "version": 1,
        "_genereret": date.today().isoformat(),
        "noder": list(noder.values()),
        "kanter": gyldige,
        "_ukendte_figur_referencer": len(ukendte_figurer),
        "_ukendte_standard_referencer": len(ukendte_standarder),
        "_ukendte_haandbog_referencer": len(ukendte_haandbog),
    }


def main():
    fagdata = indlaes_fagfiler()
    standarder = indlaes_standarder()
    figurer = indlaes_figurer()
    haandbog = indlaes_haandbog()
    graf = byg_graf(fagdata, standarder=standarder, figurer=figurer, haandbog=haandbog)
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
    print(f"  figur-referencer: {graf['_ukendte_figur_referencer']} ukendte, "
          f"standard-referencer: {graf['_ukendte_standard_referencer']} ukendte, "
          f"haandbog-referencer: {graf['_ukendte_haandbog_referencer']} ukendte")


if __name__ == "__main__":
    main()
