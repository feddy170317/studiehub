# SEP3 Fremdriftsplan: opsætning

Data ligger i Firebase Realtime Database (projekt `via-quiz`) under noden `sep3`.

## Ét engangstrin i Firebase
Console, Realtime Database, Rules. Tilføj ved siden af de eksisterende nøgler (husk komma) og tryk Publish:

```
"sep3": {
  ".read": true,
  ".write": true
}
```

Første gang siden åbnes, lægger den selv de 43 opgaver ind og sætter startdato.

## Standardværdier
- `sep3/config/startDate`: mandag i uge 1 (kan også ændres med knappen Startdato). Standard 2026-09-07.

## Sådan bruges den
- Der er ingen kode. Man skriver kun sit navn første gang (gemmes i browseren, kan skiftes).
- Opgaver har tre trin: ikke startet, i gang (med navn og startdato) og færdig (med navn og tidspunkt).
- Start tager opgaven, så de andre kan se den er taget. Giv slip frigiver den igen. Færdig lukker den.
- Ansvarlig kan sættes på forhånd i opgavens detaljer, også før nogen er startet.
- Arbejdsoverblikket viser Bagud (uge slut er passeret), I gang, Næste op (denne og næste uge) og Senere.
- Databasereglen er åben, så læg ikke følsomme oplysninger i planen.
