# SIMAT · سمات

Interactive prototype of a **proposed national genetic counselling programme** for Saudi Arabia.
MEDATHON 2026 (Saudi Youth Healthcare Forum), Track 2: Digital Transformation. Team **Diploidy**, team code `MED-SGWSYS`.

**Live prototype:** https://claude.ai/artifact/Uv7AD5CJNGHmcUgkqVGdah

> This is a student prototype for evaluation. It is **not approved for clinical use**. Every family, name, number and result in it is fictional. No real patient data is used. SIMAT has not been adopted or endorsed by the Ministry of Health or any other body.

## What SIMAT does

One genetic test result concerns a whole family, but today the family is rarely told. SIMAT turns a result into a guided pathway:

1. **A result arrives.** The person reads it in plain Arabic or English.
2. **Understand and decide.** A five-step counselling session shows how the condition is inherited and presents every option with equal weight. A human counsellor is one tap away.
3. **Relatives are invited.** The health authority decides whether and when to send an official invitation for a free test. The invitation never names the first person.
4. **Booking and follow-up.** Each relative books a test and sees only their own result.

β-thalassaemia and sickle cell disease are the first two conditions modelled.

## How to try it

Open the live link above, or run it locally. There is no build step and no dependency to install.

```bash
git clone https://github.com/hugomurder1-ctrl/simat.git
cd simat
python3 -m http.server 8000
# then open http://localhost:8000
```

A two-minute path for a first look:

1. Open **Citizen portal** (`portal.html`) and choose **Yousef** (a carrier found at premarital screening).
2. Read the result, then open **Counselling** and **My family**.
3. Open **Authority console** (`console.html`) for the national view and the restricted family record.
4. Open **Clinical workspace** (`clinical.html`) and switch between the four test cases.

Every page also has a **Guided tour** button (57 steps). The language toggle switches Arabic and English.

## What is built, what is simulated

| | Status |
|---|---|
| 14 pages: public site (11), citizen portal, authority console, clinical workspace | Built, working in the browser |
| Arabic and English, right-to-left layout | Built |
| Counselling session, inheritance view, options with equal weight | Built |
| Family view by role only (no names) for the person; full record for the authority's case team | Built |
| Six-step builder for adding a new condition, with a live probability table | Built |
| CBC reader with four published discriminant indices (Mentzer, Shine & Lal, England & Fraser, Srivastava) | Built |
| Sign-in through Nafath | **Simulated** |
| Booking through Sehhaty, SMS notices | **Simulated** |
| National screening records, NPHIES, Seha Virtual Hospital | **Simulated** |
| All data on screen | **Illustrative**, fictional |
| Server, database, user accounts | **Not built**: the prototype runs entirely in the browser |

## What has been tested

**Calculator check, 14 November 2026.** The four index values shown by the clinical workspace were recomputed by hand for each of the four built-in test cases. 16 of 16 values match.

| Case | Hb | MCV | MCH | RBC | Mentzer (<13) | Shine & Lal (<1530) | England & Fraser (<0) | Srivastava (<3.8) |
|---|---|---|---|---|---|---|---|---|
| β-thalassaemia carrier | 11.8 | 64.2 | 19.8 | 6.00 | 10.7 | 816.1 | −4.2 | 3.3 |
| Relative, routine CBC only | 11.5 | 63.8 | 19.6 | 5.95 | 10.7 | 797.8 | −3.1 | 3.3 |
| Iron deficiency (mimic) | 9.6 | 67.0 | 20.4 | 4.05 | 16.5 | 915.8 | 11.6 | 5.0 |
| Sickle cell trait | 13.4 | 84.0 | 28.5 | 4.75 | 17.7 | 2011.0 | 8.8 | 6.0 |

In the iron-deficiency case one index (Shine & Lal) points to a trait while the other three do not. This is why the prototype labels index results as suspicion only and requires confirmatory testing and specialist sign-off.

**Demand for the concept.** An anonymous public survey (n = 159, 8–11 November 2026) is reported in the team's Filter 2 deck.

**Not yet tested:** use by first-time users, real carriers or clinicians; any live integration; clinical outcomes.

## Known limitations

- A few placeholders remain in the interface: bracketed fields for retention period, deletion period, reviewers and hosting provider; the counselling centre phone number and hours; the team contact email.
- The home page of the live link is served through the hosting platform's wrapper. `index.html` in this repository is the same page with a standard HTML wrapper.
- This repository was uploaded as a single commit on 14 November 2026 from the team's working copy. The prototype was built in October and November 2026.

## Repository layout

```
index.html, about.html, how-it-works.html, conditions.html, families.html,
professionals.html, authorities.html, privacy.html, faq.html, sources.html, contact.html
portal.html      citizen portal        (js/portal.js,  css/portal.css)
console.html     authority console     (js/console.js, css/console.css)
clinical.html    clinical workspace    (self-contained)
js/core.js       language toggle, shared layout
js/tour-*.js     guided tour engine and its 57 steps
css/             design tokens, site styles, embedded fonts
assets/          logos, icons, images
```

## Tools and credits

- Plain HTML, CSS and JavaScript. No framework and no external script.
- Built by the team with AI coding assistance (Claude, by Anthropic). Design decisions, clinical content rules and review are the team's.
- Fonts: IBM Plex Sans, IBM Plex Sans Arabic and IBM Plex Mono (SIL Open Font License).
- Published sources for every figure on the site are listed in `sources.html`.

## Team Diploidy

Ahmed Binafef · Abdelrahman Alzeer · Haidarah Alghmri · Mohammed Alaidarous (medical students)

## Rights

© 2026 Team Diploidy. All rights reserved. Shared for MEDATHON 2026 evaluation.
