/* Crafted Visions · shared behaviour: nav, reveal, newsletter, forms, FAQ */
(function () {
    "use strict";

    /* ── Language: French strings on /fr/ pages (html lang="fr"), English otherwise ── */
    var FR = (document.documentElement.getAttribute("lang") || "en").slice(0, 2) === "fr";
    var T = {
        emailInvalid: FR ? "Veuillez saisir une adresse e-mail valide." : "Please enter a valid email address.",
        submitting: FR ? "Envoi…" : "Submitting…",
        popupThanks: FR ? "Merci" : "Thank you",
        popupTitle: FR ? "Presque terminé" : "Almost there",
        popupText: FR ? "Vérifiez votre boîte de réception et cliquez sur le lien de confirmation pour finaliser votre inscription." : "Please check your inbox and click the confirmation link to complete your signup.",
        popupSpam: FR ? "Vous ne le voyez pas ? Pensez à vérifier votre dossier <strong>spam ou courrier indésirable</strong>." : "Don&rsquo;t see it? Please check your <strong>spam or junk</strong> folder.",
        close: FR ? "Fermer" : "Close",
        genericRetry: FR ? "Une erreur s&rsquo;est produite. Veuillez réessayer." : "Something went wrong. Please try again.",
        alreadyIn: FR ? "Vous êtes déjà inscrit(e) à la liste." : "You’re already on the list.",
        netRetry: FR ? "Erreur réseau. Veuillez réessayer." : "Network error. Please try again.",
        formNotConnected: FR ? "Le formulaire n’est pas encore connecté. Écrivez-nous directement à crafted.visions@outlook.com." : "The form is not connected yet. Please email us directly at crafted.visions@outlook.com.",
        sending: FR ? "Envoi…" : "Sending…",
        inquiryOk: FR ? "Merci. Nous avons bien reçu votre demande et vous répondrons sous un jour ouvré." : "Thank you. We’ve received your inquiry and will reply within one business day.",
        inquiryErr: FR ? "Une erreur s’est produite. Écrivez-nous à crafted.visions@outlook.com." : "Something went wrong. Please email us at crafted.visions@outlook.com.",
        inquiryNet: FR ? "Erreur réseau. Écrivez-nous à crafted.visions@outlook.com." : "Network error. Please email us at crafted.visions@outlook.com.",
        emailCopied: FR ? "Adresse e-mail copiée : " : "Email address copied: "
    };

    /* ── WhatsApp: assemble the number at runtime so it is never in the page source for scrapers ── */
    (function () {
        var num = ["491", "768", "736", "1752"].join("");
        document.querySelectorAll("a[data-wa]").forEach(function (a) {
            var text = a.getAttribute("data-wa-text");
            a.setAttribute("href", "https://wa.me/" + num + (text ? "?text=" + text : ""));
        });
    })();

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
    var MC_HONEYPOT = "b_329d7bb0d19143d6361e97af9_1495d74d12";

    /* Thank-you popup — injected once, reused across every page's footer form */
    function mcPopup() {
        var el = document.getElementById("mc-popup");
        if (el) { return el; }
        el = document.createElement("div");
        el.id = "mc-popup";
        el.className = "mc-popup";
        el.hidden = true;
        el.innerHTML =
            '<div class="mc-popup__box" role="dialog" aria-modal="true" aria-labelledby="mc-popup-title">' +
                '<button class="mc-popup__close" type="button" aria-label="' + T.close + '">×</button>' +
                '<p class="mc-popup__eyebrow">' + T.popupThanks + '</p>' +
                '<h3 class="mc-popup__title" id="mc-popup-title">' + T.popupTitle + '</h3>' +
                '<p class="mc-popup__text">' + T.popupText + '</p>' +
                '<p class="mc-popup__note">' + T.popupSpam + '</p>' +
            '</div>';
        document.body.appendChild(el);
        function close() { el.hidden = true; }
        el.querySelector(".mc-popup__close").addEventListener("click", close);
        el.addEventListener("click", function (e) { if (e.target === el) { close(); } });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !el.hidden) { close(); } });
        return el;
    }

    document.querySelectorAll("form[data-newsletter]").forEach(function (form) {
        var email = form.querySelector("input[type=email]");
        var msg = form.parentElement.querySelector(".newsletter__msg");
        var btn = form.querySelector("button");
        /* Bot protection: inject the Mailchimp honeypot if it isn't in the markup */
        if (!form.querySelector('input[name="' + MC_HONEYPOT + '"]')) {
            var hp = document.createElement("div");
            hp.setAttribute("aria-hidden", "true");
            hp.style.cssText = "position:absolute; left:-5000px;";
            hp.innerHTML = '<input type="text" name="' + MC_HONEYPOT + '" tabindex="-1" value="" autocomplete="off">';
            form.appendChild(hp);
        }
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var val = email.value.trim();
            if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                if (msg) { msg.textContent = T.emailInvalid; }
                return;
            }
            if (msg) { msg.textContent = T.submitting; }
            btn.disabled = true;
            var hpField = form.querySelector('input[name="' + MC_HONEYPOT + '"]');
            var cb = "mcCallback_" + Date.now();
            var url = MC_URL + "&EMAIL=" + encodeURIComponent(val) +
                "&" + MC_HONEYPOT + "=" + encodeURIComponent(hpField ? hpField.value : "") +
                "&c=" + cb;
            var script = document.createElement("script");
            window[cb] = function (data) {
                btn.disabled = false;
                if (data.result === "success") {
                    if (msg) { msg.textContent = ""; }
                    form.reset();
                    mcPopup().hidden = false;
                } else {
                    var err = (data.msg || T.genericRetry).replace(/<[^>]+>/g, "");
                    if (/already subscribed/i.test(err)) { err = T.alreadyIn; }
                    if (msg) { msg.textContent = err; }
                }
                delete window[cb];
                if (script.parentNode) { script.parentNode.removeChild(script); }
            };
            script.src = url;
            script.onerror = function () {
                btn.disabled = false;
                if (msg) { msg.textContent = T.netRetry; }
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
                msg.textContent = T.formNotConnected;
                msg.className = "form__msg form__msg--err";
                return;
            }
            msg.textContent = T.sending;
            msg.className = "form__msg";
            btn.disabled = true;
            fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" }
            }).then(function (res) {
                btn.disabled = false;
                if (res.ok) {
                    msg.textContent = T.inquiryOk;
                    msg.className = "form__msg form__msg--ok";
                    form.reset();
                } else {
                    msg.textContent = T.inquiryErr;
                    msg.className = "form__msg form__msg--err";
                }
            }).catch(function () {
                btn.disabled = false;
                msg.textContent = T.inquiryNet;
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
            showToast(T.emailCopied + email);
        });
    });

    /* ── Inline reel: click the poster to play the video in place (no redirect) ── */
    document.querySelectorAll(".reel--video").forEach(function (reel) {
        var video = reel.querySelector(".reel__video");
        var trigger = reel.querySelector(".reel__trigger");
        if (!video || !trigger) { return; }
        trigger.addEventListener("click", function () {
            video.controls = true;
            reel.classList.add("reel--playing");
            var p = video.play();
            if (p && p["catch"]) { p["catch"](function () { video.controls = true; }); }
        });
    });
})();
