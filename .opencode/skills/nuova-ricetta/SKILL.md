---
name: nuova-ricetta
description: "Crea una nuova ricetta in questo ricettario Astro, in src/content/recipes/NOME-SLUG.md, con lo standard di biscotti-al-cioccolato.md: frontmatter completo, ingredienti con quantità e unità, controllo aritmetico tra porzioni e quantità, procedura, conservazione, varianti, immagine, verifica con npm run build. Usalo SEMPRE quando l'utente porta una ricetta da mettere nel ricettario, anche senza chiederlo: \"ho trovato questa ricetta, aggiungila\", \"metti questa nel ricettario\", \"aggiungi la ricetta della carbonara\", \"inserisci questa ricetta\", \"nuova ricetta: ...\", o quando chiede di sistemare una ricetta già presente. La verifica online esiste ma parte solo se la chiede a parole (\"controlla le dosi sul web\", \"validala online\"): usa webfetch sul link o websearch su più fonti, confronta le proporzioni per 100 g di ingrediente strutturante e riporta in chat le differenze senza cambiare le dosi di nascosto."
---

# Nuova ricetta

Il ricettario è una content collection Astro: ogni ricetta è **un file markdown piatto in `src/content/recipes/`** e lo schema che decide se è valida sta in `src/content.config.ts`. Questo skill serve a trasformare una ricetta (dal web, da un libro, dalla nonna, o dalla testa di chiunque) in un file che passi lo schema e che si legga come le altre.

## Flusso

1. **Leggi i riferimenti** (vedi sotto) — ti dicono il tono e la struttura, che non si inventano.
2. **Ricava i dati**: titolo, categoria, porzioni, tempi, lista ingredienti, procedura. Se l'utente incolla una ricetta straniera, traduci i nomi degli ingredienti in italiano ma lascia i nomi delle tecniche riconoscibili (`mise en place`, `blanch`, `brunoise` → dillo in italiano con il termine originale tra parentesi solo se serve).
3. **Scegli la via facile** (vedi "Il piatto deve essere facile da fare"): a parità di piatto, valuta sempre la versione con meno ingredienti, meno strumenti e meno tegami. È il passaggio che decide se la ricetta verrà fatta o abbandonata a metà.
4. **Fai il controllo aritmetico** (vedi "Controllo aritmetico"): è gratuito, ci mette dieci secondi e va fatto sempre, anche senza aprire il web.
5. **Verifica online, solo se l'utente la chiede esplicitamente** (vedi "Verifica online"). Non cercare ricette su internet di tua iniziativa: le ricette hanno dosi regionali che vanno bene anche se non corrispondono alla media, e la ricetta della nonna non è un errore solo perché il web dice un'altra cosa.
6. **Scrivi il file** in `src/content/recipes/<slug>.md` e nient'altro. Non creare cartelle, non toccare `content.config.ts`, non modificare le altre ricette, non registrare la ricetta da nessuna parte (il glob le prende da solo e la home la mostra automaticamente).
7. **Verifica con il build** (vedi "Verifica").

## Il piatto deve essere facile da fare

Il default è `difficulty: facile`, e va guadagnato il contrario. Una ricetta esiste per essere eseguita da qualcuno che non ci sta pensando: se tra la prima e l'ultima riga deve prendere due decisioni, la ricetta è sbagliata.

- **A parità di piatto, vince il metodo più semplice.** Zucchine a fette cotte con la cipolla invece di frullate in crema: stesso risultato, nessun frullatore, 6 passi invece di 7. Un risotto senza vino è un risotto più facile, e quasi nessuno nota il vino assente.
- **Togli tutto ciò che il piatto non cambia.** Un sugo di soffritto e acqua è indistinguibile dal sugo a otto ingredienti se poi copri tutto con burro e parmigiano. Ogni ingrediente in più è un passaggio, una riga di spesa e una cosa che può finire esaurita in dispensa.
- **Meno strumenti.** Frullatore ad immersione, termometro, planetaria, colino: due strumenti per una ricetta da 30 minuti sono un vezzo, non una tecnica. Se la consistenza che cerchi si può ottenere anche senza, lo strumento non serve.
- **Un tegame, per quanto possibile.** Ogni tegame in più è un passaggio in più (travasare, lavare, scaldare) e un momento in cui il piatto si raffredda. Se tutto si fa in una pentola, si fa in una pentola.
- **Meno passi, ma pieni.** Non si tratta di accorpare: otto micro-passi ("scolare", "asciugare", "tagliare") sono peggio di quattro passi che contengono ognuno due cose da fare. Un passo vale quanto le azioni reali che contiene, e un passo senza azioni è solo un titolo.
- **Se una tecnica si può sbagliare, scelgine un'altra.** Glassature, il punto di cottura esatto di una crema, lievitazioni a mano: se esiste un metodo più tollerante che dà un piatto accettabile, preferiscilo. La tecnica dura si tiene solo se è *il* piatto e non una sua versione.

Esempio, lo stesso piatto in due versioni:

| | versione complicata | versione facile |
| --- | --- | --- |
| zucchine | frullate in crema, cotte a parte | a fette, cotte con la cipolla |
| tegami | due, più la pentola del riso | uno |
| strumenti | frullatore ad immersione, mestolo per la crema | nessuno |
| passi | 7, con due momenti in cui il piatto si raffredda | 6, tutto in sequenza |
| vino | sì, sfumatura in un momento separato | no |

Il risultato in tavola è lo stesso. Scegli la seconda riga.

## Leggi prima di scrivere

- `src/content/recipes/biscotti-al-cioccolato.md` — **è lo standard di riferimento**: frontmatter completo, `Consigli`, varianti, immagine. Se hai un dubbio su come scrivere qualcosa, la risposta è in quel file.
- `src/content/recipes/tiramisu.md` e `parmigiana.md` — esempi più essenziali, utili per capire quanto è essenziale una sezione (`Consigli` non è obbligatorio: entrambi non ce l'hanno).
- `src/content.config.ts` — l'elenco esatto dei valori ammessi. In caso di dubbio, lì c'è la risposta.

## Frontmatter

Obbligatori: `title`, `category`, `servings`, `ingredients`. Tutto il resto è opzionale ma quasi tutto merita di esserci, perché ogni campo alimenta un filtro della home o un meta tag.

```yaml
---
title: Pulled pork
description: Maiale sfilacciato cotto lentamente, con crosticina dolce e salsa BBQ.

category: secondo

tags:
  - forno
  - cena con amici

servings: 6

cuisine: americana
season: estate

prepTime: 25
cookTime: 300

difficulty: media

ingredients:
  - quantity: 1.5
    unit: kg
    item: spalla di maiale

  - quantity: 8
    unit: g
    item: sale maldon
  ...
---
```

Regole campo per campo:

- **`title`** — il nome del piatto come lo chiameremmo a tavola, in italiano. È l'`h1` e il `<title>` della pagina.
- **`description`** — una frase sola, 60-90 caratteri, che dà il gancio (sapore, consistenza, occasione). Finisce nel `meta description`: è il testo che si vede su Google e nelle condivisioni, quindi non è un commento interno.
- **`category`** — obbligatoria, uno di: `antipasto`, `primo`, `secondo`, `contorno`, `dolce`, `piatto unico`, `bibita`, `salse/basi`. Decide il colore del badge, la sezione della home in cui la ricetta finisce e l'emoji della card.
- **`tags`** — **riusa i tag che esistono già** nella cartella, altrimenti crei chip di filtro che non combaciano con nessun'altra ricetta. Fai un giro veloce con `grep -A3 "^tags:" src/content/recipes/*.md` prima di sceglierli. I tag esistenti includono `forno`, `cena con amici`, `vegetariano`; aggiungine di nuovi solo per concetti davvero nuovi (dieta, occasione, tecnica).
- **`servings`** — numero di porzioni reali **per le quantità scritte nel file**. Non è decorativo: è il divisore con cui la pagina ricalcola ogni ingrediente quando l'utente preme i pulsanti +/−.
- **`cuisine`** — uno di `italiana`, `colombiana`, `messicana`, `asiatica`, `americana`, `altro`. Se la ricetta non è di una cucina precisa, `altro` va bene.
- **`season`** — uno di `primavera`, `estate`, `autunno`, `inverno`, `tutto l'anno`. Mettilo solo se è onesto (una minestra d'inverno con `tutto l'anno` non serve a nessuno).
- **`prepTime` / `cookTime`** — minuti interi, `prepTime` = lavoro attivo, `cookTime` = forno/riposo. Se non c'è cottura: `0` (la pagina scrive "Nessuna") oppure ometti il campo, come preferisci.
- **`difficulty`** — il default è `facile` e va guadagnato il contrario. `media` solo per una tecnica sola, spiegata bene nel passo, che si può sbagliare (una glassatura, un punto di cottura esatto). `difficile` quasi mai, e solo se la tecnica è *il* piatto e non una sua versione più tollerante. Se ti viene `media` senza sapere dire quale passaggio è quello difficile, è `facile`. Vedi "Il piatto deve essere facile da fare".

### Numeri e unità

- `quantity` è un **numero YAML**, mai una stringa: `175` e non `"175"`, `150 g` e non `150g`. Se è una stringa, la pagina smette di scalare gli ingredienti.
- Le frazioni sono decimali con il **punto** (la virgola romperebbe lo YAML): `0.5` mezzo cucchiaino, `0.33` un terzo.
- I valori con `/` o `'` vanno tra virgolette: `season: "tutto l'anno"`, `category: "salse/basi"`.
- Unità in uso nel progetto: `g`, `kg`, `ml`, `l`, `cucchiaino`, `cucchiai`, `qb`.
  - `qb` (quanto basta) si scrive `quantity: 1` + `unit: qb`, ed è il modo giusto per sale, pepe e spezie: la pagina lo stampa come "q.b." e **non lo moltiplica** quando si cambiano le porzioni.
  - Per ciò che si conta, (uova, mele, banane) non scrivere l'unità
- Ordina gli ingredienti dal più strutturante al più accessorio, come fa la ricetta dei biscotti: farina → grassi → zuccheri → uova → aromi → lievito → extra.

## Corpo della ricetta

Tre sezioni, headings di secondo livello (il CSS ci mette sotto una riga di separazione).

```markdown
## Preparazione

1. **Preparare la carne**
   Sigillare il maiale in una pentola con un filo di olio, poi condire generosamente con sale.

2. **Cottura lenta**
   Cuocere a **150°C** con il coperchio per **4-5 ore**, fino a quando la carne si stacca con le forbici.

## Conservazione

Tenere in frigorifero per **3 giorni** coperto con pellicola, e riscaldare in forno lentamente.

## Consigli

Se vuoi raddoppiare la dose, raddoppia anche la salsa: con la stessa quantità di carne resta più asciutta.
```

- **Verbi all'infinito**, mai imperativo: `Preparare`, `Cuocere`, `Lasciare`, `Tagliare`. È la convenzione di tutte e tre le ricette esistenti e dà alla pagina il tono da ricettario di casa.
- Ogni passo è un `**Titolo breve**` (2-4 parole) seguito dalla frase, **indentata di 3 spazi** per restare dentro la voce della lista. Il titolo diventa il nome del passo a schermo, la frase il dettaglio.
- **Il grassetto dentro la frase è un segnale visivo, non un accento**: la pagina colora in rosso i valori in grassetto, quindi mettilo solo su temperature, minuti, pesi e indizi di cottura ("fino a doratura", "ancora chiaro al centro"). Il resto della frase resta in nero.
- La numerazione dei passi deve essere **sequenziale** nel sorgente. (Nei biscotti c'è un 1, 3, 4... per un refuso: il markdown rinumera da sé a schermo, ma il file deve restare pulito.)
- `## Conservazione` serve sempre: tempi concreti, dove, e come si riscalda.
- `## Consigli` solo se hai qualcosa di vero da dire — la regola che usi tu quando cuoci (sostituzioni, come gestire gli avanzi, come evitare che si rovini e con cosa abbinarlo). Niente consigli generici tipo "cuocere con amore": se non scriveresti quello a un amico in cucina, non scriverlo qui. Due o tre frasi in voce "noi", come fa la ricetta dei biscotti.

## La procedura deve essere operativa

Un passo deve potersi eseguire leggendolo una volta sola, senza rileggerlo e senza dover chiedere "quanto?", "quanto deve cuocere ancora?", "e adesso?". Chi lo legge non ha la ricetta in testa e non ha tempo da perdere: è già in cucina.

- **Il passo dice cosa fare, non di che cosa parla.** Il titolo nomina l'azione (`Preparare il soffritto`), ma è la frase dopo che deve essere l'istruzione. Un titolo senza frase è un titolo, non un passo.
- **Via gli avverbi che non aggiungono niente.** "cuocere adeguatamente", "mescolare bene", "fino a cottura", "a piacere" (senza dire di cosa), "a seconda del caso". Ogni volta che ne scrivi uno, sostituiscilo con qualcosa di misurabile: un tempo, un colore, un odore, una consistenza.
- **Un tempo da solo non basta mai.** 8 minuti a fuoco vivo e 8 minuti a fuoco dolce non sono lo stesso tempo, e 8 minuti di pentola grande e di pentola piccola non sono lo stesso tempo. A ogni durata abbinare lo stato che devi vedere quando è passata.
- **L'indizio deve essere qualcosa che il cuoco può percepire**, non una misura che non ha:
  - colore — "finché i bordi sono dorati e il centro ancora chiaro"
  - odore — "finché non ha più l'odore acre del concentrato"
  - consistenza — "il riso è pronto quando, scuotendo il tegame, fa un'onda che scorre e si richiude"
  - rumore — "finché non si sente più sfrigolare l'olio"
  - tempo residuo — "dovrà cuocere altri 5 minuti"
- **Nei tempi di attesa, dì cosa fare.** Il forno sta acceso 30 minuti: di' cosa preparare nel frattempo e cosa lasciare fuori dal frigo, e quando. Un passo che è solo un'attesa sprecata il tempo che descrive.
- **Dì dove mettere le cose.** "Tenere da parte" senza indicare il postovuol dire una ciotola sul bancone e poi roba fredda nel tegame.
- **Con due pentole, di' a cosa serve ciascuna**, altrimenti finisce il "ma quale era il sugo?".
- **Non ripetere il passo prima.** "Continuare a mescolare" è un legamento e va bene; "aggiungere poi tutti gli altri ingredienti" è un passo vuoto.

```
Cattivo: Scaldare l'olio e far soffriggere la cipolla tritata per 5 minuti, poi aggiungere il riso.

Buono:   Scaldare l'olio in una pentola capiente a fuoco medio e far appassire la cipolla
          tritata finemente per **5 minuti**, senza che prenda colore: deve restare trasparente
          e tenera, mai dorata. Quando non si sente più sfrigolare l'olio, è pronta: a quel
          punto versare il riso e mescolare.
```

## Niente passi di riempimento

L'ultimo passo è quello che il lettore usa per capire quando può smettere, ed è anche quello che si riempie più spesso di aritmetica che non è un'operazione di cucina.

Da non scrivere mai, né come ultimo passo né altrove:

- "Tagliare la torta in 8 fette", "tagliare in 12 pezzi"
- "Servire in 4 piatti", "disporre nei piatti", "sistemare in una ciotola"
- "Spargere il burro a crudo e portare in tavola" quando è solo il punto in cui il piatto smette di stare in piedi

Il motivo è pratico, non estetico: la divisione in porzioni è già il lavoro del campo `servings` e dei pulsanti +/− della pagina. Ripeterla nella procedura crea una **seconda fonte di verità che può contraddirsi**, ed è esattamente da lì che nasce una ricetta che dice "8 fette" con `servings: 6`. In più non insegna niente, ed è il passo che nessuno legge.

Cosa scrivere al suo posto, nell'ordine di preferenza:

1. **L'indizio di pronto**, che è il passo più importante in assoluto
2. **La finitura**: cosa si aggiunge alla fine e quanto ("burro e parmigiano fuori dal fuoco, mescolando energicamente")
3. **Il momento del servizio**, quando c'è un motivo per cui conta ("si serve subito, il riso non aspetta")
4. **Come si regge il piatto**, se è un'operazione vera ("coprire con carta forno e tenere in forno spento, con il forno ancora caldo, per 10 minuti")

Se il numero di pezzi serve davvero per un'operazione — una torta da tagliare prima di sfornare, un pane da incidere — scrivi **solo l'operazione**, senza la divisione in porzioni. Il conto sulle porzioni resta nel "Controllo aritmetico", che è un controllo e non un commento.

```
Cattivo: 7. Tagliare la torta in 8 fette e servire nei piatti.

Buono:   7. Togliere la carta forno e tagliare in 8 fette con un coltello seghettato, mentre è
             ancora tiepida: le fette restano pulite e non si sbriciolano. Servire subito.
```


## Varianti

Facoltative, e solo se sono 1-2 varianti che valgono davvero la pena (una versione senza lattosio, un'altra al limone). Se la ricetta è una sola cosa, non aggiungerle: la UI li mette in fila come pillole e tre varianti diventano un muro.

```yaml
variants:
  - name: Alla canella
    description: impana le palline crude con zucchero e canella
    ingredients:
      - quantity: 175
        unit: g
        item: farina bianca
      ...tutta la lista, dall'inizio...
```

- `name`: 2-3 parole, è il testo della pillola (`Alla canella`, `Con olio di cocco`).
- `description`: una riga che dice **cosa cambia** rispetto all'originale. Appare in un box giallo sopra la lista.
- `ingredients`: la lista **completa**, non un diff rispetto all'originale. Attenzione: la pagina scala tutte le varianti sul `servings` principale, quindi ogni variante deve stare in piedi da sola per quel numero di porzioni. Se l'originale usa i divisori, la variante li ripete: stessi nomi, stessi gruppi.

### Divisori di sezione

Quando la ricetta si prepara in fasi distinte (`per le mele`, `per l'impasto`, `per la copertura`, `per il sugo`), raggruppa la lista: la pagina stampa un'intestazione prima di ogni gruppo e la copia della lista per la spesa la riporta. Il gruppo è una voce con `name` e `items`, e dentro ci sono le normali voci ingrediente:

```yaml
ingredients:
  - name: per le mele
    items:
      - quantity: 1.3
        unit: kg
        item: mele grandi

      - quantity: 40
        unit: g
        item: burro

  - name: per l'impasto
    items:
      - quantity: 100
        unit: g
        item: farina
```

- I due stili sono equivalenti e si possono mescolare nella stessa ricetta: una voce senza `items` sta fuori da ogni divisore.
- I nomi si scrivono **come nel tuo elenco di lavoro**, quindi minuscoli (`per la copertura`): la pagina li mette in maiuscolo da sé.
- 2-4 gruppi: se sono due (`per la salsa`, `per il pesce`) è già un muro, valuta la lista piatta.
- Con i divisori non serve più distinguere l'ingrediente nel nome (`zucchero di canna per la copertura` diventa `zucchero di canna` dentro `per la copertura`).

## Immagine

1. Guarda `public/images/recipes/` e vedi se c'è già un file che fa per questa ricetta.
2. Se c'è, `image:` è il path **dentro `public/`**, senza il `base`: `image: /images/recipes/pulled_pork.jpg`. I componenti (`src/components/RecipeCard.astro` e `src/pages/recipes/[slug].astro`) aggiungono da soli `import.meta.env.BASE_URL` davanti a quel path, quindi aggiungere `/cookbook` a mano darebbe `/cookbook/cookbook/images/...` e l'immagine non si vedrebbe.
3. Se il file non esiste, **ometti il campo**: la card mostra il placeholder con l'emoji della categoria, che è meglio di un'immagine rotta. Non generare path che puntano a file inesistenti.

## Controllo aritmetico

Questo passaggio non usa il web e va fatto **sempre**: dieci secondi di carta e matita che valgono più di qualunque ricerca.

Il controllo è uno solo, ed è quello che quasi nessuno fa: **la massa (o il volume) degli ingredienti deve essere divisibile per `servings` con una porzione che abbia senso a tavola.**

- Somma le quantità. Sale, pepe e spezie in `qb` non contano, sono trascurabili. Sottrai i liquidi che evaporano (burro, olio, vino) e ricorda che il verdura cotta e il riso perdono acqua: la porzione servita pesa meno della somma degli ingredienti.
- Dividi per `servings`, e controlla che la porzione risultante sia una porzione reale. Riferimenti pratici: una pasta 80-100 g a testa, un secondo 180-250 g, un dolce 90-120 g, una zuppa 300-400 ml, un risotto 300-400 g.
- Se la porzione esce sproporzionata, correggi `servings`. È il campo che guida anche i pulsanti +/− della pagina, quindi è il numero che non deve mentire.
- Se un numero di pezzi compare nella procedura ("formare 15 palline", "incidere 4 tagli"), deve tornare con `servings`: 15 palline da 40 g sono 600 g, quindi `servings: 6`, non `servings: 4`.

Esempio: 400 g di impasto con `servings: 6` fanno 67 g a fetta, che è porto abbondante per un biscotto e giusto per una fetta di torta. Il dubbio va risolto sul campo, prima di scrivere: se il piatto è un dolce da fette, `servings: 6` va bene e non c'è da cambiare nient'altro — e nel file la divisione in fette **non si scrive**, perché è il lavoro del campo `servings`.

Quando il calcolo torna, non scriverlo nel `.md`: è un controllo, non un commento.

## Verifica online (solo se richiesta)

Non cercare ricette su internet di tua iniziativa.

Entra in questa sezione solo su richieste esplicite: "validala online", "controlla le dosi sul web", "verifica che le proporzioni siano giuste", "questa ricetta è sbagliata?", oppure se l'utente ti passa un link e vuoi che tu lo controlli prima di scrivere.

**Come si legge la fonte**

- Con un URL in mano usa `webfetch` su quella pagina: è la ricetta originale, di solito la versione più affidabile, mentre la ricerca ti porta su copie e adattamenti.
- Sulla pagina cerca il **JSON-LD** (`application/ld+json`, `schema.org/Recipe`): contiene quantità, tempi e porzioni in forma strutturata, mentre il testo visibile è pieno di banner, newsletter e paywall.
- Se invece l'utente descrive il piatto a parole, usa `websearch` e prendi 2-3 ricette analoghe. Una sola fonte non basta: ti dice solo cosa fa quella fonte.

**Come si confrontano ricette diverse**

Il trucco che rende confrontabili ricette con scale diverse: **normalizza tutto a 100 g dell'ingrediente strutturante** (farina, pasta, riso, patate, verdura principale) e guarda solo i rapporti. Le quantità assolute servono a poco, i rapporti servono a tutto.

| per 100 g di farina | Fonte A | Fonte B | La tua ricetta |
| --- | --- | --- | --- |
| grassi | 65 | 56 | ? |
| zucchero totale | 89 | 98 | ? |
| quota di zucchero scuro | 52 | 67 | ? |
| uovo | 29 | 29 | ? |
| lievito (in cucchiaini) | 0,33 | 0,29 | ? |

Con questa tabella uno scostamento si vede subito, mentre due righe di numeri grezzi no.

A proposito della terza colonna: una differenza non è per forza un errore. Se il tuo lievito è la metà della media e la ricetta è volutamente densa e poco gonfia, il file va bene così com'è e l'unica cosa da fare è dirlo in chat.

**Cosa guardare**

- Proporzioni grassi/zuccheri/uova rispetto alla struttura
- Dose di lievito e agenti lievitanti: è l'errore più comune e il meno visibile in partenza
- Temperatura: statico e ventola stanno 20 °C diversi. Nel ricettario la convenzione è il forno statico (la ricetta dei biscotti scrive "forno statico a 180°C")
- Tempi, e soprattutto gli **indizi** di cottura ("fino a doratura", "il centro resta chiaro"): un tempo senza indizio è un tempo sbagliato da scrivere
- Coerenza con i tempi dichiarati in `prepTime` / `cookTime`

**Cosa non fare**

- Non citare le fonti nel `.md`. Il ricettario è di casa, non un articolo: nel file finisce la ricetta, pulita. I link stanno nella conversazione, se servono.
- Non riscrivere la ricetta dell'utente con quella di una fonte. Se una fonte è migliore, è un'altra ricetta.
- Non inseguire la precisione che non conta. Un terzo di cucchiaino di bicarbonato è difficile da misurare in cucina, ma sostituire un terzo con mezzo non "corregge" la ricetta: segnalalo e lascia decidere.
- Non cambiare le dosi di nascosto. Riporta in chat la diff concreta — "sulla mia il lievito è la metà, vuoi che lo raddoppi?" — e decidi tu con l'utente.

## Verifica

Il build è l'unico controllo automatico di questo progetto (non ci sono lint né test):

```sh
npm run build
```

Se il terminale è PowerShell e blocca gli script (`Impossibile caricare il file ... npm.ps1`), usa `& cmd.exe /c "npm run build"`.

Se lo schema rifiuta il file, l'errore è del tipo `InvalidContentEntryDataError` e ti dice il campo esatto e il valore atteso. Correggi e rilancia: non lasciare il build rosso. Un `npm run build` che passa non garantisce che la ricetta sia bella, ma garantisce che sia pubblicabile — poi rileggi il file con occhi da cuoco e chiediti se si capisce tutto senza leggere due volte.

## Checklist prima di dichiarare finito

- [ ] Un solo file nuovo in `src/content/recipes/`, nome in kebab-case senza accenti né spazi
- [ ] `category`, `servings` e `ingredients` presenti; quantità come numeri, decimali con il punto
- [ ] **È la versione facile**: nessun ingrediente, tegame o strumento che si possa togliere senza cambiare il piatto; `difficulty` è `facile` se non sai dire quale passaggio è quello difficile
- [ ] Controllo aritmetico fatto: la somma delle quantità divisa per `servings` dà una porzione che ha senso a tavola, e i numeri citati nei passi concordano
- [ ] I tag sono già usati altrove nella cartella
- [ ] Passi in infinito, numerazione sequenziale, grassetto solo sui valori utili
- [ ] **Ogni passo con un tempo ha anche il suo indizio di cottura** nella stessa frase, e l'ultimo passo dice come si capisce che è pronto
- [ ] **L'ultimo passo finisce sul piatto**, non su un conteggio: nessun "taglia in 8 fette", nessun "servi in 4 piatti"
- [ ] Nei tempi di attesa si dice cosa fare nel frattempo
- [ ] `Conservazione` presente, `Consigli` solo se c'è qualcosa di vero
- [ ] Varianti con la lista completa, se presenti
- [ ] Se la ricetta ha fasi di preparazione distinte, i divisori di sezione sono al posto giusto (e le varianti li ripetono)
- [ ] `image` solo se il file esiste davvero, e senza il base (i componenti lo aggiungono)
- [ ] Verifica online fatta **solo** se l'utente l'ha chiesta, e in quel caso riportata in chat con le fonti
- [ ] `npm run build` passa
- [ ] Nessun altro file toccato

## Errori che si vedono spesso

| Sintomo | Causa |
| --- | --- |
| Le quantità non cambiano con i pulsanti +/- | `quantity: "175"` come stringa invece di numero |
| Errore YAML su `description` o `season` | `:` o `'` non quotati: `description: "Sale in testa: come si fa."`, `season: "tutto l'anno"` |
| Step che saltano un numero | Numerazione non sequenziale nel sorgente |
| La variante ha 2 ingredienti | Le varianti vogliono la lista intera, non il differenziale |
| Immagine che non si vede | `image:` ha il `/cookbook` scritto a mano: i componenti aggiungono già il base |
| La ricetta finisce nella sezione sbagliata | `category` con un valore fuori dall'enum in `content.config.ts` |
| I biscotti vengono piatti | Le dosi di lievito hanno senso solo se la ricetta è pensata per essere densa: controlla, non dare per scontato |
| La ricetta si finisce con "taglia in 8 fette" o "servi in 4 piatti" | Passo di riempimento: la divisione in porzioni è il lavoro di `servings` e dei pulsanti +/− |
| "Cuocere per 20 minuti" e nient'altro | Un tempo senza indizio è un tempo sbagliato da scrivere: aggiungi colore, odore o consistenza |
| Il piatto richiede tre tegami | Passaggi che scaldano e raffreddano: valuta la versione in un tegame solo |
| `difficulty: media` senza una tecnica precisa | Il default è `facile`: la difficoltà va guadagnata, non ereditata dalla fonte |
| Un passo che è solo "Preparare il soffritto" | Titolo senza istruzione: il passo dice cosa fare, non di che cosa parla |
