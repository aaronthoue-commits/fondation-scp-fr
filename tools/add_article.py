#!/usr/bin/env python3
"""Ajoute ou met à jour un article dans data/articles.json.

Exemples :
  python tools/add_article.py --slug scp-682 --titre "SCP-682" --classe Keter \
      --auteur "Auteur" --source https://fondationscp.wikidot.com/scp-682 \
      --resume "Courte accroche" --corps-fichier mon_texte.md
  python tools/add_article.py --type conte --slug mon-conte --titre "Mon conte" --auteur Moi --corps-fichier conte.md
Sans argument, le script pose les questions une par une.
"""
import argparse, json, pathlib, re, sys
DB = pathlib.Path(__file__).resolve().parent.parent / "data" / "articles.json"

def ask(label, val, required=False):
    if val is not None or not INTER:
        if val is None and required:
            sys.exit(f"Erreur : option obligatoire manquante ({label}).")
        return val
    r = input(f"{label}{' *' if required else ''} : ").strip()
    return r or None

p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
for a in ("slug", "titre", "sous-titre", "classe", "auteur", "traducteur", "source", "resume", "corps-fichier", "type", "langue"):
    p.add_argument("--" + a)
a = p.parse_args()
INTER = inter = len(sys.argv) == 1
art = {"type": a.type or ("scp" if inter is False else None)}
art["type"] = ask("Type (scp/conte)", a.type, True) if inter else (a.type or "scp")
art["slug"] = ask("Identifiant d'URL (ex. scp-682, scp-123-fr)", a.slug, True)
art["title"] = ask("Titre", a.titre, True)
art["sous_titre"] = ask("Sous-titre", a.sous_titre)
art["classe"] = ask("Classe d'objet (Sûr/Euclide/Keter/Thaumiel/Apollyon)", a.classe) if art["type"] == "scp" else None
art["auteur"] = ask("Auteur (obligatoire, licence CC BY-SA)", a.auteur, True)
art["traducteur"] = ask("Traducteur", a.traducteur)
art["source"] = ask("URL source", a.source)
art["resume"] = ask("Résumé court", a.resume)
art["langue"] = ask("Langue (fr/en)", a.langue) or "fr"
f = ask("Fichier Markdown du corps", a.corps_fichier)
art["corps"] = pathlib.Path(f).read_text(encoding="utf-8") if f else ""
if not re.fullmatch(r"[a-z0-9-]+", art["slug"] or ""):
    sys.exit("Erreur : l'identifiant doit contenir uniquement a-z, 0-9 et des tirets.")
art = {k: v for k, v in art.items() if v}
data = json.loads(DB.read_text(encoding="utf-8"))
data["articles"] = [x for x in data["articles"] if x["slug"] != art["slug"]] + [art]
data["articles"].sort(key=lambda x: x["slug"])
DB.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
print("OK :", art["slug"], "→", DB)
