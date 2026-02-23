// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scroll + quick "page transition" feel
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // Fade sections out quickly
    document.querySelectorAll(".section").forEach(sec => sec.classList.add("fade-out"));

    // Scroll, then fade back in
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(() => {
        document.querySelectorAll(".section").forEach(sec => sec.classList.remove("fade-out"));
      }, 250);
    }, 120);
  });
});

// Page Fade-In
window.addEventListener("load", function () {
  document.body.classList.add("page-loaded");
});

// Fade-Out on Internal Navigation
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (
      href &&
      !href.startsWith("#") &&
      !this.hasAttribute("target") &&
      !href.startsWith("http")
    ) {
      e.preventDefault();
      document.body.classList.remove("page-loaded");

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  });
});
