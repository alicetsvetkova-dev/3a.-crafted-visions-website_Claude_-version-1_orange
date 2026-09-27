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
    /* Assembled from parts so the raw number isn't sitting in the source for scrapers */
    whatsapp: ["491", "768", "736", "1752"].join(""),
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
                "3 hours · working pottery atelier · in French",
                "Small group · max 6 participants",
                "All materials included",
                "All levels welcome"
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
            end: "17:00",
            price: "49 €",
            image: "images/book-binding.webp",
            desc: "Hand-bind your own book with one of the last traditional bookbinders in Tunis. Fold, stitch and press, an endangered craft you help keep alive by learning it.",
            facts: [
                "2 hours · historic atelier in the Medina · in French",
                "Small group · max 6 participants",
                "All materials included",
                "All levels welcome"
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
            end: "12:00",
            price: "49 €",
            image: "images/calligraphy.webp",
            desc: "Learn the strokes, rhythm and meaning of Arabic script with a master calligrapher. A meditative practice of precision and patience, you leave with your own finished piece.",
            facts: [
                "2 hours · atelier in Tunis · in French",
                "Small group · max 6 participants",
                "All materials included",
                "All levels welcome"
            ],
            booked: {},
            except: [],
            extra: []
        },
        /* Mosaic is offered on request (not a fixed weekly slot), so it is not
           listed in the booking calendar. Its card links to an enquiry instead. */
        {
            id: "ebru",
            name: "Ebru · Paper Marbling",
            colorClass: "c-ebru",
            weekdays: [4, 5, 6], /* Thursday, Friday & Saturday — same as Bookbinding */
            start: "15:00",
            end: "17:00",
            price: "49 €",
            image: "images/opt/ebru-marbling.jpg",
            desc: "Float colour on water and lift it onto paper: the mesmerising art of marbling. Every sheet is unrepeatable, and yours to keep.",
            facts: [
                "2 hours · marbling atelier in Tunis · in French",
                "Small group · max 6 participants",
                "All materials included",
                "All levels welcome"
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
            /* Medina tour has its own dedicated 39 € Stripe link (from the July 2026 site) */
            stripeUrl: "https://buy.stripe.com/fZu00l3SEdoSf4Y0cc53O0a",
            image: "images/opt/medina-gate.jpg",
            desc: "Explore the Medina through the eyes of someone who truly knows it: hidden corners, living craftsmanship and stories off the tourist trail.",
            facts: [
                "1.5 hours · guided walking tour · English & French",
                "Small group",
                "Meeting point shared on booking"
            ],
            booked: {},
            except: [],
            extra: []
        }
    ]
};
