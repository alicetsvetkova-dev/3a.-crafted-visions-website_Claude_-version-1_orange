/* ============================================================
   CRAFTED VISIONS — Booking calendar engine
   Renders a month grid from CV_BOOKING (js/schedule.js) and a
   day panel with the sessions of the selected date.

   Time handling is fully automatic, based on the visitor's
   current date & time:
   - today and all past dates render greyed out, with no session
     markers and no way to click, select or open them
   - sessions starting in less than CV_BOOKING.bookingCutoffHours
     (default 24 h) show "Booking closed" and hide the book button
   - a date that reaches CV_BOOKING.maxSpots shows "Fully booked"
     with a WhatsApp waitlist link instead of the book button
   No edits needed here for schedule changes.

   Language: on pages with <html lang="fr"> the calendar renders in
   French (months, weekdays, all UI copy and messages). Workshop
   name/desc/facts come from the *_fr fields in js/schedule.js when
   present; English otherwise. English pages are unaffected.
   ============================================================ */
(function () {
    "use strict";

    var root = document.getElementById("cv-calendar");
    var panel = document.getElementById("cv-day-panel");
    if (!root || !panel || typeof CV_BOOKING === "undefined") { return; }

    var FR = (document.documentElement.getAttribute("lang") || "en").slice(0, 2) === "fr";
    var LOCALE = FR ? "fr-FR" : "en-GB";

    var MONTHS = FR
        ? ["janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
        : ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
    var DOWS = FR
        ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    /* Workshop display fields: French variants when present and lang=fr */
    function wName(w) { return (FR && w.name_fr) || w.name; }
    function wDesc(w) { return (FR && w.desc_fr) || w.desc; }
    function wFacts(w) { return (FR && w.facts_fr) || w.facts; }

    /* Times: "10:00" stays as-is in English; French uses "10 h" / "10 h 30" */
    function fmtT(t) {
        if (!FR) { return t; }
        var p = t.split(":"), mm = p[1] || "00";
        return String(+p[0]) + "&nbsp;h" + (mm === "00" ? "" : "&nbsp;" + mm);
    }

    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var cutoffMs = (CV_BOOKING.bookingCutoffHours || 24) * 3600 * 1000;

    var maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + CV_BOOKING.monthsAhead);

    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selected = null;

    function iso(d) {
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    }

    /* Sessions scheduled on a date, regardless of bookability
       (past dates included, so they can render greyed out) */
    function sessionsOn(d) {
        if (d > maxDate) { return []; }
        var key = iso(d);
        return CV_BOOKING.workshops.filter(function (w) {
            if (w.except && w.except.indexOf(key) !== -1) { return false; }
            if (w.extra && w.extra.indexOf(key) !== -1) { return true; }
            return w.weekdays.indexOf(d.getDay()) !== -1;
        }).sort(function (a, b) {
            /* Guided Medina Tour is a tour, not a workshop — always list it last */
            var aM = a.id === "medina-tour", bM = b.id === "medina-tour";
            if (aM !== bM) { return aM ? 1 : -1; }
            return timesFor(d, a).start < timesFor(d, b).start ? -1 : 1;
        });
    }

    /* Effective start/end for a date — supports per-date overrides via w.extraTimes */
    function timesFor(d, w) {
        var o = w.extraTimes && w.extraTimes[iso(d)];
        return { start: (o && o.start) || w.start, end: (o && o.end) || w.end };
    }

    /* Exact start moment of a session on a given date */
    function sessionStart(d, w) {
        var p = timesFor(d, w).start.split(":");
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), +p[0], +p[1] || 0);
    }

    /* Online booking is open while the session is more than the
       cutoff away, evaluated against the real current time */
    function isBookable(d, w) {
        return sessionStart(d, w).getTime() - now.getTime() >= cutoffMs;
    }

    function firstAvailable() {
        /* Today can never be booked online, so start looking from tomorrow */
        var d = new Date(today);
        d.setDate(d.getDate() + 1);
        for (var i = 0; i < 370; i++) {
            var sess = sessionsOn(d);
            for (var j = 0; j < sess.length; j++) {
                if (isBookable(d, sess[j])) { return new Date(d); }
            }
            d.setDate(d.getDate() + 1);
        }
        return null;
    }

    function renderCalendar() {
        var y = view.getFullYear();
        var m = view.getMonth();
        var firstOfMonth = new Date(y, m, 1);
        var daysInMonth = new Date(y, m + 1, 0).getDate();
        /* Monday-first offset */
        var offset = (firstOfMonth.getDay() + 6) % 7;

        var canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
        var lastView = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
        var canNext = view < lastView;

        var html = "";
        html += '<div class="cal__head">';
        html += '<h3 class="cal__month">' + (FR ? MONTHS[m].charAt(0).toUpperCase() + MONTHS[m].slice(1) : MONTHS[m]) + " " + y + "</h3>";
        html += '<div class="cal__nav">';
        html += '<button class="cal__btn" data-nav="-1" aria-label="' + (FR ? "Mois précédent" : "Previous month") + '"' + (canPrev ? "" : " disabled") + ">&larr;</button>";
        html += '<button class="cal__btn" data-nav="1" aria-label="' + (FR ? "Mois suivant" : "Next month") + '"' + (canNext ? "" : " disabled") + ">&rarr;</button>";
        html += "</div></div>";

        html += '<div class="cal__grid">';
        DOWS.forEach(function (d) { html += '<div class="cal__dow">' + d + "</div>"; });
        for (var i = 0; i < offset; i++) { html += "<div></div>"; }

        for (var day = 1; day <= daysInMonth; day++) {
            var d = new Date(y, m, day);
            /* Today and every past date are locked: greyed out like any
               empty day, no session markers, no click/select/detail access */
            var isDisabled = d.getTime() <= today.getTime();
            var sess = isDisabled ? [] : sessionsOn(d);
            var cls = "cal__day";

            if (isDisabled) {
                html += '<div class="' + cls + '" aria-disabled="true">' + day + "</div>";
            } else if (sess.length) {
                cls += " cal__day--avail";
                var dots = '<span class="cal__dots">' + sess.map(function (w) {
                    return '<i class="' + w.colorClass + '"></i>';
                }).join("") + "</span>";
                if (selected && d.getTime() === selected.getTime()) { cls += " cal__day--selected"; }
                var dayAria = FR
                    ? (sess.length + " atelier" + (sess.length > 1 ? "s" : "") + " le " + day + " " + MONTHS[m])
                    : (sess.length + " workshop" + (sess.length > 1 ? "s" : "") + " on " + MONTHS[m] + " " + day);
                html += '<button type="button" class="' + cls + '" data-date="' + iso(d) + '" aria-label="' +
                    dayAria + '">' +
                    day + dots + "</button>";
            } else {
                html += '<div class="' + cls + '">' + day + "</div>";
            }
        }
        html += "</div>";

        html += '<div class="cal__legend">' + CV_BOOKING.workshops.map(function (w) {
            return "<span><i class=\"" + w.colorClass + "\"></i>" + wName(w) + "</span>";
        }).join("") + "</div>";

        root.innerHTML = html;

        root.querySelectorAll("[data-nav]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                view = new Date(view.getFullYear(), view.getMonth() + parseInt(btn.dataset.nav, 10), 1);
                renderCalendar();
            });
        });
        root.querySelectorAll("[data-date]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var p = btn.dataset.date.split("-");
                selected = new Date(+p[0], +p[1] - 1, +p[2]);
                renderCalendar();
                renderPanel();
                if (window.innerWidth < 1020) {
                    panel.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
    }

    function renderPanel() {
        if (!selected) {
            panel.innerHTML = FR
                ? ('<p class="day-panel__date">Choisissez une date</p>' +
                    '<p class="day-panel__hint">Les dates signalées par un point ont des ateliers disponibles. Les réservations sont ouvertes jusqu&rsquo;à ' +
                    CV_BOOKING.monthsAhead + " mois à l&rsquo;avance.</p>" +
                    '<div class="day-panel__empty">Sélectionnez un jour mis en évidence dans le calendrier pour voir les sessions, les détails et le paiement sécurisé.</div>')
                : ('<p class="day-panel__date">Choose a date</p>' +
                    '<p class="day-panel__hint">Dates with a marker have workshops available. Bookings open up to ' +
                    CV_BOOKING.monthsAhead + " months ahead.</p>" +
                    '<div class="day-panel__empty">Select a highlighted day in the calendar to see the sessions, details and secure checkout.</div>');
            return;
        }
        var sess = sessionsOn(selected);
        var dateLabel = selected.toLocaleDateString(LOCALE, {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
        var html = '<p class="day-panel__date">' + dateLabel + "</p>";
        html += '<p class="day-panel__hint">' + (FR
            ? (sess.length + " atelier" + (sess.length > 1 ? "s" : "") + " disponible" + (sess.length > 1 ? "s" : "") +
                ". Ouvrez-en un pour les détails et la réservation.")
            : (sess.length + " workshop" + (sess.length > 1 ? "s" : "") +
                " available. Open one for details &amp; booking.")) + "</p>";

        if (!sess.length) {
            html += '<div class="day-panel__empty">' + (FR ? "Aucune session à cette date." : "No sessions on this date.") + "</div>";
        } else {
            var maxSpots = CV_BOOKING.maxSpots || 6;
            var minSpots = CV_BOOKING.minSpots || 2;
            var dateKey = iso(selected);
            sess.forEach(function (w, i) {
                var booked = (w.booked && w.booked[dateKey]) || 0;
                var left = Math.max(0, maxSpots - booked);
                var isFull = left === 0;
                var isClosed = !isFull && !isBookable(selected, w);
                var spotsCls = "sess__spots";
                var spotsLabel;
                if (isFull) {
                    spotsCls += " sess__spots--full";
                    spotsLabel = FR ? "Complet" : "Fully booked";
                } else if (isClosed) {
                    spotsCls += " sess__spots--full";
                    spotsLabel = FR ? "Réservations closes" : "Booking closed";
                } else if (booked > 0) {
                    if (left <= 2) { spotsCls += " sess__spots--low"; }
                    spotsLabel = FR
                        ? (booked + " place" + (booked > 1 ? "s" : "") + " réservée" + (booked > 1 ? "s" : "") + " sur " + maxSpots + " · " + left + " restante" + (left > 1 ? "s" : ""))
                        : (booked + " of " + maxSpots + " spots booked · " + left + " left");
                } else {
                    spotsLabel = FR ? (maxSpots + " places disponibles") : (maxSpots + " spots open");
                }
                html += '<article class="sess' + (isFull || isClosed ? " sess--full" : "") + (sess.length === 1 || i === 0 ? " open" : "") + '">';
                html += '<button type="button" class="sess__top" aria-expanded="true">';
                html += '<img class="sess__thumb" src="' + w.image + '" alt="' + wName(w) + '" loading="lazy">';
                html += '<span class="sess__meta"><span class="sess__name">' + wName(w) + "</span>" +
                    '<span class="sess__time">' + fmtT(timesFor(selected, w).start) + " – " + fmtT(timesFor(selected, w).end) + " · Tunis</span>" +
                    '<span class="' + spotsCls + '">' + spotsLabel + "</span></span>";
                html += '<span class="sess__price">' + w.price + "</span>";
                html += '<span class="sess__chev">▾</span>';
                html += "</button>";
                html += '<div class="sess__detail">';
                html += '<p class="sess__desc">' + wDesc(w) + "</p>";
                html += '<ul class="sess__facts">' + wFacts(w).map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>";
                if (isFull) {
                    var waFull = encodeURIComponent(FR
                        ? ("Bonjour Crafted Visions\u00a0! La session «\u00a0" + wName(w) + "\u00a0» du " + dateLabel + " est complète. Pourriez-vous m'ajouter à la liste d'attente\u00a0?")
                        : ("Hi Crafted Visions! " + wName(w) + " on " + dateLabel + " is fully booked. Could you add me to the waitlist?"));
                    html += '<div class="sess__full-note">' + (FR
                        ? ('Cette session est complète. <a href="https://wa.me/' + CV_BOOKING.whatsapp + '?text=' + waFull + '" target="_blank" rel="noopener">Écrivez-nous pour rejoindre la liste d&rsquo;attente</a> ou choisissez une autre date.')
                        : ('This session is fully booked. <a href="https://wa.me/' + CV_BOOKING.whatsapp + '?text=' + waFull + '" target="_blank" rel="noopener">Message us to join the waitlist</a> or pick another date.')) + '</div>';
                } else if (isClosed) {
                    var waLate = encodeURIComponent(FR
                        ? ("Bonjour Crafted Visions\u00a0! Reste-t-il une place de dernière minute pour «\u00a0" + wName(w) + "\u00a0» le " + dateLabel + "\u00a0?")
                        : ("Hi Crafted Visions! Is there any last-minute spot for " + wName(w) + " on " + dateLabel + "?"));
                    html += '<div class="sess__full-note">' + (FR
                        ? ('Réservations closes. La réservation en ligne ferme ' + (CV_BOOKING.bookingCutoffHours || 24) + '&nbsp;heures avant une session. ' +
                            '<a href="https://wa.me/' + CV_BOOKING.whatsapp + '?text=' + waLate + '" target="_blank" rel="noopener">Écrivez-nous sur WhatsApp</a> pour les disponibilités de dernière minute.')
                        : ('Booking closed. Online booking closes ' + (CV_BOOKING.bookingCutoffHours || 24) + '&nbsp;hours before a session. ' +
                            '<a href="https://wa.me/' + CV_BOOKING.whatsapp + '?text=' + waLate + '" target="_blank" rel="noopener">Message us on WhatsApp</a> for last-minute availability.')) + '</div>';
                } else {
                    html += '<a class="btn sess__book" target="_blank" rel="noopener" href="' + (w.stripeUrl || CV_BOOKING.stripeUrl) + '">' +
                        (FR ? "Réserver " : "Book ") + wName(w) + " · " + w.price + "</a>";
                    html += '<p class="sess__note">' + (FR
                        ? ("Paiement sécurisé via Stripe&nbsp;: sélectionnez votre atelier et votre date (" + dateLabel + ") à l&rsquo;étape suivante. Confirmation sous 24&nbsp;h. Une session a lieu à partir de " + minSpots + " participants.")
                        : ("Secure Stripe checkout: select your workshop and date (" + dateLabel + ") in the next step. Confirmation within 24&nbsp;h. A session takes place with a minimum of " + minSpots + " participants.")) + "</p>";
                }
                html += "</div></article>";
            });
        }

        /* Ask for a different workshop on this date */
        var waText = encodeURIComponent(FR
            ? ("Bonjour Crafted Visions\u00a0! J'aimerais beaucoup faire un autre atelier le " + dateLabel + ". Est-ce possible\u00a0?")
            : ("Hi Crafted Visions! I'd love to do a different workshop on " + dateLabel + ". Is that possible?"));
        var subject = encodeURIComponent((FR ? "Demande d'atelier\u00a0: " : "Workshop request: ") + dateLabel);
        html += '<div class="day-panel__ask">' + (FR
            ? ('Envie d&rsquo;un autre métier à cette date&nbsp;? ' +
                '<a href="https://wa.me/' + CV_BOOKING.whatsapp + '?text=' + waText + '" target="_blank" rel="noopener">Demandez-nous sur WhatsApp</a> ou ' +
                '<a href="mailto:' + CV_BOOKING.email + '?subject=' + subject + '">écrivez-nous</a> et nous ferons de notre mieux pour l&rsquo;organiser.')
            : ('Dreaming of a different craft on this date? ' +
                '<a href="https://wa.me/' + CV_BOOKING.whatsapp + '?text=' + waText + '" target="_blank" rel="noopener">Ask us on WhatsApp</a> or ' +
                '<a href="mailto:' + CV_BOOKING.email + '?subject=' + subject + '">email us</a> and we&rsquo;ll do our best to arrange it.')) + '</div>';

        panel.innerHTML = html;

        panel.querySelectorAll(".sess__top").forEach(function (btn) {
            btn.addEventListener("click", function () {
                btn.parentElement.classList.toggle("open");
            });
        });
    }

    /* Pre-select the first bookable date so the panel never starts empty */
    selected = firstAvailable();
    if (selected) { view = new Date(selected.getFullYear(), selected.getMonth(), 1); }
    renderCalendar();
    renderPanel();
})();
