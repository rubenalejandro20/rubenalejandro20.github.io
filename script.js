// Smooth scroll + quick transition feel
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();

    document.querySelectorAll(".section").forEach(sec => sec.classList.add("fade-out"));

    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(() => {
        document.querySelectorAll(".section").forEach(sec => sec.classList.remove("fade-out"));
      }, 250);
    }, 120);
  });
});
