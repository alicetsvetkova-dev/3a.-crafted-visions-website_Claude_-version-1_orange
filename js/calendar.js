/* ============================================================
   CRAFTED VISIONS — Booking calendar engine
   Renders a month grid from CV_BOOKING (js/schedule.js) and a
   day panel with the sessions of the selected date.
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

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var minDate = new Date(today);
    minDate.setDate(minDate.getDate() + CV_BOOKING.minLeadDays);

    var maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + CV_BOOKING.monthsAhead);

    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selected = null;

    function iso(d) {
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    }

    function sessionsOn(d) {
        if (d < minDate || d > maxDate) { return []; }
        var key = iso(d);
        return CV_BOOKING.workshops.filter(function (w) {
            if (w.except && w.except.indexOf(key) !== -1) { return false; }
            if (w.extra && w.extra.indexOf(key) !== -1) { return true; }
            return d.getDay() === w.weekday;
        }).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
    }

    function firstAvailable() {
        var d = new Date(minDate);
        for (var i = 0; i < 370; i++) {
            if (sessionsOn(d).length) { return new Date(d); }
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
            var sess = sessionsOn(d);
            var cls = "cal__day";
            var isToday = d.getTime() === today.getTime();
            if (isToday) { cls += " cal__day--today"; }
            if (sess.length) { cls += " cal__day--avail"; }
            if (selected && d.getTime() === selected.getTime()) { cls += " cal__day--selected"; }
            var dots = "";
            if (sess.length) {
                dots = '<span class="cal__dots">' + sess.map(function (w) {
                    return '<i class="' + w.colorClass + '"></i>';
                }).join("") + "</span>";
            }
            if (sess.length) {
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
            " available — open one for details &amp; booking.</p>";

        if (!sess.length) {
            html += '<div class="day-panel__empty">No sessions on this date.</div>';
        } else {
            sess.forEach(function (w, i) {
                html += '<article class="sess' + (sess.length === 1 || i === 0 ? " open" : "") + '">';
                html += '<button type="button" class="sess__top" aria-expanded="true">';
                html += '<img class="sess__thumb" src="' + w.image + '" alt="' + w.name + '" loading="lazy">';
                html += '<span class="sess__meta"><span class="sess__name">' + w.name + "</span>" +
                    '<span class="sess__time">' + w.start + " – " + w.end + " · Tunis</span></span>";
                html += '<span class="sess__price">' + w.price + "</span>";
                html += '<span class="sess__chev">▾</span>';
                html += "</button>";
                html += '<div class="sess__detail">';
                html += '<p class="sess__desc">' + w.desc + "</p>";
                html += '<ul class="sess__facts">' + w.facts.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>";
                html += '<a class="btn sess__book" target="_blank" rel="noopener" href="' + CV_BOOKING.stripeUrl + '">Book ' +
                    w.name + " — " + w.price + "</a>";
                html += '<p class="sess__note">Secure Stripe checkout — confirm your workshop and date (' +
                    dateLabel + ") in the next step. Confirmation within 24&nbsp;h.</p>";
                html += "</div></article>";
            });
        }
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
