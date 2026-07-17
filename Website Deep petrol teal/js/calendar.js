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
   ============================================================ */
(function () {
    "use strict";

    var root = document.getElementById("cv-calendar");
    var panel = document.getElementById("cv-day-panel");
    if (!root || !panel || typeof CV_BOOKING === "undefined") { return; }

    var MONTHS = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    var DOWS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
        }).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
    }

    /* Exact start moment of a session on a given date */
    function sessionStart(d, w) {
        var p = w.start.split(":");
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
        html += '<h3 class="cal__month">' + MONTHS[m] + " " + y + "</h3>";
        html += '<div class="cal__nav">';
        html += '<button class="cal__btn" data-nav="-1" aria-label="Previous month"' + (canPrev ? "" : " disabled") + ">&larr;</button>";
        html += '<button class="cal__btn" data-nav="1" aria-label="Next month"' + (canNext ? "" : " disabled") + ">&rarr;</button>";
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
                html += '<button type="button" class="' + cls + '" data-date="' + iso(d) + '" aria-label="' +
                    sess.length + " workshop" + (sess.length > 1 ? "s" : "") + " on " + MONTHS[m] + " " + day + '">' +
                    day + dots + "</button>";
            } else {
                html += '<div class="' + cls + '">' + day + "</div>";
            }
        }
        html += "</div>";

        html += '<div class="cal__legend">' + CV_BOOKING.workshops.map(function (w) {
            return "<span><i class=\"" + w.colorClass + "\"></i>" + w.name + "</span>";
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
            panel.innerHTML =
                '<p class="day-panel__date">Choose a date</p>' +
                '<p class="day-panel__hint">Dates with a marker have workshops available. Bookings open up to ' +
                CV_BOOKING.monthsAhead + " months ahead.</p>" +
                '<div class="day-panel__empty">Select a highlighted day in the calendar to see the sessions, details and secure checkout.</div>';
            return;
        }
        var sess = sessionsOn(selected);
        var dateLabel = selected.toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
        var html = '<p class="day-panel__date">' + dateLabel + "</p>";
        html += '<p class="day-panel__hint">' + sess.length + " workshop" + (sess.length > 1 ? "s" : "") +
            " available. Open one for details &amp; booking.</p>";

        if (!sess.length) {
            html += '<div class="day-panel__empty">No sessions on this date.</div>';
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
                    spotsLabel = "Fully booked";
                } else if (isClosed) {
                    spotsCls += " sess__spots--full";
                    spotsLabel = "Booking closed";
                } else if (booked > 0) {
                    if (left <= 2) { spotsCls += " sess__spots--low"; }
                    spotsLabel = booked + " of " + maxSpots + " spots booked · " + left + " left";
                } else {
                    spotsLabel = maxSpots + " spots open";
                }
                html += '<article class="sess' + (isFull || isClosed ? " sess--full" : "") + (sess.length === 1 || i === 0 ? " open" : "") + '">';
                html += '<button type="button" class="sess__top" aria-expanded="true">';
                html += '<img class="sess__thumb" src="' + w.image + '" alt="' + w.name + '" loading="lazy">';
                html += '<span class="sess__meta"><span class="sess__name">' + w.name + "</span>" +
                    '<span class="sess__time">' + w.start + " – " + w.end + " · Tunis</span>" +
                    '<span class="' + spotsCls + '">' + spotsLabel + "</span></span>";
                html += '<span class="sess__price">' + w.price + "</span>";
                html += '<span class="sess__chev">▾</span>';
                html += "</button>";
                html += '<div class="sess__detail">';
                html += '<p class="sess__desc">' + w.desc + "</p>";
                html += '<ul class="sess__facts">' + w.facts.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>";
                if (isFull) {
                    var waFull = encodeURIComponent("Hi Crafted Visions! " + w.name + " on " + dateLabel +
                        " is fully booked. Could you add me to the waitlist?");
                    html += '<div class="sess__full-note">This session is fully booked. ' +
                        '<a href="https://wa.me/' + CV_BOOKING.whatsapp + '?text=' + waFull + '" target="_blank" rel="noopener">Message us to join the waitlist</a> or pick another date.</div>';
                } else if (isClosed) {
                    var waLate = encodeURIComponent("Hi Crafted Visions! Is there any last-minute spot for " +
                        w.name + " on " + dateLabel + "?");
                    html += '<div class="sess__full-note">Booking closed. Online booking closes ' +
                        (CV_BOOKING.bookingCutoffHours || 24) + '&nbsp;hours before a session. ' +
                        '<a href="https://wa.me/' + CV_BOOKING.whatsapp + '?text=' + waLate + '" target="_blank" rel="noopener">Message us on WhatsApp</a> for last-minute availability.</div>';
                } else {
                    html += '<a class="btn sess__book" target="_blank" rel="noopener" href="' + CV_BOOKING.stripeUrl + '">Book ' +
                        w.name + " · " + w.price + "</a>";
                    html += '<p class="sess__note">Secure Stripe checkout: select your workshop and date (' +
                        dateLabel + ") in the next step. Confirmation within 24&nbsp;h. " +
                        "A session takes place with a minimum of " + minSpots + " participants.</p>";
                }
                html += "</div></article>";
            });
        }

        /* Ask for a different workshop on this date */
        var waText = encodeURIComponent("Hi Crafted Visions! I'd love to do a different workshop on " +
            dateLabel + ". Is that possible?");
        html += '<div class="day-panel__ask">Dreaming of a different craft on this date? ' +
            '<a href="https://wa.me/' + CV_BOOKING.whatsapp + '?text=' + waText + '" target="_blank" rel="noopener">Ask us on WhatsApp</a> or ' +
            '<a href="mailto:' + CV_BOOKING.email + '?subject=' + encodeURIComponent("Workshop request: " + dateLabel) + '">email us</a> and we&rsquo;ll do our best to arrange it.</div>';

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
