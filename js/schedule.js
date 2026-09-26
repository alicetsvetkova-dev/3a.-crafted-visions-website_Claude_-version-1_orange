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
    whatsapp: "4917687361752",
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
                "All materials included",
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
                "All materials included",
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
                "All materials included",
                "No experience needed · English & French"
            ],
            booked: {},
            except: [],
            extra: []
        },
        {
            id: "mosaic",
            name: "Mosaic",
            colorClass: "c-mosaic",
            weekdays: [6], /* Saturday — PLACEHOLDER: confirm the real day(s) & time */
            start: "10:00",
            end: "13:00",
            price: "49 €",
            image: "images/opt/mosaic-workshop.jpg",
            desc: "Set stone and ceramic piece by piece into a pattern of your own, an art Tunisia has practiced since antiquity. You take home the piece you made.",
            facts: [
                "3 hours · mosaic atelier in Tunis",
                "Small group · max 6 participants",
                "All materials included",
                "No experience needed · English & French"
            ],
            booked: {},
            except: [],
            extra: []
        },
        {
            id: "ebru",
            name: "Ebru · Paper Marbling",
            colorClass: "c-ebru",
            weekdays: [0], /* Sunday — PLACEHOLDER: confirm the real day(s) & time */
            start: "10:00",
            end: "12:30",
            price: "49 €",
            /* PLACEHOLDER image — replace with the real Ebru photo when provided */
            image: "images/opt/authentic-details.webp",
            desc: "Float colour on water and lift it onto paper: the mesmerising art of marbling. Every sheet is unrepeatable, and yours to keep.",
            facts: [
                "2.5 hours · marbling atelier in Tunis",
                "Small group · max 6 participants",
                "All materials included",
                "No experience needed · English & French"
            ],
            booked: {},
            except: [],
            extra: []
        },
        {
            id: "medina-tour",
            name: "Guided Medina Tour",
            colorClass: "c-medina",
            weekdays: [6, 0], /* Saturday & Sunday — from the live site; confirm before launch */
            start: "09:00",
            end: "10:30",
            price: "39 €",
            image: "images/opt/medina-gate.jpg",
            desc: "Explore the Medina through the eyes of someone who truly knows it: hidden corners, living craftsmanship and stories off the tourist trail.",
            facts: [
                "1.5 hours · guided walking tour",
                "Small group",
                "Meeting point shared on booking",
                "English & French"
            ],
            booked: {},
            except: [],
            extra: []
        }
    ]
};
