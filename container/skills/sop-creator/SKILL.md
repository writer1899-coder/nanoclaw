---
name: sop-creator
description: Create a professional Standard Operating Procedure (SOP) and render it as a clean, paginated PDF. Use when the user asks to write, draft, generate, or document an SOP, standard operating procedure, work instruction, process document, or runbook. Every SOP is at least 5 pages and no more than 20 pages.
---

# SOP Creator / Generator

Produce a complete, professional Standard Operating Procedure and deliver it as a
polished PDF. The output document is **always at least 5 pages and never more
than 20 pages** — this is enforced by the generator, not left to judgment.

An SOP is a controlled document that tells a trained-but-unfamiliar person
exactly how to perform a process correctly and consistently. Aim for that reader:
specific enough to execute without asking questions, not so verbose it becomes
unusable.

## Files in this skill

| Path | Purpose |
|------|---------|
| `assets/sop-template.md` | The canonical SOP structure (15 sections + appendices). Copy and fill it. |
| `assets/sop-style.css` | Print styling used by the generator. You normally don't touch this. |
| `scripts/generate-sop.mjs` | Renders a filled SOP markdown → styled PDF and enforces the 5–20 page rule. |
| `references/example-sop.md` | A fully filled, realistic example (warehouse receiving). Read it to see the target quality. |
| `references/writing-guide.md` | How to write SOP content that is precise and correctly sized. |

## Workflow

### 1. Gather the essentials

Ask the user for what you can't infer. At minimum you need:

- **The process** — what procedure is being documented, and the trigger that starts it.
- **The audience/roles** — who performs it, who approves, who gets escalated to.
- **The steps** — the actual sequence of actions. If the user is vague, propose a
  draft flow from domain knowledge and ask them to correct it rather than
  interrogating them line by line.
- **Metadata** — organization, department, SOP ID, owner, effective date. Fill
  sensible defaults (today's date, version 1.0) and let them override.

Don't over-interview. One focused round of questions, then draft. It is far
easier for the user to react to a solid draft than to answer twenty questions.

### 2. Draft from the template

Copy `assets/sop-template.md` to a working file (e.g. the group workspace or a
temp path) and fill **every** section. Read `references/writing-guide.md` first,
and skim `references/example-sop.md` to match its concreteness. Key rules:

- Fill the YAML front matter — `title` drives the cover page; `id`, `version`,
  `effective_date`, `owner`, etc. populate the metadata table.
- Write real content, not placeholders. Every `[bracketed]` prompt must be replaced.
- Number every procedure step. Each step names the **role**, the **action**, and
  the **expected result** (see the example).
- Keep the standard section order — auditors and readers rely on it.
- Use tables for roles, definitions, decision rules, records, and revision history.
- Remove sections that genuinely don't apply (e.g. Safety) rather than leaving
  them empty — but keep Purpose, Scope, Roles, Procedure, and Revision History always.

### 3. Generate the PDF

```bash
node scripts/generate-sop.mjs <filled-sop.md> <output.pdf>
```

The script prints the page count and validates it:

- **Exit 0** — within 5–20 pages. Done.
- **Exit 2** — out of range. It tells you which way. **Fix the content and
  re-run** — do not ship an out-of-range SOP.

The generator uses the container's Chromium; no extra install is needed. It
auto-detects the browser via `/usr/bin/chromium`. Optional flags:
`--min N`, `--max N`, `--html <path>` (dump the intermediate HTML for debugging).

### 4. Hitting the page target

The 5–20 band is a quality signal, not padding.

**Too short (< 5 pages)** — the SOP is under-specified. Add real substance:
- Expand each procedure step with expected results and "if not" handling.
- Flesh out Roles & Responsibilities, Decision Points, and Exceptions/Escalation.
- Add Verification/QC, Metrics, Records, and an Appendix checklist.
- Never inflate with filler prose — add *decisions, edge cases, and specifics*.

**Too long (> 20 pages)** — the document is trying to be a manual:
- Move deep reference material (long tables, full screenshots) into appendices or
  linked documents.
- Split into multiple focused SOPs (e.g. separate the setup SOP from the run SOP).
- Tighten wordy prose; SOPs favor imperative, scannable instructions.

### 5. Deliver

Send the finished PDF to the user with `send_message` as a file attachment.
Offer the source markdown too so they can edit and re-generate later. Mention the
page count and that it's within the controlled 5–20 page range.

## Quality bar

Before delivering, confirm:

- [ ] Every section filled with real, process-specific content — no `[brackets]` left.
- [ ] Every procedure step maps to a role defined in Section 4.
- [ ] Decision points and exceptions are explicit (an SOP's value is in the edge cases).
- [ ] Cover metadata is complete and the revision history has an initial row.
- [ ] Generator exited 0 (5–20 pages).
