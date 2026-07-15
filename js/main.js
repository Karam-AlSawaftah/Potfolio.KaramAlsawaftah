/* ============================================================
   RENDERING — reads everything from js/data.js and builds the
   page. You normally never need to edit this file.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  /* ---------- small helpers ---------- */

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function chipList(items, className) {
    const ul = el("ul", className);
    items.forEach((item) => ul.appendChild(el("li", "chip", item)));
    return ul;
  }

  // Deterministic placeholder art per project (used when no image is set)
  function placeholderArt(project, index) {
    const hues = [45, 8, 28, 0, 52, 16];
    const hue = hues[index % hues.length];
    const art = el("div", "card-art");
    art.style.setProperty("--art-hue", hue);
    art.appendChild(el("span", "card-art-badge", project.badge || "XR"));
    return art;
  }

  /* ---------- hero + header ---------- */

  function renderHero() {
    $("#hero-name").textContent = SITE.name;
    $("#hero-role").textContent = SITE.role;
    $("#hero-tagline").textContent = SITE.tagline;
    $("#hero-location").textContent = SITE.location;
    $("#about-summary").textContent = SITE.summary;
    $("#brand-name").textContent = SITE.name;
    $("#footer-name").textContent = `© ${new Date().getFullYear()} ${SITE.name}`;

    const linksWrap = $("#hero-links");
    SITE.links.forEach((link) => {
      const a = el("a", "btn btn-ghost", link.label);
      a.href = link.url;
      if (!link.url.startsWith("mailto:")) {
        a.target = "_blank";
        a.rel = "noreferrer noopener";
      }
      linksWrap.appendChild(a);
    });
  }

  /* ---------- projects ---------- */

  function renderProjectCard(project, index) {
    const card = el("article", "project-card");
    card.id = project.id;

    if (project.image) {
      const img = el("img", "card-art card-art-img");
      img.src = project.image;
      img.alt = project.title;
      img.loading = "lazy";
      card.appendChild(img);
    } else {
      card.appendChild(placeholderArt(project, index));
    }

    const body = el("div", "card-body");

    const top = el("div", "card-top");
    top.appendChild(el("h4", "card-title", project.title));
    if (project.timeframe) top.appendChild(el("span", "card-time", project.timeframe));
    body.appendChild(top);

    if (project.role) body.appendChild(el("p", "card-role", project.role));
    body.appendChild(el("p", "card-summary", project.summary));

    if (project.highlights && project.highlights.length) {
      const ul = el("ul", "card-highlights");
      project.highlights.forEach((h) => ul.appendChild(el("li", null, h)));
      body.appendChild(ul);
    }

    if (project.tech && project.tech.length) {
      body.appendChild(chipList(project.tech, "chip-list"));
    }

    if (project.links && project.links.length) {
      const linkRow = el("div", "card-links");
      project.links.forEach((link) => {
        const a = el("a", "card-link", link.label);
        a.href = link.url;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
        linkRow.appendChild(a);
      });
      body.appendChild(linkRow);
    }

    card.appendChild(body);
    return card;
  }

  function renderProjects() {
    const container = $("#project-groups");
    let cardIndex = 0;

    CATEGORIES.forEach((category) => {
      const projects = PROJECTS.filter((p) => p.category === category.id);
      if (!projects.length) return; // empty categories simply don't render

      const group = el("section", "project-group");
      group.id = `cat-${category.id}`;

      const head = el("div", "group-head");
      head.appendChild(el("h3", "group-title", category.label));
      if (category.blurb) head.appendChild(el("p", "group-blurb", category.blurb));
      group.appendChild(head);

      const grid = el("div", "project-grid");
      projects.forEach((p) => grid.appendChild(renderProjectCard(p, cardIndex++)));
      group.appendChild(grid);

      container.appendChild(group);
    });

    // category quick-nav pills
    const pills = $("#category-pills");
    CATEGORIES.forEach((category) => {
      if (!PROJECTS.some((p) => p.category === category.id)) return;
      const a = el("a", "pill", category.label);
      a.href = `#cat-${category.id}`;
      pills.appendChild(a);
    });
  }

  /* ---------- experience ---------- */

  function renderExperience() {
    const wrap = $("#experience-list");
    EXPERIENCE.forEach((job) => {
      const item = el("article", "xp-item");

      const head = el("div", "xp-head");
      const title = el("h3", "xp-role", job.role);
      const at = el("span", "xp-company");
      at.append(" · ");
      if (job.url) {
        const a = el("a", null, job.company);
        a.href = job.url;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
        at.appendChild(a);
      } else {
        at.append(job.company);
      }
      title.appendChild(at);
      head.appendChild(title);
      head.appendChild(el("span", "xp-period", job.period));
      item.appendChild(head);

      if (job.description) item.appendChild(el("p", "xp-desc", job.description));

      if (job.points && job.points.length) {
        const ul = el("ul", "xp-points");
        job.points.forEach((p) => ul.appendChild(el("li", null, p)));
        item.appendChild(ul);
      }

      wrap.appendChild(item);
    });
  }

  /* ---------- education / skills / languages ---------- */

  function renderEducation() {
    const wrap = $("#education-list");
    EDUCATION.forEach((edu) => {
      const item = el("div", "edu-item");
      item.appendChild(el("h3", "edu-degree", edu.degree));
      if (edu.field) item.appendChild(el("p", "edu-field", edu.field));
      const meta = el("p", "edu-meta");
      meta.textContent = `${edu.school} · ${edu.period}`;
      item.appendChild(meta);
      wrap.appendChild(item);
    });
  }

  function renderSkills() {
    const wrap = $("#skills-list");
    SKILLS.forEach((group) => {
      const item = el("div", "skill-group");
      item.appendChild(el("h3", "skill-group-title", group.group));
      item.appendChild(chipList(group.items, "chip-list"));
      wrap.appendChild(item);
    });
  }

  function renderLanguages() {
    const wrap = $("#languages-list");
    LANGUAGES.forEach((lang) => {
      const item = el("div", "lang-item");
      const head = el("div", "lang-head");
      head.appendChild(el("span", "lang-name", lang.name));
      head.appendChild(el("span", "lang-level", lang.level));
      item.appendChild(head);
      if (lang.detail) item.appendChild(el("p", "lang-detail", lang.detail));
      wrap.appendChild(item);
    });
  }

  /* ---------- contact ---------- */

  function renderContact() {
    const email = $("#contact-email");
    email.textContent = SITE.contact.email;
    email.href = `mailto:${SITE.contact.email}`;
    $("#contact-phone").textContent = SITE.contact.phone;
    $("#contact-address").textContent = SITE.contact.address;
  }

  /* ---------- niceties: reveal on scroll + active nav ---------- */

  function setupReveal() {
    const targets = document.querySelectorAll(
      ".project-card, .xp-item, .edu-item, .skill-group, .lang-item, .section-head"
    );
    targets.forEach((t) => t.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((t) => io.observe(t));
  }

  function setupNavToggle() {
    const toggle = $("#nav-toggle");
    const nav = $("#site-nav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- boot ---------- */

  renderHero();
  renderProjects();
  renderExperience();
  renderEducation();
  renderSkills();
  renderLanguages();
  renderContact();
  setupReveal();
  setupNavToggle();
})();
