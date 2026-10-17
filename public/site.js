// The pill in the top edge opens on hover where there is a mouse, and on a tap everywhere else.
const island = document.getElementById("island");
const pill = island.querySelector(".island-pill");

function setOpen(open) {
  island.dataset.open = String(open);
  pill.setAttribute("aria-expanded", String(open));
}

pill.addEventListener("click", () => setOpen(island.dataset.open !== "true"));
island.querySelectorAll(".island-links a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
document.addEventListener("click", (e) => { if (!island.contains(e.target)) setOpen(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

// Copy buttons next to commands.
document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", () => {
  navigator.clipboard.writeText(b.dataset.copy).then(() => {
    b.textContent = "Copied";
    setTimeout(() => { b.textContent = "Copy"; }, 1500);
  });
}));

// People who ask for less motion get the posters, with controls to play a clip if they want to.
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("video[autoplay]").forEach((v) => {
    v.removeAttribute("autoplay");
    v.pause();
    v.controls = true;
  });
}
