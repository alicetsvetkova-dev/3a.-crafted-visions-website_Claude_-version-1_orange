# Crafted Visions — Website

Static multi-page site, deployed via GitHub Pages at [craftedvisionstravel.com](https://craftedvisionstravel.com).

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — routes visitors to the two products |
| `team-buildings.html` | B2B: team-buildings & corporate events + inquiry form (`#inquire`) |
| `workshops.html` | B2C: workshop lineup + interactive booking calendar (`#calendar`) |
| `about.html` | Story, mission, values |
| `contact.html` | Contact channels + general form |

Shared assets: `css/main.css` (design system), `js/main.js` (nav, reveal, newsletter, forms), `js/schedule.js` + `js/calendar.js` (booking calendar).

## Editing the workshop schedule

Everything lives in **`js/schedule.js`** — no other file needs touching:

- Each workshop repeats weekly on its `weekday` (0 = Sunday … 6 = Saturday).
- Change times, price text, descriptions or images per workshop.
- Cancel one date: add `"YYYY-MM-DD"` to that workshop's `except` list.
- Add a one-off date: add `"YYYY-MM-DD"` to `extra`.
- `monthsAhead` (booking horizon) and `minLeadDays` (minimum lead time) are at the top.
- `stripeUrl` is the Stripe payment link used by every "Book" button.

## Connecting the inquiry/contact forms (one-time setup)

The forms on `team-buildings.html` and `contact.html` post to Formspree:

1. Create a free account at [formspree.io](https://formspree.io) and add a form pointing at `crafted.visions@outlook.com`.
2. Copy the form ID (the part after `/f/` in the endpoint URL).
3. Replace `YOUR_FORM_ID` in both HTML files (search for it — one occurrence each).

Until then, submitting shows a polite fallback asking visitors to email directly.

## Other integrations

- **Newsletter**: Mailchimp JSONP endpoint, configured in `js/main.js` (`MC_URL`).
- **WhatsApp**: `wa.me/4915238418305` links (number never displayed on the page). Swap to a business number by searching for `wa.me/` across the HTML files.
- **Payments**: Stripe payment link in `js/schedule.js`; the workshop + date are confirmed inside Stripe checkout.
