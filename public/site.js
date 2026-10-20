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

// Releases page: the newest GitHub build, its download count and the earlier builds come from the GitHub API.
// The HTML already names the newest build, so the card still works if the call fails or hits the hourly limit.
const ghCard = document.getElementById("gh-card");
if (ghCard) {
  const msix = (r) => r.assets.find((a) => a.name.endsWith(".msix"));
  const day = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const downloads = (r) => `${msix(r).download_count.toLocaleString("en-US")} downloads`;
  const field = (name) => ghCard.querySelector(`[data-gh="${name}"]`);
  fetch("https://api.github.com/repos/xditya/tomte-windows/releases?per_page=100")
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((all) => {
      const [latest, ...older] = all.filter((r) => !r.draft && msix(r));
      if (!latest) return;
      field("tag").textContent = latest.tag_name;
      field("date").textContent = day(latest.published_at);
      field("count").textContent = `${Math.round(msix(latest).size / 1048576)} MB · ${downloads(latest)}`;
      field("link").href = latest.html_url;
      if (!older.length) return;
      const list = document.getElementById("gh-list");
      for (const r of older) {
        const li = document.createElement("li");
        const span = (cls, text) => { const e = li.appendChild(document.createElement("span")); e.className = cls; e.textContent = text; };
        const link = (href, text) => { const a = li.appendChild(document.createElement("a")); a.href = href; a.textContent = text; };
        span("mono", r.tag_name);
        if (r.prerelease) span("rel-badge", "pre-release");
        span("mono rel-date", day(r.published_at));
        span("mono rel-count", downloads(r));
        link(msix(r).browser_download_url, ".msix");
        link(r.html_url, "notes");
        list.appendChild(li);
      }
      document.getElementById("gh-history").hidden = false;
    })
    .catch(() => {});
}

