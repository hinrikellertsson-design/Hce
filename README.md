# Kennsluvefur — frumgerð

Frumgerð af vefsvæði fyrir umsjón kennslu á matreiðslubraut: kennari heldur
utan um áfanga og verkefni, nemendur skila í skilahólf og fá endurgjöf.

**Þetta er frumgerð með uppspunnum sýnigögnum.** Hún er *ekki* tilbúin til að
geyma raunveruleg gögn um nemendur fyrr en persónuverndarþættirnir í
[`PERSONUVERND.md`](./PERSONUVERND.md) hafa verið útfærðir og skólinn hefur
samþykkt notkunina formlega.

## Tæknistafli

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + SQLite (auðvelt að skipta yfir í Postgres
  fyrir alvöru notkun)
- [Auth.js / NextAuth](https://authjs.dev) fyrir innskráningu (netfang +
  lykilorð, hlutverk kennari/nemandi)

## Að keyra verkefnið

```bash
npm install
npx prisma migrate dev   # býr til SQLite gagnagrunn út frá schema
npm run db:seed          # setur inn uppspunnin sýnigögn
npm run dev
```

Opnaðu [http://localhost:3000](http://localhost:3000). Prufuaðgangar eftir
að sáðgögn hafa verið sett inn:

- Kennari: `kennari@mk.is` / `kennari123`
- Nemandi: `nemandi1@mk.is` / `nemandi123` (einnig til `nemandi2@` og `nemandi3@`)

## Hvað er til staðar

- Kennari sér lista yfir sína áfanga, nemendur í hverjum áfanga og getur búið
  til ný verkefni.
- Kennari sér öll skil á hverju verkefni, hver hefur ekki skilað enn, og getur
  skrifað endurgjöf + einkunn.
- Nemandi sér sína áfanga og verkefni, getur skilað/uppfært skil og séð
  endurgjöf frá kennara.
- Aðgangsstýring: kennarar sjá aðeins sína áfanga, nemendur sjá aðeins sína
  skráningu — athugað í hverri aðgerð (server actions), ekki bara í viðmóti.

## Hvað vantar fyrir alvöru notkun

Sjá `PERSONUVERND.md` fyrir yfirferð á persónuverndarþáttum. Að auki, áður en
þetta yrði notað með raunverulegum nemendum, vantar m.a.:

- Skráning nemenda/kennara af skólanum (ekki handvirk sáðgögn).
- Skjala-/myndaupphal fyrir skil (nú er aðeins textareitur).
- Alvöru hýsing með gagnagrunni og öryggisafritun (SQLite-skráin hér er bara
  fyrir þróun).
- Tilkynningar (t.d. tölvupóstur) þegar endurgjöf berst eða skiladagur nálgast.
