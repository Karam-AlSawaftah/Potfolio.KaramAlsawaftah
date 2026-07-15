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

  /* ---------- project detail modal ---------- */

  // Pull the 11-char video id out of any common YouTube URL (or accept a bare id).
  function youtubeId(input) {
    if (!input) return "";
    if (/^[\w-]{11}$/.test(input)) return input;
    const m = String(input).match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  }

  // Build one media slide (image / youtube / video). Returns the node or null.
  function buildMediaSlide(m) {
    if (m.type === "image") {
      const slide = el("div", "carousel-slide carousel-slide--image");
      const img = el("img");
      img.src = m.src;
      img.alt = m.alt || "";
      img.loading = "lazy";
      slide.appendChild(img);
      return slide;
    }
    if (m.type === "youtube") {
      const id = youtubeId(m.id || m.url);
      if (!id) return null;
      const slide = el("div", "carousel-slide carousel-slide--embed");
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}`;
      iframe.title = m.title || "Project video";
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      slide.appendChild(iframe);
      return slide;
    }
    if (m.type === "video") {
      const slide = el("div", "carousel-slide carousel-slide--embed");
      const video = document.createElement("video");
      video.src = m.src;
      video.controls = true;
      video.preload = "metadata";
      if (m.poster) video.poster = m.poster;
      slide.appendChild(video);
      return slide;
    }
    return null;
  }

  // Stop any playback on a slide (so leaving it silences audio).
  function stopSlide(slide) {
    if (!slide) return;
    const video = slide.querySelector("video");
    if (video) video.pause();
    const iframe = slide.querySelector("iframe");
    if (iframe) iframe.src = iframe.src; // reassigning reloads → stops YouTube playback
  }

  // Build the media slideshow for a project. Returns true if anything was added.
  function renderMedia(container, media) {
    container.textContent = "";
    if (!media || !media.length) return false;

    const slides = media.map(buildMediaSlide).filter(Boolean);
    if (!slides.length) return false;

    const carousel = el("div", "carousel");
    const viewport = el("div", "carousel-viewport");
    const track = el("div", "carousel-track");
    slides.forEach((s) => track.appendChild(s));
    viewport.appendChild(track);
    carousel.appendChild(viewport);

    // Single item needs no navigation.
    if (slides.length > 1) {
      carousel.tabIndex = 0;
      carousel.setAttribute("role", "group");
      carousel.setAttribute("aria-roledescription", "carousel");
      carousel.setAttribute("aria-label", "Project media");

      const prev = el("button", "carousel-arrow carousel-prev");
      prev.setAttribute("aria-label", "Previous image");
      prev.textContent = "‹";
      const next = el("button", "carousel-arrow carousel-next");
      next.setAttribute("aria-label", "Next image");
      next.textContent = "›";

      const dots = el("div", "carousel-dots");
      const dotBtns = slides.map((_, i) => {
        const d = el("button", "carousel-dot");
        d.setAttribute("aria-label", `Go to item ${i + 1} of ${slides.length}`);
        dots.appendChild(d);
        return d;
      });

      let index = 0;
      function go(target, stopCurrent) {
        const n = slides.length;
        const ni = ((target % n) + n) % n; // wrap around
        if (stopCurrent !== false && ni !== index) stopSlide(slides[index]);
        index = ni;
        track.style.transform = `translateX(-${index * 100}%)`;
        dotBtns.forEach((d, di) => {
          const on = di === index;
          d.classList.toggle("is-active", on);
          d.setAttribute("aria-current", on ? "true" : "false");
        });
      }

      prev.addEventListener("click", () => go(index - 1));
      next.addEventListener("click", () => go(index + 1));
      dotBtns.forEach((d, i) => d.addEventListener("click", () => go(i)));
      carousel.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      });

      carousel.append(prev, next, dots);
      go(0, false);
    }

    container.appendChild(carousel);
    return true;
  }

  // Create the single reusable modal once; returns { open, close }.
  function buildProjectModal() {
    const backdrop = el("div", "modal-backdrop");
    const modal = el("div", "modal");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "project-modal-title");

    const closeBtn = el("button", "modal-close");
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "×"; // ×

    const scroll = el("div", "modal-scroll");
    const head = el("div", "modal-head");
    const badge = el("span", "modal-badge");
    const title = el("h3", "modal-title");
    title.id = "project-modal-title";
    const role = el("p", "modal-role");
    const time = el("span", "modal-time");
    head.append(badge, title, role, time);

    const summary = el("p", "modal-summary");
    const highlights = el("ul", "modal-highlights");
    const tech = el("div", "modal-tech");
    const media = el("div", "modal-media");
    const links = el("div", "modal-links");

    const body = el("div", "modal-body");
    body.append(summary, highlights, tech, media, links);
    scroll.append(head, body);
    modal.append(closeBtn, scroll);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    let lastFocused = null;

    function show(node, on) {
      node.style.display = on ? "" : "none";
    }

    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        const focusable = [...modal.querySelectorAll('a[href], button, iframe, video, [tabindex]:not([tabindex="-1"])')]
          .filter((n) => n.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function open(project, trigger) {
      lastFocused = trigger || document.activeElement;

      badge.textContent = project.badge || "";
      show(badge, !!project.badge);
      title.textContent = project.title;
      role.textContent = project.role || "";
      show(role, !!project.role);
      time.textContent = project.timeframe || "";
      show(time, !!project.timeframe);
      summary.textContent = project.summary || "";

      highlights.textContent = "";
      if (project.highlights && project.highlights.length) {
        project.highlights.forEach((h) => highlights.appendChild(el("li", null, h)));
      }
      show(highlights, !!(project.highlights && project.highlights.length));

      tech.textContent = "";
      if (project.tech && project.tech.length) tech.appendChild(chipList(project.tech, "chip-list"));
      show(tech, !!(project.tech && project.tech.length));

      show(media, renderMedia(media, project.media));

      links.textContent = "";
      if (project.links && project.links.length) {
        project.links.forEach((link) => {
          const a = el("a", "card-link", link.label);
          a.href = link.url;
          a.target = "_blank";
          a.rel = "noreferrer noopener";
          links.appendChild(a);
        });
      }
      show(links, !!(project.links && project.links.length));

      scroll.scrollTop = 0;
      document.body.classList.add("modal-open");
      backdrop.classList.add("is-open");
      document.addEventListener("keydown", onKey);
      closeBtn.focus();
    }

    function close() {
      backdrop.classList.remove("is-open");
      document.body.classList.remove("modal-open");
      media.textContent = ""; // tear down iframes/videos so audio stops
      document.removeEventListener("keydown", onKey);
      const returnTo = lastFocused;
      lastFocused = null;
      if (returnTo && typeof returnTo.focus === "function") returnTo.focus();
    }

    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });

    return { open, close };
  }

  let projectModalApi = null;
  function openProject(project, trigger) {
    if (projectModalApi) projectModalApi.open(project, trigger);
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
      // Wrap the thumbnail so the badge can overlay it (same as placeholder art).
      const art = el("div", "card-art card-art--image");
      const img = el("img", "card-art-img");
      img.src = project.image;
      img.alt = project.title;
      img.loading = "lazy";
      art.appendChild(img);
      art.appendChild(el("span", "card-art-badge", project.badge || "XR"));
      card.appendChild(art);
    } else {
      card.appendChild(placeholderArt(project, index));
    }

    const body = el("div", "card-body");

    const top = el("div", "card-top");
    top.appendChild(el("h4", "card-title", project.title));
    if (project.timeframe) top.appendChild(el("span", "card-time", project.timeframe));
    body.appendChild(top);

    if (project.role) body.appendChild(el("p", "card-role", project.role));
    // Card shows a clamped teaser only; the full summary + highlights live in the modal.
    body.appendChild(el("p", "card-summary", project.summary));

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
        a.addEventListener("click", (e) => e.stopPropagation()); // follow the link, don't open the modal
        linkRow.appendChild(a);
      });
      body.appendChild(linkRow);
    }

    body.appendChild(el("span", "card-more", "View details →"));

    card.appendChild(body);

    // The whole card opens the project's detail modal.
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `View details for ${project.title}`);
    card.addEventListener("click", () => openProject(project, card));
    card.addEventListener("keydown", (e) => {
      if (e.target !== card) return; // ignore keys from inner links
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProject(project, card);
      }
    });

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

  projectModalApi = buildProjectModal(); // must exist before cards are wired
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
