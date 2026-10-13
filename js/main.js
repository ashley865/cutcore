// Cutcore Upholstery — shared site behaviour
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Contact form -> hands the enquiry straight to WhatsApp (no backend needed)
  var WHATSAPP_NUMBER = "27825948002";
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (document.getElementById("name") || {}).value || "";
      var phone = (document.getElementById("phone") || {}).value || "";
      var email = (document.getElementById("email") || {}).value || "";
      var item = (document.getElementById("item") || {}).value || "";
      var message = (document.getElementById("message") || {}).value || "";
      var status = document.getElementById("form-status");

      if (!name.trim() || !phone.trim()) {
        if (status) {
          status.textContent = "Please add your name and phone number so we can reply.";
          status.classList.add("visible");
          status.classList.remove("success");
        }
        return;
      }

      var lines = [
        "Hi Cutcore Upholstery, I'd like a quote:",
        "Name: " + name,
        "Phone: " + phone
      ];
      if (email.trim()) lines.push("Email: " + email);
      if (item.trim()) lines.push("Item: " + item);
      if (message.trim()) lines.push("Details: " + message);

      var waText = encodeURIComponent(lines.join("\n"));
      var waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + waText;

      if (status) {
        status.textContent = "Opening WhatsApp with your details filled in — just hit send there.";
        status.classList.add("visible", "success");
      }

      window.open(waUrl, "_blank", "noopener");
      form.reset();
    });
  }

  // Google reviews slideshow
  var slider = document.querySelector("[data-review-slider]");
  if (slider) {
    var track = slider.querySelector("[data-review-track]");
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".review-slide"));
    var dotsWrap = slider.querySelector("[data-review-dots]");
    var prevBtn = slider.querySelector("[data-review-prev]");
    var nextBtn = slider.querySelector("[data-review-next]");
    var index = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to review " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, i) {
        d.setAttribute("aria-current", i === index ? "true" : "false");
      });
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function start() {
      timer = window.setInterval(next, 6000);
    }
    function restart() {
      if (timer) window.clearInterval(timer);
      start();
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    slider.addEventListener("mouseenter", function () { if (timer) window.clearInterval(timer); });
    slider.addEventListener("mouseleave", start);

    // basic touch swipe
    var touchStartX = null;
    track.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) {
        delta < 0 ? next() : prev();
        restart();
      }
      touchStartX = null;
    });

    render();
    start();
  }

  // POPIA / cookie notice
  var COOKIE_KEY = "cutcore_cookie_choice";
  var banner = document.getElementById("cookie-banner");
  if (banner) {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        banner.classList.add("visible");
      }
    } catch (err) {
      banner.classList.add("visible");
    }
    banner.querySelectorAll("[data-cookie-choice]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try {
          localStorage.setItem(COOKIE_KEY, btn.getAttribute("data-cookie-choice"));
        } catch (err) {
          /* private browsing — ignore */
        }
        banner.classList.remove("visible");
      });
    });
  }
})();
