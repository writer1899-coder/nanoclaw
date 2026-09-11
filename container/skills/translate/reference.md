# Per-language reference

The rules that separate a native-sounding translation from a decoded one.

---

## French

**Variety:** Metropolitan French unless the user signals Québécois or another
regional standard.

### Typography — the most common tell

French puts a **narrow non-breaking space before** these: `;` `:` `!` `?` `»`
and after `«`. Use U+202F (narrow no-break space) or a regular non-breaking
space; never a plain space that can wrap.

```
Correct:   Vraiment ? Oui : c'est fait !   « Bonjour »
Incorrect: Vraiment? Oui: c'est fait!      "Bonjour"
```

Quotation marks are guillemets `« … »`, not `" … "`. Nested quotes use `“ … ”`.

### Other rules

- **Accents are mandatory**, including on capitals: `À`, `É`, `Ç`. Dropping them
  is an error, not a shortcut.
- **Lowercase** for days, months, languages, nationalities used as adjectives:
  `lundi`, `janvier`, `le français`, `un livre français` — but `un Français`
  (the person) is capitalized.
- **Numbers:** comma as decimal separator, narrow space for thousands —
  `1 234,56`. Currency follows the amount: `12,50 €`.
- **Dates:** `15 janvier 2026`, no ordinal suffix, `le` before the day.
- **Titles and headings:** sentence case, not Title Case.
- **Agreement:** adjectives and past participles agree in gender and number.
  Check every one against its noun, including participles with `être`.
- Avoid calques from English: `réaliser` for "realize (understand)" is wrong —
  use `se rendre compte`. "Actually" is `en fait`, not `actuellement` (= currently).

---

## Spanish

**Variety:** Neutral Latin American Spanish by default — it reads naturally to
the widest audience. Switch to Peninsular if the user is clearly in Spain or
asks for it.

### Punctuation

Questions and exclamations open with an inverted mark:

```
¿Cómo estás?   ¡Qué bien!   No sé, ¿y tú?
```

The inverted mark goes where the question *starts*, not necessarily at the start
of the sentence: `Si puedes, ¿me avisas?`

### Pronouns

| | LatAm neutral | Spain |
|---|---|---|
| you (sg, informal) | `tú` | `tú` |
| you (sg, formal) | `usted` | `usted` |
| you (pl) | `ustedes` | `vosotros` (informal) / `ustedes` (formal) |

`vosotros` in a message to a Latin American audience reads as foreign. Use
`ustedes` for plural unless writing for Spain.

Subject pronouns are normally **dropped** — the verb ending carries the person.
`Voy mañana`, not `Yo voy mañana`, unless you need the contrast.

### Other rules

- **Accents distinguish meaning:** `si`/`sí`, `el`/`él`, `tu`/`tú`, `mas`/`más`,
  `como`/`cómo`. Never omit them.
- **Lowercase** for days, months, languages, nationalities: `lunes`, `enero`,
  `español`.
- **Numbers:** comma decimal in Spain and much of South America
  (`1.234,56`); period decimal in Mexico and most of Central America
  (`1,234.56`). If the audience is unknown, avoid the ambiguity by writing the
  number in a form that can't be misread.
- **Titles and headings:** sentence case.
- **`ser` vs `estar`** — permanent/defining vs state/location. Getting this
  wrong is the single most audible non-native error.
- Avoid calques: "apply for a job" is `postular`/`solicitar`, not `aplicar`.

---

## Norwegian

**Written standard:** **Bokmål** by default — it's used by roughly 85–90% of
Norwegians. Use Nynorsk only if asked. Say which one you used only if it's
visible and could matter.

### Structure — where English speakers go wrong

**Definite article is a suffix, not a separate word:**

```
a book    → en bok        the book    → boka / boken
a house   → et hus        the house   → huset
the books → bøkene
```

**Double definiteness** with an adjective: the article appears *both* as a
separate word and as a suffix — `den store boka`, `det nye huset`.

**Compounds are written as one word.** English writes "language course";
Norwegian writes `språkkurs`. Splitting compounds (`språk kurs`) is the classic
error and changes the meaning. Also: `barnehage`, `arbeidsplass`,
`kundeservice`.

**No progressive tense.** `Jeg leser` covers both "I read" and "I am reading".
Don't invent `jeg er lesende`. For emphasis on ongoing action use
`holder på å lese` or `sitter og leser`.

**V2 word order.** The finite verb is the second element in a main clause. If
anything other than the subject comes first, the subject moves after the verb:

```
I dag går jeg på jobb.      (Today go I to work)
Derfor sa han ingenting.    (Therefore said he nothing)
```

### Other rules

- **Letters:** `æ ø å` — never substitute `ae`, `oe`, `aa`.
- **No formal "you".** `du` for everyone; `De` is archaic and reads as stilted.
- **Lowercase** for days, months, languages, nationalities: `mandag`, `januar`,
  `norsk`.
- **Numbers:** comma decimal, space for thousands — `1 234,56`. Currency:
  `1 234,56 kr`.
- **Dates:** `15. januar 2026` — note the period after the day.
- **Titles and headings:** sentence case, always.
- Norwegian tone is direct and plain. English hedging ("I was wondering if you
  might possibly…") sounds odd — translate it as a plain, polite request.

---

## Latin

Latin is the hard case: it has no native vocabulary for anything invented after
roughly 1600, and English word order carries none of the information Latin
needs.

### Orthography

State the convention if it's visible in the output:

| | Classical | Ecclesiastical |
|---|---|---|
| consonantal u/v | `seruus` or `servus` | `servus` |
| i/j | always `i` (`Iulius`) | `j` allowed (`Julius`) |
| diphthong | `ae`, `oe` written out | often `æ`, `œ` |
| macrons | used in teaching texts | not used |

**Default:** classical, with `v` for consonantal u (`servus`, `Iulius`), no
macrons. Add macrons only when the user is learning and asks for them.

### Grammar essentials

- **No articles.** `vir` is "a man" or "the man" — context decides.
- **Case, not position, carries the role.** Get the case right and word order
  becomes a stylistic choice: `Puella canem amat` and `Canem puella amat` both
  mean the girl loves the dog.
- **Default order** is Subject–Object–Verb; the verb naturally falls last.
  Fronting a word emphasizes it.
- **Subject pronouns are dropped** unless emphatic — `amō`, not `ego amō`.
- **Reported speech** uses the accusative + infinitive, not a `quod` clause:
  `Dīcit eum venīre` — "He says that he is coming."
- **Subjunctive** for purpose, result, indirect questions, and most subordinate
  clauses. English indicatives often must become subjunctives.

### Modern vocabulary

There is no classical word for most modern things. Three options, in order of
preference:

1. **Established Neo-Latin term** — use it if one exists.
2. **Descriptive phrase (circumlocution)** — always acceptable, never wrong.
3. **Latinized loanword** — last resort, and flag it.

Common terms:

| English | Latin |
|---------|-------|
| computer | `computatrum` |
| internet | `interrete` |
| email | `epistula electronica` |
| website | `situs interretialis` |
| phone | `telephonum` |
| message | `nuntius` |
| file | `plica` / `fasciculus` |
| password | `tessera` |
| database | `basis datorum` |
| user | `usor` |
| meeting | `conventus` |
| deadline | `dies extremus` |
| train | `hamaxostichus` |
| car | `autocinetum` |
| coffee | `capulus` |
| photograph | `imago photographica` |

When you coin or paraphrase, say so in one line. Don't silently invent a word
and present it as standard.

### Tone

Match the source's register: everyday English → plain classical prose
(Caesar, not Cicero's periodic sentences). Don't inflate a casual message into
oratory.
