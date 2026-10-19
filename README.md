# Fondation SCP – version française (site statique)

Interface inspirée du site de la branche francophone, en HTML/CSS/JS pur : aucune installation, publiable tel quel sur **GitHub Pages**.

## Publier
1. Créez un dépôt GitHub et poussez ce dossier à la racine.
2. *Settings → Pages → Deploy from a branch → `main` / `(root)`*.
3. Le site est en ligne sur `https://<vous>.github.io/<depot>/`.

Test local : `python3 -m http.server` puis http://localhost:8000.

## Ajouter un article
```
python3 tools/add_article.py            # mode questions/réponses
python3 tools/add_article.py --slug scp-682 --titre "SCP-682" --classe Keter --auteur "…" --corps-fichier texte.md
```
Le corps s'écrit en Markdown simple (titres `##`, listes `-`, `**gras**`, `*italique*`, `> citation`, liens, images `assets/…`). Les numéros `scp-XXX` / `scp-XXX-fr` s'insèrent automatiquement dans les grilles des séries.

## Vos assets
Déposez votre logo dans `assets/logo.svg` (remplace le placeholder) et vos images dans `assets/`.

## Licence et crédits
Les textes SCP sont sous **CC BY-SA 3.0** : indiquez toujours l'auteur et la source de chaque article. Les trois articles fournis ne sont que des résumés d'exemple à remplacer par les traductions complètes. Projet de fans, non officiel.
