"""Lukas-kommandoen: send dillerfjæs-popup'en til en elev på Studiehub (assets/sh-popup.js).

  py tools/lukas.py            send popup til Lukas
  py tools/lukas.py status     har han bekræftet den seneste?
  py tools/lukas.py send Simon send til en anden elev (navn som i elevlisten)
"""
import json
import sys
import time
import urllib.request
from datetime import datetime

DB = "https://via-quiz-default-rtdb.europe-west1.firebasedatabase.app/studiehub/students"


def kald(sti, metode="GET", data=None):
    req = urllib.request.Request(f"{DB}{sti}.json", method=metode,
                                 data=None if data is None else json.dumps(data).encode())
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read() or "null")


def find(navn):
    elever = kald("") or {}
    for sid, e in elever.items():
        if (e.get("name") or "").strip().lower() == navn.lower():
            return sid, e
    sys.exit(f"Ingen elev ved navn {navn!r}. Findes: {', '.join(e.get('name', '?') for e in elever.values())}")


def tid(ms):
    return datetime.fromtimestamp(ms / 1000).strftime("%d.%m %H:%M:%S")


def status(navn):
    _, e = find(navn)
    p, a = e.get("popup"), e.get("popupAck")
    if not p:
        print(f"{navn} har aldrig fået popup'en.")
    elif a and a.get("popup", 0) >= p["ts"]:
        print(f"{navn} BEKRÆFTEDE kl. {tid(a['ts'])} (popup sendt {tid(p['ts'])}, trykkede 'Nej' {a.get('nejKlik', 0)} gange først).")
    else:
        print(f"Popup sendt {tid(p['ts'])}, venter: {navn} har ikke bekræftet endnu.")


def send(navn):
    sid, _ = find(navn)
    kald(f"/{sid}/popup", "PUT", {"ts": {".sv": "timestamp"}})
    print(f"Popup sendt til {navn}. Den dukker op med det samme, hvis han er på Studiehub, ellers næste gang han åbner den.")


if __name__ == "__main__":
    a = sys.argv[1:]
    if a and a[0] == "status":
        status(a[1] if len(a) > 1 else "Lukas")
    elif a and a[0] == "send":
        send(a[1] if len(a) > 1 else "Lukas")
    else:
        send("Lukas")
