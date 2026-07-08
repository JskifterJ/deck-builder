# Presenting an academic defence

A companion to this theme. It covers how to structure and deliver the talk; the theme and layouts handle the look. Adjust timings to your programme's rules — a master's defence is often 15–25 minutes of presentation plus questions.

## Structure the talk as a spine, not a summary

Examiners grade whether you can defend a *question*, not whether you can recap 50 pages. Build the deck around one spine:

**Question → why it matters → how you studied it → what you found → what it means (and where it breaks).**

A reliable 12–15 slide arc:

| # | Slide | Layout | Job |
|---|---|---|---|
| 1 | Title | `cover` | You, the title, both supervisors, date |
| 2 | Agenda | `default` | 5 signposts, 20 seconds |
| 3 | Motivation | `section` + `default` | The puzzle in one sentence, then the evidence it's real |
| 4 | Research question | `default` | State RQ(s) verbatim — the committee will hold you to this wording |
| 5 | Method | `two-cols` | Design, data, and *why it's adequate* for the question |
| 6–8 | Findings | `default` / `statement` | One finding per slide, each answering part of the RQ |
| 9 | Contribution | `default` | What the field now knows that it didn't |
| 10 | Limitations | `default` | Name them before the committee does |
| 11 | References | `references` | `<References />` — auto-built from your cited keys |
| 12 | Thank you | `end` | Invite questions calmly |

The worked example in [`slides.md`](../slides.md) is exactly this arc.

## Slide discipline

- **One claim per slide.** The title of the slide should be the claim, not the topic. "GPU capacity is abundant but poorly routed" beats "Background."
- **Speak to the audience, not the screen.** Bullets are prompts for *them*; your script lives in speaker notes.
- **Put your argument in the notes.** Speaker notes are the last HTML comment on each slide. Open Slidev's presenter view (toolbar, or `/presenter`) for notes, a timer, and the next slide. Rehearse against the timer, not the clock on the wall.
- **Defend numbers with sources.** If you state a figure, cite it with `[@key]` — the same key as the thesis. Never improvise a statistic under questioning.
- **Reveal, don't dump.** Wrap a punchline in `<v-click>` to bring it in after you've walked the setup.

## Prepare for the questions, not just the talk

The talk is the short part. Build **backup slides** after the `end` slide for the questions you expect: a method detail, an alternative interpretation, a limitation you flagged, a figure you cut for time. You navigate to them only if asked — but having them signals you've thought past your own argument.

Anticipate the standard challenges and script one calm sentence for each:
- *"Why this method / why not X?"* — tie the choice back to the question.
- *"Your sample is small."* — answer with depth, triangulation, and saturation, not apology.
- *"What would you do differently?"* — have a genuine answer ready; it reads as maturity.

## Delivery

- Rehearse out loud, standing, at least three times against the presenter timer.
- Open by naming what you'll defend; close by restating the contribution in one line.
- When you don't know, say so, then reason aloud toward a plausible answer. Committees reward thinking over bluffing.
- Slow down. You know this material better than anyone in the room.

## Build your deck

```bash
# point at your Zotero-synced bibliography so citations match the thesis
DECK_BIB=../smt-thesis/02_lit_review/references.bib npm run dev
```

Edit `slides.md`, open the presenter view for your notes and timer, and export a PDF handout with `npm run export`.
