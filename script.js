// Certificate database
const certificates = [
  { title: "Python Programming with Red Hat (AD141 - RHA) v9.0", issuer: "Red Hat", date: "22 Mar 2025", category: "courses", file: "redhat-python-ad141.pdf" },
  { title: "Network Automation with Red Hat Ansible (DO457)", issuer: "Red Hat", date: "02 Sep 2026", category: "courses", file: "redhat-network-automation-do457.pdf" },
  { title: "Data Structures & Algorithms using Python", issuer: "Infosys Springboard", date: "27 Oct 2025", category: "courses", file: "infosys-dsa-python.pdf" },
  { title: "Mastering Agentic AI: Prompt to Production", issuer: "Udemy", date: "21 Aug 2026 (38h)", category: "courses", file: "udemy-agentic-ai.pdf" },
  { title: "Flipkart GRiD 6.0 Tech Quiz (Dev Track)", issuer: "Unstop x Flipkart", date: "Participation", category: "events", file: "flipkart-grid-quiz.pdf" },
  { title: "Artificial Intelligence Internship (4 weeks)", issuer: "Kodbud", date: "30 Apr 2026", category: "internships", file: "kodbud-ai-internship.pdf" },
  { title: "Python Programming Internship", issuer: "Maincrafts Technology", date: "20 Jun 2026", category: "internships", file: "maincrafts-python-internship.pdf" }
];

let curCertIdx = 0;
let filteredCerts = [...certificates];

document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle with try/catch
  const themeBtn = document.getElementById("theme-toggle");
  try {
    const saved = localStorage.getItem("theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}

  themeBtn?.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") !== "light";
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Mobile menu
  document.getElementById("mobile-menu-btn")?.addEventListener("click", () => {
    document.querySelector(".nav-links")?.classList.toggle("open");
  });

  // Scroll Progress
  const progress = document.getElementById("scroll-progress");
  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && h > 0) progress.style.width = `${(window.scrollY / h) * 100}%`;
  }, { passive: true });

  // Cursor Glow
  const glow = document.getElementById("cursor-glow");
  if (glow && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });
  }

  // Typing animation
  const typeText = document.getElementById("type-text");
  const words = ["CSE Student", "Python Developer", "IEEE Volunteer", "Problem Solver"];
  let wIdx = 0, charIdx = 0, isDeleting = false;
  function typeLoop() {
    const curr = words[wIdx];
    if (isDeleting) charIdx--; else charIdx++;
    if (typeText) typeText.textContent = curr.substring(0, charIdx);
    let speed = isDeleting ? 45 : 90;
    if (!isDeleting && charIdx === curr.length) { speed = 1800; isDeleting = true; }
    else if (isDeleting && charIdx === 0) { isDeleting = false; wIdx = (wIdx + 1) % words.length; speed = 400; }
    setTimeout(typeLoop, speed);
  }
  typeLoop();

  // Scroll reveal + Counter + Skill bars
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      // Animate stat counters
      entry.target.querySelectorAll(".stat-num").forEach(num => {
        const target = +num.dataset.target;
        let count = 0, step = target / 30;
        const timer = setInterval(() => {
          count += step;
          if (count >= target) { num.textContent = target + (num.dataset.suffix || ""); clearInterval(timer); }
          else num.textContent = Math.ceil(count) + (num.dataset.suffix || "");
        }, 35);
      });
      // Fill skill bars
      entry.target.querySelectorAll(".progress-fill").forEach(bar => {
        bar.style.width = bar.dataset.level + "%";
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

  // 3D tilt on project cards
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".project-card").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateY(0) rotateX(0) translateY(0)";
      });
    });
  }

  // Render certificates
  renderCerts("all");
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCerts(btn.dataset.filter);
    });
  });

  // Modal handlers
  const modal = document.getElementById("cert-modal");
  const closeBtn = document.getElementById("modal-close");
  const prevBtn = document.getElementById("modal-prev");
  const nextBtn = document.getElementById("modal-next");
  const closeModal = () => { modal.classList.remove("active"); document.body.style.overflow = ""; };

  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") navCert(-1);
    if (e.key === "ArrowRight") navCert(1);
  });
  prevBtn?.addEventListener("click", () => navCert(-1));
  nextBtn?.addEventListener("click", () => navCert(1));

  // Quests & XP system
  let xp = 0;
  let completed = [];
  try {
    xp = parseInt(localStorage.getItem("user_xp") || "0", 10);
    completed = JSON.parse(localStorage.getItem("completed_quests") || "[]");
  } catch (e) {}

  function updateXpHud() {
    const lvl = Math.floor(xp / 100) + 1;
    const curLevelXp = xp % 100;
    const hudLvl = document.getElementById("hud-level");
    const hudXp = document.getElementById("hud-xp");
    const hudBar = document.getElementById("xp-bar-fill");
    if (hudLvl) hudLvl.textContent = `Level ${lvl}`;
    if (hudXp) hudXp.textContent = `${xp} XP`;
    if (hudBar) hudBar.style.width = `${curLevelXp}%`;
    completed.forEach(id => {
      const q = document.querySelector(`[data-quest-id="${id}"]`);
      if (q) {
        q.classList.add("completed");
        const rew = q.querySelector(".quest-reward");
        if (rew) rew.textContent = "Claimed ✓";
      }
    });
  }
  updateXpHud();

  document.querySelectorAll(".quest-card").forEach(q => {
    q.addEventListener("click", () => {
      const qId = q.dataset.questId;
      if (!completed.includes(qId)) {
        completed.push(qId);
        xp += 100;
        try {
          localStorage.setItem("user_xp", xp.toString());
          localStorage.setItem("completed_quests", JSON.stringify(completed));
        } catch (e) {}
        updateXpHud();
      }
    });
  });

  // Email copy button
  const copyBtn = document.getElementById("copy-email-btn");
  copyBtn?.addEventListener("click", () => {
    const email = document.getElementById("email-text")?.textContent;
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        copyBtn.textContent = "Copied! ✓";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
      });
    }
  });
});

function renderCerts(filter) {
  const container = document.getElementById("cert-container");
  filteredCerts = filter === "all" ? certificates : certificates.filter(c => c.category === filter);
  if (!container) return;
  container.innerHTML = filteredCerts.map((c, i) => `
    <div class="glass-card cert-card">
      <div>
        <span class="cert-issuer-badge badge-${c.category}">${c.issuer}</span>
        <h3 class="cert-title">${c.title}</h3>
        <p class="cert-meta">📅 ${c.date}</p>
      </div>
      <button class="btn btn-outline" style="width:100%;justify-content:center;" onclick="openCert(${i})">
        View Certificate
      </button>
    </div>
  `).join("");
}

function openCert(idx) {
  curCertIdx = idx;
  const cert = filteredCerts[idx];
  const modal = document.getElementById("cert-modal");
  const iframe = document.getElementById("modal-frame");
  const title = document.getElementById("modal-title");
  const openNew = document.getElementById("modal-open-new");
  const download = document.getElementById("modal-download");
  const filePath = `assets/certificates/${cert.file}`;

  if (title) title.textContent = cert.title;
  if (iframe) iframe.src = filePath;
  if (openNew) openNew.href = filePath;
  if (download) { download.href = filePath; download.setAttribute("download", cert.file); }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function navCert(step) {
  curCertIdx = (curCertIdx + step + filteredCerts.length) % filteredCerts.length;
  openCert(curCertIdx);
}
