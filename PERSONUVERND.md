# Persónuvernd — hvað þarf að leysa áður en þetta fer í alvöru notkun

Þetta kerfi geymir gögn um nafngreinda nemendur (verkefnaskil, endurgjöf,
einkunnir) — það er persónuvinnsla samkvæmt persónuverndarlögum
(nr. 90/2018) og GDPR, og þar sem margir nemendur á framhaldsskólastigi geta
verið undir 18 ára eru kröfurnar strangari. Þessi listi er ekki
lögfræðiráðgjöf, heldur verkefnalisti yfir það sem þarf að skoða/leysa með
skólanum (t.d. persónuverndarfulltrúa MK) áður en raunveruleg gögn fara inn.

## 1. Ábyrgð og lagagrundvöllur
- [ ] Hver er ábyrgðaraðili vinnslunnar — þú sem kennari eða MK sem stofnun?
      Í reynd er það yfirleitt skólinn, ekki einstakur kennari, sem ber ábyrgð
      á kerfum sem geyma nemendagögn. Þetta þarf að staðfesta formlega áður en
      kerfið er tekið í notkun.
- [ ] Skýr lagagrundvöllur fyrir vinnsluna (t.d. framkvæmd kennslu sem hluti af
      lögbundnu hlutverki skólans) — líklega ekki þörf á samþykki hvers og eins
      ef vinnslan er nauðsynleg fyrir kennslu, en það þarf að meta.
- [ ] Vinnslusamningur (DPA) milli skóla og hýsingaraðila ef gögn eru vistuð
      hjá utanaðkomandi þjónustu.

## 2. Hýsing og gagnaflutningur
- [ ] Gögn vistuð innan EES (eða hjá aðila með fullnægjandi persónuverndar-
      samning ef utan EES).
- [ ] Dulkóðun í flutningi (HTTPS alls staðar) og í hvíld (dulkóðaður
      gagnagrunnur/diskur).
- [ ] Reglulegar öryggisafritanir og ferli til að endurheimta gögn.

## 3. Aðgangsstýring
- [ ] Nemandi sér aðeins sín eigin gögn, kennari sér aðeins sína áfanga — þetta
      er nú þegar útfært í kóðanum (sjá `src/lib/actions.ts`), en þarf að
      standast raunverulega öryggisúttekt, ekki bara virka í viðmóti.
- [ ] Sterk innskráning — íhuga innskráningu í gegnum skólakerfi (t.d.
      Innu/Teams/Google Workspace fyrir MK) í stað sérstaks lykilorðs, svo
      aðgangsorð margfaldist ekki og skólinn haldi yfirsýn yfir notendur.
- [ ] Atferlisskráning (audit log) yfir hver skoðar/breytir gögnum um hvaða
      nemanda, svo hægt sé að rekja aðgang ef spurt er.

## 4. Réttindi nemenda (og forsjáraðila fyrir ólögráða)
- [ ] Upplýsingar til nemenda (og forsjáraðila ef yngri en 18 ára) um hvaða
      gögn eru skráð, í hvaða tilgangi og hversu lengi.
- [ ] Ferli til að nemandi/forsjáraðili geti óskað eftir afriti af gögnum eða
      eyðingu þeirra.
- [ ] Skýr varðveislutími — t.d. gögnum eytt X misserum eftir að áfanga lýkur,
      ekki geymt ótímabundið "bara ef".

## 5. Öryggi í daglegri notkun
- [ ] Tveggja þátta auðkenning fyrir kennara (aðgangur að gögnum margra
      nemenda gerir kennaraaðgang að viðkvæmustu marki kerfisins).
- [ ] Ferli fyrir öryggisatvik (t.d. ef aðgangsorð kennara lekur) — hver er
      látinn vita og hvað er gert.
- [ ] Takmörkun á hvers konar gögnum er safnað — t.d. forðast að biðja um
      viðkvæmari upplýsingar en nauðsynlegt er fyrir kennsluna sjálfa.

## Praktísk tillaga

Frekar en að reka þetta sem alveg sjálfstætt kerfi, er oft einfaldara og
öruggara að:

1. Athuga hvort MK er nú þegar með LMS (Innu, Moodle, Teams for Education) —
   ef svo er, nýta það fyrir skilahólf/einkunnir, því þá ber skólinn þegar
   ábyrgðina og hefur unnið persónuverndarvinnuna.
2. Nota þetta kerfi (eða eitthvað í þessa átt) sem viðbót sem heldur ekki
   utan um persónugreinanleg gögn sjálft — t.d. yfirlit yfir verkefni og
   hæfniviðmið sem nemendur nálgast í gegnum innskráningu skólans, á meðan
   sjálf skilin/einkunnirnar eru áfram í opinbera kerfinu skólans.
3. Ef sérsniðna leiðin er valin, fá formlegt samþykki og skoðun frá
   persónuverndarfulltrúa MK áður en fyrsti raunverulegi nemandinn er
   skráður inn — ekki eftir á.
