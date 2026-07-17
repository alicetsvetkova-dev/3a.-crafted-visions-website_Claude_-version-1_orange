/* ============================================================
   CRAFTED VISIONS — WORKSHOP SCHEDULE (edit this file only)
   ------------------------------------------------------------
   Each workshop repeats weekly on the given weekdays.
   weekday: 0 = Sunday, 1 = Monday … 5 = Friday, 6 = Saturday

   To change the rhythm, times, prices or copy, edit below.
   To cancel a single date, add it to "except" as "YYYY-MM-DD".
   To add a one-off extra date, add it to "extra" as "YYYY-MM-DD".

   BOOKED SPOTS: when a booking confirmation arrives, record it in
   the workshop's "booked" map, e.g.
       booked: { "2026-07-18": 2, "2026-07-25": 1 }
   The calendar then shows "2 of 6 spots booked" for that date.
   When a date reaches maxSpots it shows "Fully booked" and the
   book button is replaced by a WhatsApp waitlist link.
   ============================================================ */

var CV_BOOKING = {
    /* How far ahead people can book, in months */
    monthsAhead: 6,
    /* Online booking closes this many hours before a session starts.
       Past dates and closed sessions update automatically from the
       visitor's current date & time, nothing to maintain here. */
    bookingCutoffHours: 24,
    /* Spots per session */
    maxSpots: 6,
    /* A session takes place from this many participants */
    minSpots: 2,
    /* Stripe checkout, the workshop and date are confirmed at checkout */
    stripeUrl: "https://buy.stripe.com/6oU00l9cY0C66ys8II53O08",
    /* Where waitlist / "ask for a different workshop" requests go */
    whatsapp: "4915238418305",
    email: "crafted.visions@outlook.com",

    workshops: [
        {
            id: "ceramics",
            name: "Traditional Ceramics",
            colorClass: "c-ceramics",
            weekdays: [3, 6], /* Wednesday & Saturday */
            start: "10:00",
            end: "13:00",
            price: "49 €",
            image: "images/opt/atelier-poterie.webp",
            desc: "Shape clay the way it has been shaped here for centuries, guided by a master ceramicist. Slow, tactile and grounding, you take home the piece you made.",
            facts: [
                "3 hours · working pottery atelier",
                "Small group · max 6 participants",
                "All materials, snacks & drinks included",
                "No experience needed · English & French"
            ],
            booked: {},
            except: [],
            extra: []
        },
        {
            id: "bookbinding",
            name: "Bookbinding",
            colorClass: "c-bookbinding",
            weekdays: [4, 5, 6], /* Thursday, Friday & Saturday */
            start: "15:00",
            end: "18:00",
            price: "49 €",
            image: "images/book-binding.webp",
            desc: "Hand-bind your own book with one of the last traditional bookbinders in Tunis. Fold, stitch and press, an endangered craft you help keep alive by learning it.",
            facts: [
                "3 hours · historic atelier in the Medina",
                "Small group · max 6 participants",
                "All materials, snacks & drinks included",
                "No experience needed · English & French"
            ],
            booked: {},
            except: [],
            extra: []
        },
        {
            id: "calligraphy",
            name: "Arabic Calligraphy",
            colorClass: "c-calligraphy",
            weekdays: [5, 6, 0], /* Friday, Saturday & Sunday */
            start: "10:00",
            end: "13:00",
            price: "49 €",
            image: "images/calligraphy.webp",
            desc: "Learn the strokes, rhythm and meaning of Arabic script with a master calligrapher. A meditative practice of precision and patience, you leave with your own finished piece.",
            facts: [
                "3 hours · atelier in Tunis",
                "Small group · max 6 participants",
                "All materials, snacks & drinks included",
                "No experience needed · English & French"
            ],
            booked: {},
            except: [],
            extra: []
        },
        {
            id: "weaving",
            name: "Carpet Weaving",
            colorClass: "c-weaving",
            weekdays: [0], /* Sunday — PLACEHOLDER: confirm the real day(s) & time */
            start: "10:00",
            end: "14:00",
            price: "49 €",
            image: "images/opt/atelier-tissage.webp",
            desc: "Work a traditional loom side by side with a weaver, wool, knots, pattern and patience. The craft our whole story began with.",
            facts: [
                "4 hours · weaving atelier",
                "Small group · max 6 participants",
                "All materials, snacks & drinks included",
                "No experience needed · English & French"
            ],
            booked: {},
            except: [],
            extra: []
        }
    ]
};
