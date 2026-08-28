# MK Bókanir

Bókunarkerfi fyrir hádegis- og kvöldverði á æfingum matreiðslu- og
þjónustudeildar Menntaskólans í Kópavogi. Gestir bóka sig sjálfir á vefnum;
starfsfólk stýrir hvaða æfingar eru í boði, hámarksfjölda sæta og verði, og
kerfið sendir sjálfvirkan staðfestingar- og greiðslupóst viku fyrir hverja
æfingu.

## Tæknistafla

- **Next.js 16** (App Router, TypeScript, Server Actions) — frontend og
  backend í einu verkefni.
- **Prisma 7** + **Postgres** — gagnagrunnur og gagnalíkan.
- **Tailwind CSS 4** — útlit.
- **Resend** — sjálfvirkur tölvupóstur.
- Léttur eigin innskráningarbúnaður fyrir stjórnendur (bcrypt + undirrituð
  session-kaka með `jose`) — óháður utanaðkomandi auth-þjónustu.

## Uppbygging

```
app/
  page.tsx                    — forsíða
  aefingar/                   — listi yfir opnar æfingar + bókunarform
  bokun/[token]/hafna/        — sjálfsafgreiðslu-afbókun gests
  admin/
    innskraning/              — innskráning stjórnenda
    (dashboard)/               — varið stjórnborð: æfingar, bókanir, stillingar
  actions/                    — Server Actions (bókanir, admin-aðgerðir, auth)
  api/
    cron/send-reminders/      — daglegt cron sem sendir greiðslupóst
    admin/bookings/export/    — CSV útflutningur bókana
lib/                          — Prisma client, auth, tölvupóstur, stillingar
prisma/
  schema.prisma                — gagnalíkan
  seed.ts                      — býr til fyrsta stjórnandann
```

## Gagnalíkan í hnotskurn

- **Sitting** (æfing) — dagsetning, hádegi/kvöldverður, hámarksfjöldi sæta,
  verð á sæti, titill/lýsing, staða (opið/lokað).
- **Booking** (bókun) — nafn, netfang, sími, fjöldi, athugasemd, staða
  (staðfest/afbókað), greitt-flagg, einstakur afbókunarhlekkur.
- **AdminUser** — stjórnendur sem geta skráð sig inn á `/admin`.
- **Settings** — greiðsluupplýsingar (reikningsnúmer o.fl.) sem birtast í
  greiðslutölvupóstinum — breytanlegt á `/admin/stillingar` án
  kóðabreytinga.

Laus sæti eru alltaf reiknuð sem `hámarksfjöldi − summa staðfestra bókana`,
og bókun er búin til í gagnagrunns-transaction sem læsir röð æfingarinnar
(`SELECT ... FOR UPDATE`) svo tvær samhliða bókanir geti ekki báðar farið
yfir hámarkið.

## Keyra í local þróun

1. **Postgres gagnagrunnur.** Settu upp local Postgres (eða notaðu
   Docker/Neon) og settu tengistrenginn í `.env` sem `DATABASE_URL`.
2. **Afrita `.env.example` í `.env`** og fylla út breyturnar (sjá lýsingu í
   skránni sjálfri).
3. Setja upp pakka og gagnagrunn:

   ```bash
   npm install
   npx prisma migrate dev
   ```

4. Keyra þróunarþjón:

   ```bash
   npm run dev
   ```

   Vefurinn er þá á `http://localhost:3000`, stjórnborðið á
   `http://localhost:3000/admin`.

5. Fyrsti stjórnandinn er stofnaður á vefnum sjálfum — engin skipanalína
   nauðsynleg. Farðu á `http://localhost:3000/admin/setup` og fylltu út
   netfang og lykilorð. Síðan lokar sjálfkrafa á sig eftir að fyrsti
   aðgangurinn er stofnaður — hún vísar þá áfram á innskráninguna. Ef þú
   vilt frekar nota skipanalínu er `npx prisma db seed` (les `ADMIN_EMAIL`/
   `ADMIN_PASSWORD` úr `.env`) til staðar sem valkostur.

   Ef `RESEND_API_KEY` er ekki sett birtast tölvupóstar í console-glugganum
   í stað þess að vera sendir — hentugt fyrir þróun.

## Setja upp fyrir alvöru notkun (Vercel)

1. **Gagnagrunnur.** Búðu til Postgres gagnagrunn (t.d. Vercel Postgres eða
   Neon) og settu `DATABASE_URL` sem umhverfisbreytu í Vercel-verkefninu.
   Build-skrefið (`prisma migrate deploy && next build`, sjá `package.json`)
   setur sjálfkrafa upp allar töflur í hverri byggingu — engin handvirk
   skipun nauðsynleg. Farðu svo á `/admin/setup` á vefnum eftir að hann er
   kominn í loftið til að búa til fyrsta stjórnandann (sjá að ofan).
2. **Resend.** Búðu til aðgang á [resend.com](https://resend.com), settu
   `RESEND_API_KEY`. Staðfestu sendingarlén skólans (t.d. `mk.is` eða
   undirlén eins og `bokanir.mk.is`) með DNS-færslunum sem Resend gefur upp
   — annars lendir tölvupósturinn líklega í ruslpósti eða skilar sér ekki.
   Uppfærðu `EMAIL_FROM` í samræmi við staðfest lén.
3. **`SESSION_SECRET`** og **`CRON_SECRET`** — búðu til með
   `openssl rand -base64 32` fyrir hvora breytu og settu í Vercel.
   Vercel bætir sjálfkrafa `Authorization: Bearer $CRON_SECRET` hausnum við
   þegar það kallar á cron-slóðina, svo ekkert annað þarf að stilla — cron
   tímasetningin er þegar skilgreind í `vercel.json`.
4. **`NEXT_PUBLIC_SITE_URL`** — settu á endanlegu slóðina (t.d.
   `https://bokanir.mk.is`) svo hlekkir í tölvupósti virki rétt.
5. **Greiðsluupplýsingar** — skráðu reikningsnúmer, kennitölu og texta á
   `/admin/stillingar` eftir að síðan er komin í loftið.

### Að bæta við kortagreiðslu síðar

Í dag er eingöngu stuðst við millifærslu: kerfið sendir greiðsluupplýsingar
í tölvupósti viku fyrir viðburð. Ef bæta á við kortagreiðslu (t.d.
Rapyd/Teya/Valitor) síðar meir er eðlilegast að gera það sem valkost við
bókun: `Booking`-taflan hefur nú þegar `isPaid`-flaggið sem grunn að
greiðslustöðu, og því þarf einkum að (1) bæta greiðslu-skrefi við
bókunarflæðið í `app/aefingar/[id]/booking-form.tsx` og
`app/actions/bookings.ts`, og (2) taka við vefkróki (webhook) frá
greiðslumiðlaranum sem uppfærir `isPaid`/bókunarstöðu.

## Prófun

```bash
npm run lint
npm run build
```

Fyrir enda-til-enda próf: keyrðu `npm run dev`, búðu til æfingu í
stjórnborði, bókaðu borð sem gestur, athugaðu að tölvupóstar birtist (eða
sendist ef `RESEND_API_KEY` er sett), og prófaðu afbókunarhlekkinn. Hægt er
að prófa daglega áminningarpóstinn handvirkt með:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/send-reminders
```
