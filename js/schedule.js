/* ============================================================
   CRAFTED VISIONS — WORKSHOP SCHEDULE (edit this file only)
   ------------------------------------------------------------
   Each workshop repeats weekly on the given weekday.
   weekday: 0 = Sunday, 1 = Monday … 5 = Friday, 6 = Saturday

   To change the rhythm, times, prices or copy — edit below.
   To cancel a single date, add it to "except" as "YYYY-MM-DD".
   To add a one-off extra date, add it to "extra" as "YYYY-MM-DD".
   ============================================================ */

var CV_BOOKING = {
    /* How far ahead people can book, in months */
    monthsAhead: 6,
    /* Minimum lead time before a session can be booked, in days */
    minLeadDays: 3,
    /* Stripe checkout — the workshop is confirmed at checkout */
    stripeUrl: "https://buy.stripe.com/6oU00l9cY0C66ys8II53O08",

    workshops: [
        {
            id: "calligraphy",
            name: "Arabic Calligraphy",
            colorClass: "c-calligraphy",
            weekday: 5, /* Friday */
            start: "10:00",
            end: "13:00",
            price: "49 €",
            image: "images/calligraphy.webp",
            desc: "Learn the strokes, rhythm and meaning of Arabic script with a master calligrapher. A meditative practice of precision and patience — you leave with your own finished piece.",
            facts: [
                "3 hours · atelier in Tunis",
                "Small group — max 6 participants",
                "All materials, snacks & drinks included",
                "No experience needed · English & French"
            ],
            except: [],
            extra: []
        },
        {
            id: "bookbinding",
            name: "Bookbinding",
            colorClass: "c-bookbinding",
            weekday: 6, /* Saturday */
            start: "10:00",
            end: "13:00",
            price: "49 €",
            image: "images/book-binding.webp",
            desc: "Hand-bind your own book with one of the last traditional bookbinders in Tunis. Fold, stitch and press — an endangered craft you help keep alive by learning it.",
            facts: [
                "3 hours · historic atelier in the Medina",
                "Small group — max 6 participants",
                "All materials, snacks & drinks included",
                "No experience needed · English & French"
            ],
            except: [],
            extra: []
        },
        {
            id: "ceramics",
            name: "Traditional Ceramics",
            colorClass: "c-ceramics",
            weekday: 6, /* Saturday */
            start: "14:00",
            end: "18:00",
            price: "49 €",
            image: "images/opt/atelier-poterie.webp",
            desc: "Shape clay the way it has been shaped here for centuries, guided by a master ceramicist. Slow, tactile and grounding — you take home the piece you made.",
            facts: [
                "4 hours · working pottery atelier",
                "Small group — max 6 participants",
                "All materials, snacks & drinks included",
                "No experience needed · English & French"
            ],
            except: [],
            extra: []
        },
        {
            id: "weaving",
            name: "Carpet Weaving",
            colorClass: "c-weaving",
            weekday: 0, /* Sunday */
            start: "10:00",
            end: "14:00",
            price: "49 €",
            image: "images/opt/atelier-tissage.webp",
            desc: "Work a traditional loom side by side with a weaver — wool, knots, pattern and patience. The craft our whole story began with.",
            facts: [
                "4 hours · weaving atelier",
                "Small group — max 6 participants",
                "All materials, snacks & drinks included",
                "No experience needed · English & French"
            ],
            except: [],
            extra: []
        }
    ]
};
