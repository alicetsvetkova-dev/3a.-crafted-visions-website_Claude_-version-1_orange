/* Crafted Visions · shared behaviour: nav, reveal, newsletter, forms, FAQ */
(function () {
    "use strict";

    /* ── Mobile nav ── */
    var burger = document.getElementById("nav-burger");
    var links = document.getElementById("nav-links");
    if (burger && links) {
        burger.addEventListener("click", function () {
            var open = links.classList.toggle("open");
            burger.classList.toggle("open", open);
            burger.setAttribute("aria-expanded", open);
            document.body.style.overflow = open ? "hidden" : "";
        });
        links.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                links.classList.remove("open");
                burger.classList.remove("open");
                burger.setAttribute("aria-expanded", "false");
                document.body.style.overflow = "";
            });
        });
    }

    /* ── Scroll reveal ──
       Elements animate in on scroll, but nothing is ever left invisible:
       anything already in or above the viewport (including after an anchor
       jump to #calendar / #inquire / #how) is revealed immediately. */
    var reveals = document.querySelectorAll(".reveal");
    function revealInView() {
        reveals.forEach(function (el) {
            if (!el.classList.contains("in") &&
                el.getBoundingClientRect().top < window.innerHeight * 0.92) {
                el.classList.add("in");
            }
        });
    }
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("in");
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
        reveals.forEach(function (el) { io.observe(el); });
        revealInView();
        /* Safety net: a geometric check on load, scroll, resize and hash-jump, so a
           fast scroll or an anchor jump can never leave a section stuck invisible. */
        var ticking = false;
        function onScroll() {
            if (ticking) { return; }
            ticking = true;
            window.requestAnimationFrame(function () { revealInView(); ticking = false; });
        }
        window.addEventListener("load", revealInView);
        window.addEventListener("hashchange", revealInView);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
    } else {
        reveals.forEach(function (el) { el.classList.add("in"); });
    }

    /* ── FAQ accordions ── */
    document.querySelectorAll(".faq__q").forEach(function (btn) {
        btn.setAttribute("aria-expanded", "false");
        btn.addEventListener("click", function () {
            var open = btn.parentElement.classList.toggle("open");
            btn.setAttribute("aria-expanded", open ? "true" : "false");
        });
    });

    /* ── Newsletter (Mailchimp JSONP) ── */
    var MC_URL = "https://outlook.us13.list-manage.com/subscribe/post-json?u=329d7bb0d19143d6361e97af9&id=1495d74d12&f_id=0089c3e1f0";
    document.querySelectorAll("form[data-newsletter]").forEach(function (form) {
        var email = form.querySelector("input[type=email]");
        var msg = form.parentElement.querySelector(".newsletter__msg");
        var btn = form.querySelector("button");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var val = email.value.trim();
            if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                if (msg) { msg.textContent = "Please enter a valid email address."; }
                return;
            }
            if (msg) { msg.textContent = "Submitting…"; }
            btn.disabled = true;
            var cb = "mcCallback_" + Date.now();
            var url = MC_URL + "&EMAIL=" + encodeURIComponent(val) +
                "&b_329d7bb0d19143d6361e97af9_1495d74d12=&c=" + cb;
            var script = document.createElement("script");
            window[cb] = function (data) {
                btn.disabled = false;
                if (data.result === "success") {
                    if (msg) { msg.textContent = "Almost there. Check your inbox and confirm your signup."; }
                    form.reset();
                } else {
                    var err = (data.msg || "Something went wrong. Please try again.").replace(/<[^>]+>/g, "");
                    if (/already subscribed/i.test(err)) { err = "You’re already on the list."; }
                    if (msg) { msg.textContent = err; }
                }
                delete window[cb];
                if (script.parentNode) { script.parentNode.removeChild(script); }
            };
            script.src = url;
            script.onerror = function () {
                btn.disabled = false;
                if (msg) { msg.textContent = "Network error. Please try again."; }
                delete window[cb];
            };
            document.body.appendChild(script);
        });
    });

    /* ── Inquiry form (Formspree) ── */
    document.querySelectorAll("form[data-inquiry]").forEach(function (form) {
        var msg = form.querySelector(".form__msg");
        var btn = form.querySelector("button[type=submit]");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
                msg.textContent = "The form is not connected yet. Please email us directly at crafted.visions@outlook.com.";
                msg.className = "form__msg form__msg--err";
                return;
            }
            msg.textContent = "Sending…";
            msg.className = "form__msg";
            btn.disabled = true;
            fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" }
            }).then(function (res) {
                btn.disabled = false;
                if (res.ok) {
                    msg.textContent = "Thank you. We’ve received your inquiry and will reply within one business day.";
                    msg.className = "form__msg form__msg--ok";
                    form.reset();
                } else {
                    msg.textContent = "Something went wrong. Please email us at crafted.visions@outlook.com.";
                    msg.className = "form__msg form__msg--err";
                }
            }).catch(function () {
                btn.disabled = false;
                msg.textContent = "Network error. Please email us at crafted.visions@outlook.com.";
                msg.className = "form__msg form__msg--err";
            });
        });
    });

    /* ── Email links: always copy the address + confirm, and still open the
       user's mail app if one is set (so a click is never a dead end) ── */
    var toast;
    function showToast(text) {
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "cv-toast";
            toast.setAttribute("role", "status");
            document.body.appendChild(toast);
        }
        toast.textContent = text;
        toast.classList.add("show");
        clearTimeout(toast._t);
        toast._t = setTimeout(function () { toast.classList.remove("show"); }, 2600);
    }
    function fallbackCopy(text) {
        try {
            var ta = document.createElement("textarea");
            ta.value = text; ta.setAttribute("readonly", "");
            ta.style.position = "absolute"; ta.style.left = "-9999px";
            document.body.appendChild(ta); ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        } catch (e) { /* clipboard not available */ }
    }
    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)["catch"](function () { fallbackCopy(text); });
        } else {
            fallbackCopy(text);
        }
    }
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.addEventListener("click", function () {
            /* Let the mailto open the user's mail app (the expected behaviour).
               We also copy the address silently and confirm, so anyone without a
               mail app configured still gets the address and clear feedback
               instead of a dead click. */
            var email = a.getAttribute("href").replace(/^mailto:/i, "").split("?")[0];
            copyText(email);
            showToast("Email address copied: " + email);
        });
    });
})();
