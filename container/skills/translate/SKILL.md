---
name: translate
description: Translate English text into French, Latin, Spanish, or Norwegian. Use whenever someone asks for a translation, asks "how do you say X in <language>", sends English text to be rendered in one of these languages, or asks for a message to be localized before sending.
---

# Translate

Translate English into **French**, **Latin**, **Spanish**, or **Norwegian**.

You are the translation engine — there is no external API to call. Translate
directly, then apply the rules below so the output reads like it was written by
a native speaker rather than decoded word by word.

## Workflow

1. **Identify the target language.** Accept any form the user gives: name
   (`French`), native name (`français`, `norsk`, `español`), or ISO code
   (`fr`, `la`, `es`, `no`, `nb`, `nn`).
2. **Pick the register** — see [Register defaults](#register-defaults). Infer it
   from the source text instead of asking: a chat message to a friend is
   informal, an email to a client is formal.
3. **Translate the meaning, not the words.** Idioms become the equivalent idiom
   in the target language, not a literal gloss.
4. **Preserve everything that isn't prose** — see [What not to translate](#what-not-to-translate).
5. **Reply with the translation and nothing else.** No preamble, no "Here's the
   translation:", no back-translation. Add notes only when a
   [note is warranted](#when-to-add-a-note).

### If the target language is missing or unsupported

- **No language named** and only one is plausible from context (the channel
  language, an earlier request in the thread) — use it.
- **No language named** and nothing to go on — ask which of the four they want.
  One short question, then translate.
- **Several named at once** — translate into each, one labelled block per
  language, in the order the user listed them.
- **A language outside the four** — you may still translate it if you can do so
  accurately; say in one line that it's outside this skill's four languages so
  the user knows it hasn't had the same treatment. Never refuse silently and
  never substitute a language they didn't ask for.

### If the source isn't English

Translate it anyway, and say in one line what language you read it as. Don't
make the user resubmit.

## Register defaults

| Language | Informal | Formal | Default when unclear |
|----------|----------|--------|----------------------|
| French | `tu` | `vous` | `vous` |
| Spanish | `tú` | `usted` | `tú` (LatAm neutral) |
| Norwegian | `du` | `du` | `du` — Norwegian has no formal you in modern use |
| Latin | `tū` | `vōs` / 3rd person | Match the source's formality |

Hold the register consistent for the whole passage. Never mix `tu` and `vous`
addressing the same person.

## What not to translate

Copy these through **byte for byte**:

- Code blocks, inline code, and anything inside them — including comments
- URLs, file paths, email addresses, CLI flags
- Placeholders and format specifiers: `{name}`, `%s`, `{{count}}`, `$VAR`, `:id`
- Proper nouns — people, companies, products — unless the language has a
  genuinely established form (`London` → `Londres` in French and Spanish, but
  `Slack` stays `Slack`)
- Markdown structure: heading levels, list markers, link targets, emphasis,
  table pipes. Translate the link *text*, keep the URL.

Placeholder count and spelling in the output must match the input exactly. A
translation that drops a `%s` is a bug, not a stylistic choice.

## When to add a note

Append at most one short line, after the translation, separated by a blank line
— and only when the user genuinely needs it:

- **Untranslatable concept.** Latin especially: modern terms need a coined or
  descriptive phrase. Say which one you used.
- **Genuine ambiguity in the English.** If "you" could be singular or plural,
  or a word has two readings that translate differently, state the reading you
  chose.
- **Dialect choice.** Which Norwegian written standard, which Spanish variety,
  which Latin orthography — only when the choice is visible in the output and a
  different choice would look wrong to the reader.

Otherwise, no note. Silence is the default.

## Long or structured input

- **Documents** — translate the whole thing in one pass, preserving structure.
  Don't summarize, don't drop sections, don't insert a table of contents that
  wasn't there.
- **Lists of strings (UI copy, i18n files)** — keep the exact order and keys;
  translate values only. Watch the length: UI labels that grow 40% longer break
  layouts, so prefer the shorter natural phrasing.
- **Anything over a few thousand words** — translate it in order, section by
  section, and deliver the complete result. Never stop partway and offer to
  continue unless the user asked you to work in chunks.

## Per-language rules

Every language has traps that make an otherwise correct translation read as
machine output — French typographic spacing, Spanish inverted punctuation,
Norwegian compound nouns, Latin's lack of modern vocabulary.

**Read [reference.md](reference.md) before translating.** It is short and it is
where the accuracy actually comes from.

## Quick self-check

Before you send, confirm:

1. Placeholders, code, and URLs are unchanged and all still present
2. Register is consistent throughout
3. Punctuation follows the target language, not English (see reference.md)
4. Nothing was added, explained, or softened that wasn't in the source
5. It reads like prose a native speaker would write
