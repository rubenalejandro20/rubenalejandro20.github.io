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
