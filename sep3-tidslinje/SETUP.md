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

Første gang siden åbnes, lægger den selv de 43 opgaver ind, sætter startdato og gruppens kode.

## Standardværdier (kan ændres direkte i Firebase)
- `sep3/config/startDate`: mandag i uge 1 (kan også ændres med knappen Startdato). Standard 2026-09-07.
- `sep3/config/pin`: gruppens kode. Standard `sne2026`.

## Sådan bruges den
- Kryds af, tilføj og ret opgaver. Første gang skal man skrive sit navn og gruppens kode.
- Navnet gemmes sammen med tidspunktet på hver afkrydsning og vises i aktivitetsloggen.
- Koden er en blød lås mod tilfældige besøgende, ikke rigtig sikkerhed. Databasereglen er åben, så tilføj ikke følsomme oplysninger.
