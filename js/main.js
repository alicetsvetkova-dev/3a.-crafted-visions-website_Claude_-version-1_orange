/* Crafted Visions — shared behaviour: nav, reveal, newsletter, forms, FAQ */
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

    /* ── Scroll reveal ── */
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("in");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else {
        document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }

    /* ── FAQ accordions ── */
    document.querySelectorAll(".faq__q").forEach(function (btn) {
        btn.addEventListener("click", function () {
            btn.parentElement.classList.toggle("open");
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
                    if (msg) { msg.textContent = "Almost there — check your inbox and confirm your signup."; }
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
                msg.textContent = "The form is not connected yet — please email us directly at crafted.visions@outlook.com.";
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
                    msg.textContent = "Thank you — we’ve received your inquiry and will reply within one business day.";
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
})();
