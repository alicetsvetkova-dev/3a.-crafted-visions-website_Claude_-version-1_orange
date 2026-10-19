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
            name_fr: "Poterie traditionnelle",
            desc_fr: "Façonnez l'argile comme on le fait ici depuis des siècles, sous la conduite d'un maître céramiste. Un moment lent, tactile et apaisant, et vous emportez la pièce que vous avez créée.",
            facts_fr: [
                "3 heures · atelier de poterie en activité · en français",
                "Petit groupe · 6 participants max",
                "Tout le matériel inclus",
                "Tous niveaux bienvenus"
            ],
            colorClass: "c-ceramics",
            weekdays: [3, 6], /* Wednesday & Saturday */
            start: "10:00",
            end: "13:00",
            price: "49 €",
            image: "/images/opt/atelier-poterie.webp",
            desc: "Shape clay the way it has been shaped here for centuries, guided by a master ceramicist. Slow, tactile and grounding, you take home the piece you made.",
            facts: [
                "3 hours · working pottery atelier · in French",
                "Small group · max 6 participants",
                "All materials included",
                "All levels welcome"
            ],
            booked: {},
            except: [],
            /* One-off extra date with a custom start time (overrides the usual 10:00) */
            extra: ["2026-10-04"],
            extraTimes: { "2026-10-04": { start: "14:00", end: "17:00" } }
        },
        {
            id: "bookbinding",
            name: "Bookbinding",
            name_fr: "Reliure",
            desc_fr: "Reliez votre propre livre à la main avec l'un des derniers relieurs traditionnels de Tunis. Pliez, cousez, pressez\u00a0: un métier menacé que vous aidez à faire vivre en l'apprenant.",
            facts_fr: [
                "2 heures · atelier historique dans la médina · en français",
                "Petit groupe · 6 participants max",
                "Tout le matériel inclus",
                "Tous niveaux bienvenus"
            ],
            colorClass: "c-bookbinding",
            weekdays: [4, 5, 6], /* Thursday, Friday & Saturday */
            start: "15:00",
            end: "17:00",
            price: "49 €",
            image: "/images/book-binding.webp",
            desc: "Hand-bind your own book with one of the last traditional bookbinders in Tunis. Fold, stitch and press, an endangered craft you help keep alive by learning it.",
            facts: [
                "2 hours · historic atelier in the Medina · in French",
                "Small group · max 6 participants",
                "All materials included",
                "All levels welcome"
            ],
            booked: {},
            except: [],
            /* One-off extra date with a custom start time (overrides the usual 15:00) */
            extra: ["2026-10-07"],
            extraTimes: { "2026-10-07": { start: "14:00", end: "16:00" } }
        },
        {
            id: "calligraphy",
            name: "Arabic Calligraphy",
            name_fr: "Calligraphie arabe",
            desc_fr: "Apprenez les tracés, le rythme et le sens de l'écriture arabe avec un maître calligraphe. Une pratique méditative de précision et de patience, et vous repartez avec votre propre œuvre.",
            facts_fr: [
                "2 heures · atelier à Tunis · en français",
                "Petit groupe · 6 participants max",
                "Tout le matériel inclus",
                "Tous niveaux bienvenus"
            ],
            colorClass: "c-calligraphy",
            weekdays: [5, 6, 0], /* Friday, Saturday & Sunday */
            start: "10:00",
            end: "12:00",
            price: "49 €",
            image: "/images/calligraphy.webp",
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
            name_fr: "Ebru · Marbrure sur papier",
            desc_fr: "Faites flotter la couleur sur l'eau et déposez-la sur le papier\u00a0: l'art fascinant de la marbrure. Chaque feuille est unique, et elle est à vous.",
            facts_fr: [
                "2 heures · atelier de marbrure à Tunis · en français",
                "Petit groupe · 6 participants max",
                "Tout le matériel inclus",
                "Tous niveaux bienvenus"
            ],
            colorClass: "c-ebru",
            weekdays: [4, 5, 6], /* Thursday, Friday & Saturday — same as Bookbinding */
            start: "15:00",
            end: "17:00",
            price: "59 €",
            /* Ebru has its own price and dedicated Stripe link */
            stripeUrl: "https://buy.stripe.com/5kQ7sN1Kw1Ga9KEbUU53O0b",
            image: "/images/opt/ebru-marbling.jpg",
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
            name_fr: "Visite guidée de la médina",
            desc_fr: "Explorez la médina à travers les yeux de quelqu'un qui la connaît vraiment\u00a0: recoins cachés, artisanat vivant et histoires hors des sentiers touristiques.",
            facts_fr: [
                "1\u00a0h\u00a030 · visite guidée à pied · en anglais et en français",
                "Petit groupe",
                "Point de rendez-vous communiqué à la réservation"
            ],
            colorClass: "c-medina",
            weekdays: [6, 0], /* Saturday & Sunday — from the live site; confirm before launch */
            start: "09:00",
            end: "10:30",
            price: "39 €",
            /* Medina tour has its own dedicated 39 € Stripe link (from the July 2026 site) */
            stripeUrl: "https://buy.stripe.com/fZu00l3SEdoSf4Y0cc53O0a",
            image: "/images/opt/medina-gate.jpg",
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
