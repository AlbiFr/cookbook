---
name: nuova-ricetta
description: "Crea una nuova ricetta in questo ricettario Astro, in src/content/recipes/NOME-SLUG.md, con lo standard di biscotti-al-cioccolato.md: frontmatter completo, ingredienti con quantità e unità, controllo aritmetico tra porzioni e quantità, procedura, conservazione, varianti, immagine, verifica con npm run build. Usalo SEMPRE quando l'utente porta una ricetta da mettere nel ricettario, anche senza chiederlo: \"ho trovato questa ricetta, aggiungila\", \"metti questa nel ricettario\", \"aggiungi la ricetta della carbonara\", \"inserisci questa ricetta\", \"nuova ricetta: ...\", o quando chiede di sistemare una ricetta già presente. La verifica online esiste ma parte solo se la chiede a parole (\"controlla le dosi sul web\", \"validala online\"): usa webfetch sul link o websearch su più fonti, confronta le proporzioni per 100 g di ingrediente strutturante e riporta in chat le differenze senza cambiare le dosi di nascosto."
---

# Nuova ricetta

Il ricettario è una content collection Astro: ogni ricetta è **un file markdown piatto in `src/content/recipes/`** e lo schema che decide se è valida sta in `src/content.config.ts`. Questo skill serve a trasformare una ricetta (dal web, da un libro, dalla nonna, o dalla testa di chiunque) in un file che passi lo schema e che si legga come le altre.

## Flusso

1. **Leggi i riferimenti** (vedi sotto) — ti dicono il tono e la struttura, che non si inventano.
2. **Ricava i dati**: titolo, categoria, porzioni, tempi, lista ingredienti, procedura. Se l'utente incolla una ricetta straniera, traduci i nomi degli ingredienti in italiano ma lascia i nomi delle tecniche riconoscibili (`mise en place`, `blanch`, `brunoise` → dillo in italiano con il termine originale tra parentesi solo se serve).
3. **Fai il controllo aritmetico** (vedi "Controllo aritmetico"): è gratuito, ci mette dieci secondi e va fatto sempre, anche senza aprire il web.
4. **Verifica online, solo se l'utente la chiede esplicitamente** (vedi "Verifica online"). Non cercare ricette su internet di tua iniziativa: le ricette hanno dosi regionali che vanno bene anche se non corrispondono alla media, e la ricetta della nonna non è un errore solo perché il web dice un'altra cosa.
5. **Scrivi il file** in `src/content/recipes/<slug>.md` e nient'altro. Non creare cartelle, non toccare `content.config.ts`, non modificare le altre ricette, non registrare la ricetta da nessuna parte (il glob le prende da solo e la home la mostra automaticamente).
6. **Verifica con il build** (vedi "Verifica").

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
- **`difficulty`** — `difficile` appena c'è una tecnica che si può sbagliare (una glassatura, un punto esatto di cottura, una lievitazione)`media` quanto richiede tanto tempo di preparazione come impastare. `facile` se è a prova di distratto.

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
- `## Consigli` solo se hai qualcosa di vero da dire — la regola che usi tu quando cuoci (sostituzioni, come gestire gli avanzi, come evitare che si rovini). Niente consigli generici tipo "cuocere con amore": se non scriveresti quello a un amico in cucina, non scriverlo qui. Due o tre frasi in voce "noi", come fa la ricetta dei biscotti.

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
- `ingredients`: la lista **completa**, non un diff rispetto all'originale. Attenzione: la pagina scala tutte le varianti sul `servings` principale, quindi ogni variante deve stare in piedi da sola per quel numero di porzioni.

## Immagine

1. Guarda `public/images/recipes/` e vedi se c'è già un file che fa per questa ricetta.
2. Se c'è, `image:` deve essere l'URL pubblico **con il `base` di `astro.config.mjs`** (oggi `/cookbook`): `image: /cookbook/images/recepies/pulled_pork.jpg`. Il campo finisce grezzo nell'`src` dell'immagine, senza che Astro gli aggiunga il base, quindi un path senza `/cookbook` dà un'immagine rotta.
3. Se il file non esiste, **ometti il campo**: la card mostra il placeholder con l'emoji della categoria, che è meglio di un'immagine rotta. Non generare path che puntano a file inesistenti.

## Controllo aritmetico

Questo passaggio non usa il web e va fatto **sempre**: dieci secondi di carta e matita che valgono più di qualunque ricerca.

Il controllo è uno solo, ed è quello che quasi nessuno fa: **la massa (o il volume) degli ingredienti deve essere divisibile per `servings` con la dimensione della porzione che la procedura indica.**

- Somma le quantità. Sale, pepe e spezie in `qb` non contano, sono trascurabili.
- Guarda cosa dice la procedura sulla dimensione di una porzione: "palline da 40 g", "8 fette", "una teglia".
- Dividi, e confronta con `servings`.

Esempio: 400 g di impasto, procedura che dice "taglia in 8 fette", ma `servings: 6`. 400/6 fa 67 g a fetta, che non è 8 fette da 50 g. O il `servings` è sbagliato, o è sbagliata la porzione nella procedura — e se sono in conflitto, **la procedura ha ragione**, perché è quella che descrive il piatto reale. Correggi il campo, non il testo del passo.

Il secondo controllo è la coerenza tra categorie: se il passo dice "formare 15 palline" o "rende 6 porzioni", quei numeri devono concordare con `servings` e con la somma di cui sopra.

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
- [ ] Controllo aritmetico fatto: la somma delle quantità si divide per `servings` con la porzione che dice la procedura, e i numeri citati nei passi concordano
- [ ] I tag sono già usati altrove nella cartella
- [ ] Passi in infinito, numerazione sequenziale, grassetto solo sui valori utili
- [ ] `Conservazione` presente, `Consigli` solo se c'è qualcosa di vero
- [ ] Varianti con la lista completa, se presenti
- [ ] `image` solo se il file esiste davvero, e con il base `/cookbook`
- [ ] Verifica online fatta **solo** se l'utente l'ha chiesta, e in quel caso riportata in chat con le fonti
- [ ] `npm run build` passa
- [ ] Nessun altro file toccato

## Errori che si vedono spesso

| Sintomo | Causa |
| --- | --- |
| Le quantità non cambiano con i pulsanti +/- | `quantity: "175"` come stringa invece di numero |
| Errore YAML sulla riga `season` | `tutto l'anno` non tra virgolette: `season: "tutto l'anno"` |
| Step che saltano un numero | Numerazione non sequenziale nel sorgente |
| La variante ha 2 ingredienti | Le varianti vogliono la lista intera, non il differenziale |
| Immagine che non si vede | Manca il `/cookbook` (vedi `astro.config.mjs`) |
| La ricetta finisce nella sezione sbagliata | `category` con un valore fuori dall'enum in `content.config.ts` |
| "Rende 12 fette" ma `servings: 6` | Manca il controllo aritmetico: 400 g / 6 non fa fette da 50 g |
| I biscitti vengono piatti | Le dosi di lievito hanno senso solo se la ricetta è pensata per essere densa: controlla, non dare per scontato |
