# SOP Writing Guide

How to write Standard Operating Procedure content that is precise, usable, and
correctly sized (5–20 pages). Read this before filling the template.

## What an SOP is (and isn't)

An SOP tells a **trained but unfamiliar** person how to perform a process
correctly and consistently, every time. It is a *controlled document*: it has an
owner, a version, an effective date, and a review cycle.

- It **is**: the authoritative, repeatable procedure; the source of truth when
  people disagree on "how we do this"; audit evidence that a process is defined.
- It **is not**: training material, a policy statement, a one-off checklist, or a
  narrative essay. If it reads like prose, tighten it into numbered steps.

## The golden rule: write for the performer

Picture the person who will actually follow this at 7am on their second week.
Every step should answer: *What do I do? Where? How do I know it worked? What if
it didn't?* If a step forces them to ask a colleague, it is under-specified.

## Writing procedure steps

The Procedure (Section 7) is the heart of the SOP. Format every step as:

> **[Role]** — [imperative action, with exact system / screen / field names].
> - *Expected result:* [what they should see or produce]
> - *If not:* [what to check, or where to escalate]

Guidelines:

- **Start with a verb.** "Select", "Verify", "Scan", "Approve" — not "The clerk
  should probably check…".
- **Name the role on every step.** Each step must map to a role defined in
  Section 4 (Roles and Responsibilities). No orphan actions.
- **Be concrete.** "Enter the quantity in the WMS Receiving screen" beats "record
  the amount in the system".
- **One action per step.** If a step has an "and then", split it.
- **Group into phases.** Use `## 7.x` sub-sections (Intake → Validation →
  Execution → Close-out) so long procedures stay navigable.

## Where the real value lives: edge cases

A weak SOP documents only the happy path. A strong one documents what to do when
things go sideways. Invest in:

- **Section 8 — Decision Points and Business Rules:** the conditional logic
  (thresholds, approvals, tolerances). Put it in a table so it's unambiguous.
- **Section 9 — Exceptions and Escalation:** named exception types, how to handle
  each, and a concrete escalation path with escalation *criteria* (not just names).
- **Section 10 — Verification and QC:** how the org proves the step was done right.

If you are short on pages, this is almost always where the SOP is thin — not the
prose. Add decisions and edge cases, never filler.

## Sizing to 5–20 pages

The band is a proxy for the right level of detail.

**A real, non-trivial process rarely fits in under 5 pages** once you include
roles, prerequisites, numbered steps with expected results, decision rules,
exceptions, verification, records, and a revision history. If your draft is
under 5 pages, it is under-specified — expand substance, don't pad.

**Over 20 pages means the document is doing too much.** Options:
- Split by phase or by variant into multiple SOPs, cross-referenced.
- Push deep reference material (long lookup tables, full screenshot walkthroughs)
  into appendices or a linked knowledge-base article.
- Cut narrative; convert paragraphs into numbered steps and tables.

Rough content-to-length intuition (US Letter, this template's styling):

| Content | Approx. pages |
|---------|---------------|
| Cover + front matter (Purpose→Overview) | ~2 |
| A well-specified 10–20 step procedure with expected results | ~2–4 |
| Decision points, exceptions, verification, metrics | ~1–2 |
| Records, references, revision history, appendices | ~1–2 |

## Tone and mechanics

- **Imperative and present tense.** "Confirm the seal number." Not "The seal
  number will be confirmed."
- **Active voice with a named actor.** Passive voice hides who is responsible.
- **Define every acronym** in Section 3 before using it.
- **One term per concept.** Don't alternate "order", "PO", and "requisition" for
  the same thing.
- **Tables for structured data** (roles, definitions, rules, records) — they scan
  faster than prose and paginate cleanly.
- **Use the page-break marker** (`<!-- pagebreak -->` on its own line) sparingly,
  only when a section must start on a fresh page.

## Final self-check

- Could a new hire execute this without asking questions? If not, which step is vague?
- Does every procedure step have an owner (role) and an expected result?
- Are the failure/edge paths documented, not just the happy path?
- Is the metadata (owner, version, dates) complete for a controlled document?
- Did the generator report 5–20 pages? If not, fix substance and re-run.
