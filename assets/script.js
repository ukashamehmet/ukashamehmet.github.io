/* ==========================================================================
   Okasha Mehmood — Portfolio interactions
   Vanilla JavaScript. No trackers, no dependencies.
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Toast ---------- */
  function ensureToastStack() {
    let stack = $(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("role", "status");
      stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }
    return stack;
  }

  function toast(message, type = "success") {
    const stack = ensureToastStack();
    const el = document.createElement("div");
    el.className = `toast${type === "error" ? " is-error" : ""}`;
    el.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        ${
          type === "error"
            ? '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>'
            : '<path d="m5 12 4 4L19 6"/>'
        }
      </svg>
      <span>${escapeHTML(message)}</span>`;
    stack.appendChild(el);
    window.setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(6px)";
      window.setTimeout(() => el.remove(), 220);
    }, 3400);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function copyText(value, successMessage = "Copied to clipboard.") {
    try {
      await navigator.clipboard.writeText(value);
      toast(successMessage);
      return true;
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (fallbackError) {
        copied = false;
      }
      textarea.remove();
      toast(copied ? successMessage : "Copy failed. Please select the text manually.", copied ? "success" : "error");
      return copied;
    }
  }

  /* ---------- Header / scroll ---------- */
  const header = $(".site-header");
  const progress = $(".scroll-progress");

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", scrollTop > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0;
      progress.style.width = `${pct}%`;
    }
  }

  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  window.addEventListener("resize", updateScrollUI, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const menuToggle = $(".menu-toggle");
  const siteNav = $(".site-nav");

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  /* ---------- Current year ---------- */
  $$("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Reveal on scroll ---------- */
  const revealItems = $$("[data-reveal]");
  if (revealItems.length) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((el) => el.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealItems.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ---------- Hero spotlight ---------- */
  const hero = $(".hero");
  if (hero && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  }

  /* ---------- Copy buttons ---------- */
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    event.preventDefault();
    const value = button.getAttribute("data-copy");
    if (value) {
      await copyText(value, button.getAttribute("data-copy-message") || "Copied to clipboard.");
    }
  });

  /* ---------- Case-study deep links, filters, expand-all ---------- */
  const filterBar = $("[data-project-filters]");
  const cases = $$(".case[data-cases]");
  const filterButtons = filterBar ? $$(".filter-btn", filterBar) : [];
  const filterCount = $("[data-filter-count]");

  function setFilter(filterName, updateHash = false) {
    if (!cases.length) return;
    let visible = 0;

    cases.forEach((item) => {
      const categories = (item.getAttribute("data-cases") || "").split(/\s+/);
      const show = filterName === "all" || categories.includes(filterName);
      item.hidden = !show;
      if (!show) item.open = false;
      if (show) visible += 1;
    });

    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === filterName));
    });

    if (filterCount) {
      filterCount.innerHTML = `<strong>${visible}</strong> of ${cases.length} shown`;
    }

    if (updateHash && filterName !== "all") {
      history.replaceState(null, "", `${location.pathname}${location.search}`);
    }
  }

  if (filterButtons.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => setFilter(button.getAttribute("data-filter") || "all"));
    });
    setFilter("all");
  }

  function handleHashNavigation(smooth = true) {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;

    if (target.matches("details.case")) {
      const activeFilter = filterButtons.find((button) => button.getAttribute("aria-pressed") === "true");
      if (target.hidden && activeFilter && activeFilter.getAttribute("data-filter") !== "all") {
        setFilter("all");
      }
      target.open = true;
    }

    const headerOffset = (header?.offsetHeight || 0) + 22;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: smooth && !reducedMotion ? "smooth" : "auto",
    });
  }

  window.addEventListener("hashchange", () => handleHashNavigation(true));

  function initialHashNavigation() {
    window.setTimeout(() => handleHashNavigation(false), 120);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => window.setTimeout(() => handleHashNavigation(false), 80));
    }
  }

  if (document.readyState === "complete") {
    initialHashNavigation();
  } else {
    window.addEventListener("load", initialHashNavigation, { once: true });
  }

  document.addEventListener("click", async (event) => {
    const linkButton = event.target.closest("[data-copy-link]");
    if (!linkButton) return;
    event.preventDefault();
    const caseItem = linkButton.closest(".case");
    if (!caseItem || !caseItem.id) return;
    const url = `${location.origin}${location.pathname}#${caseItem.id}`;
    await copyText(url, "Case-study link copied.");
  });

  const expandAll = $("[data-expand-all]");
  if (expandAll) {
    expandAll.addEventListener("click", () => {
      const anyClosed = cases.some((item) => !item.hidden && !item.open);
      cases.forEach((item) => {
        if (!item.hidden) item.open = anyClosed;
      });
      expandAll.textContent = anyClosed ? "Collapse all case studies" : "Expand all case studies";
    });
  }

  /* ---------- Article reading progress + copy link ---------- */
  const article = $(".article-shell");
  if (article) {
    const copyArticle = $("[data-copy-article]");
    if (copyArticle) {
      copyArticle.addEventListener("click", async () => {
        await copyText(window.location.href, "Article link copied.");
      });
    }
  }

  /* ---------- Studio / admin ---------- */
  if (document.body.classList.contains("admin-body")) {
    initStudio();
  }

  function initStudio() {
    const storageKey = "om-studio-v1";

    const defaults = {
      profile: {
        name: "Okasha Mehmood",
        role: "Penetration Tester & Reverse Engineer",
        location: "Islamabad, Pakistan",
        availability: "Open to senior roles & remote contracts",
      },
      projects: [
        {
          id: "saas-bola",
          title: "One query, every tenant",
          slug: "projects/#saas-bola",
          category: "Web & API",
          severity: "Critical",
          status: "Published",
          summary: "Cross-tenant BOLA in a multi-tenant case-management platform.",
          tags: "BOLA, multi-tenant, Django REST",
          confidential: true,
        },
        {
          id: "member-portal",
          title: "The debug folder that opened the front door",
          slug: "projects/#member-portal",
          category: "Web",
          severity: "Critical",
          status: "Published",
          summary: "Session hijacking and file-upload RCE in a member portal.",
          tags: "session, upload, WAF bypass",
          confidential: true,
        },
        {
          id: "logistics-perimeter",
          title: "The WAF was never the wall",
          slug: "projects/#logistics-perimeter",
          category: "Network",
          severity: "High",
          status: "Published",
          summary: "Origin exposure and management-plane sprawl across a hybrid estate.",
          tags: "ASM, origin exposure, ZTNA",
          confidential: true,
        },
        {
          id: "telecom-perimeter",
          title: "When a CMS becomes a doorway",
          slug: "projects/#telecom-perimeter",
          category: "Network",
          severity: "Critical",
          status: "Published",
          summary: "Path traversal and SQL injection across a national telecom perimeter.",
          tags: "LFI, SQLi, telecom",
          confidential: true,
        },
        {
          id: "mobile-crypto",
          title: "Reading the envelope",
          slug: "projects/#mobile-crypto",
          category: "Mobile & API",
          severity: "High",
          status: "Published",
          summary: "Reversing a proprietary mobile API encryption scheme and finding the replay gap.",
          tags: "Frida, Android, crypto",
          confidential: true,
        },
        {
          id: "android-rat",
          title: "The app that became the network",
          slug: "projects/#android-rat",
          category: "Mobile / RE",
          severity: "Critical",
          status: "Published",
          summary: "Inside an Android dropper abusing VpnService for on-device interception.",
          tags: "Android, malware, VpnService",
          confidential: true,
        },
        {
          id: "cicd-rce",
          title: "Trust, but deserialize",
          slug: "projects/#cicd-rce",
          category: "Research",
          severity: "Critical",
          status: "Published",
          summary: "An unauthenticated object-injection path in a CI/CD agent control plane.",
          tags: "XStream, deserialization, CI/CD",
          confidential: true,
        },
        {
          id: "cms-upload-rce",
          title: "The extension filter that wasn't",
          slug: "projects/#cms-upload-rce",
          category: "Research",
          severity: "Critical",
          status: "Published",
          summary: "A case-normalization bypass that turned a media upload into remote code execution.",
          tags: "upload, RCE, canonicalization",
          confidential: true,
        },
        {
          id: "mobile-oauth-recovery",
          title: "Obfuscation is not encryption",
          slug: "projects/#mobile-oauth-recovery",
          category: "Mobile / RE",
          severity: "High",
          status: "Published",
          summary: "Recovering embedded OAuth 1.0a consumer credentials from an Android client through static analysis.",
          tags: "apktool / Smali, OAuth 1.0a, HMAC-SHA1, static analysis",
          confidential: true,
        },
      ],
      posts: [
        {
          id: "tenant-boundaries",
          title: "The tenant boundary is a query, not a checkbox",
          slug: "blog/posts/tenant-boundaries.html",
          category: "Application security",
          status: "Published",
          summary: "A practical model for testing multi-tenant authorization — and fixing it at the data layer.",
        },
        {
          id: "waf-origin",
          title: "Your WAF only protects the hostname",
          slug: "blog/posts/waf-origin.html",
          category: "Network & cloud",
          status: "Published",
          summary: "Origin exposure is still one of the most reliable ways around an edge control.",
        },
        {
          id: "android-vpn",
          title: "What a rogue VPN service looks like from the inside",
          slug: "blog/posts/android-vpn.html",
          category: "Mobile reversing",
          status: "Published",
          summary: "Static and dynamic signals from an Android dropper that turns the device into the network.",
        },
        {
          id: "findings-engineers-fix",
          title: "Write findings engineers can actually fix",
          slug: "blog/posts/findings-engineers-fix.html",
          category: "Security craft",
          status: "Published",
          summary: "A report is a handoff, not a scoreboard. A lightweight structure for findings that ship.",
        },
      ],
      checklist: [
        { id: "names", label: "Client names removed", note: "No organization, product, or domain names remain." },
        { id: "network", label: "Network identifiers removed", note: "No IPs, CIDRs, hostnames, ASNs, or C2 indicators." },
        { id: "data", label: "Client data removed", note: "No PII, secrets, tokens, screenshots, or raw records." },
        { id: "claims", label: "Claims verified", note: "Every metric and outcome is supported by engagement records." },
        { id: "links", label: "Links and metadata checked", note: "Navigation, canonical metadata, and contact links work." },
      ],
      activity: [
        { text: "Case study updated: One query, every tenant", time: "Today" },
        { text: "Confidentiality checklist reviewed", time: "Yesterday" },
        { text: "New draft: Write findings engineers can actually fix", time: "3 days ago" },
      ],
    };

    let state = loadState();

    const viewTitles = {
      overview: ["Overview", "A local read-out of the portfolio's content and launch checklist."],
      projects: ["Case studies", "Edit the public project index, status, and disclosure flags."],
      writing: ["Writing", "Manage article metadata and publication state."],
      publish: ["Publish", "Run the confidentiality and quality checks before exporting."],
    };

    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function loadState() {
      try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return clone(defaults);
        const parsed = JSON.parse(saved);
        return {
          ...clone(defaults),
          ...parsed,
          profile: { ...defaults.profile, ...(parsed.profile || {}) },
          projects: Array.isArray(parsed.projects) ? parsed.projects : clone(defaults.projects),
          posts: Array.isArray(parsed.posts) ? parsed.posts : clone(defaults.posts),
          checklist: Array.isArray(parsed.checklist) ? parsed.checklist : clone(defaults.checklist),
          activity: Array.isArray(parsed.activity) ? parsed.activity : clone(defaults.activity),
        };
      } catch (error) {
        return clone(defaults);
      }
    }

    function saveState() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
        toast("Saved locally in this browser.");
      } catch (error) {
        toast("This browser could not save locally.", "error");
      }
    }

    function addActivity(text) {
      state.activity.unshift({ text, time: "Just now" });
      state.activity = state.activity.slice(0, 8);
    }

    function renderMetrics() {
      const set = (name, value) => {
        const el = $(`[data-metric="${name}"]`);
        if (el) el.textContent = String(value);
      };
      set("projects", state.projects.length);
      set("published", state.projects.filter((item) => item.status === "Published").length);
      set("posts", state.posts.length);
      const checked = state.checklist.filter((item) => item.checked).length;
      set("checks", `${checked}/${state.checklist.length}`);
    }

    function renderProjects() {
      const body = $("[data-project-rows]");
      if (!body) return;
      const query = ($("[data-project-search]")?.value || "").trim().toLowerCase();
      const list = state.projects.filter((item) => {
        if (!query) return true;
        return `${item.title} ${item.category} ${item.tags} ${item.summary}`.toLowerCase().includes(query);
      });

      if (!list.length) {
        body.innerHTML = `<tr><td colspan="6"><div class="admin-empty">No case studies match that search.</div></td></tr>`;
        return;
      }

      body.innerHTML = list
        .map(
          (item, index) => `
          <tr>
            <td class="title-cell">${escapeHTML(item.title)}<small>${escapeHTML(item.slug)}</small></td>
            <td>${escapeHTML(item.category)}</td>
            <td><span class="status-pill ${statusClass(item.severity)}">${escapeHTML(item.severity)}</span></td>
            <td><span class="status-pill ${statusClass(item.status)}">${escapeHTML(item.status)}</span></td>
            <td>${item.confidential ? "Yes" : "No"}</td>
            <td>
              <div class="row-actions">
                <button type="button" data-edit-project="${escapeHTML(item.id)}" aria-label="Edit ${escapeHTML(item.title)}" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m4 16-.8 4.8L8 20l10.7-10.7a2.1 2.1 0 0 0-3-3Z"/><path d="m13.5 7.5 3 3"/></svg>
                </button>
                <button type="button" class="danger" data-delete-project="${escapeHTML(item.id)}" aria-label="Delete ${escapeHTML(item.title)}" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>
                </button>
              </div>
            </td>
          </tr>`
        )
        .join("");
    }

    function renderPosts() {
      const body = $("[data-post-rows]");
      if (!body) return;
      body.innerHTML = state.posts
        .map(
          (item) => `
          <tr>
            <td class="title-cell">${escapeHTML(item.title)}<small>${escapeHTML(item.slug)}</small></td>
            <td>${escapeHTML(item.category)}</td>
            <td><span class="status-pill ${statusClass(item.status)}">${escapeHTML(item.status)}</span></td>
            <td>${escapeHTML(item.summary)}</td>
            <td>
              <div class="row-actions">
                <button type="button" data-edit-post="${escapeHTML(item.id)}" aria-label="Edit ${escapeHTML(item.title)}" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m4 16-.8 4.8L8 20l10.7-10.7a2.1 2.1 0 0 0-3-3Z"/><path d="m13.5 7.5 3 3"/></svg>
                </button>
                <button type="button" class="danger" data-delete-post="${escapeHTML(item.id)}" aria-label="Delete ${escapeHTML(item.title)}" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>
                </button>
              </div>
            </td>
          </tr>`
        )
        .join("");
    }

    function renderChecklist() {
      const lists = $$("[data-publish-list]");
      if (!lists.length) return;
      const markup = state.checklist
        .map(
          (item) => `
          <label class="publish-item">
            <input type="checkbox" data-check="${escapeHTML(item.id)}" ${item.checked ? "checked" : ""}>
            <span><strong>${escapeHTML(item.label)}</strong><span>${escapeHTML(item.note)}</span></span>
          </label>`
        )
        .join("");
      lists.forEach((list) => {
        list.innerHTML = markup;
      });
    }

    function renderActivity() {
      const list = $("[data-activity-list]");
      if (!list) return;
      list.innerHTML = state.activity
        .map(
          (item) => `
          <div class="activity-item">
            <span class="activity-dot" aria-hidden="true"></span>
            <p>${escapeHTML(item.text)}<time>${escapeHTML(item.time)}</time></p>
          </div>`
        )
        .join("");
    }

    function renderAll() {
      renderMetrics();
      renderProjects();
      renderPosts();
      renderChecklist();
      renderActivity();
    }

    function statusClass(value) {
      const v = String(value || "").toLowerCase();
      if (v.includes("publish")) return "published";
      if (v.includes("review")) return "review";
      if (v.includes("draft")) return "draft";
      if (v.includes("critical")) return "critical";
      if (v.includes("high")) return "high";
      if (v.includes("medium")) return "medium";
      return "draft";
    }

    /* View switching */
    function showAdminView(view, updateHash = true) {
      if (!viewTitles[view]) view = "overview";
      $$("[data-admin-view]").forEach((item) => {
        item.classList.toggle("is-active", item.getAttribute("data-admin-view") === view);
      });
      $$(".admin-view").forEach((panel) => {
        panel.hidden = panel.id !== `view-${view}`;
      });
      const meta = viewTitles[view];
      const heading = $("[data-view-title]");
      const sub = $("[data-view-sub]");
      if (heading) heading.textContent = meta[0];
      if (sub) sub.textContent = meta[1];
      const sidebar = $(".admin-sidebar");
      if (sidebar) sidebar.classList.remove("is-open");
      if (updateHash) history.replaceState(null, "", `#${view}`);
    }

    $$("[data-admin-view]").forEach((button) => {
      button.addEventListener("click", () => showAdminView(button.getAttribute("data-admin-view") || "overview"));
    });

    window.addEventListener("hashchange", () => showAdminView(location.hash.replace(/^#/, ""), false));
    showAdminView(location.hash.replace(/^#/, "") || "overview", false);

    /* Mobile sidebar */
    const adminMenu = $("[data-admin-menu]");
    if (adminMenu) {
      adminMenu.addEventListener("click", () => {
        $(".admin-sidebar")?.classList.toggle("is-open");
      });
    }

    /* Search */
    $("[data-project-search]")?.addEventListener("input", renderProjects);

    /* Dialogs */
    const projectDialog = $("#project-dialog");
    const postDialog = $("#post-dialog");
    const projectForm = $("#project-form");
    const postForm = $("#post-form");

    function openProject(item = null) {
      if (!projectDialog || !projectForm) return;
      projectForm.reset();
      $("#project-id").value = item?.id || "";
      $("#project-title").value = item?.title || "";
      $("#project-slug").value = item?.slug || "";
      $("#project-category").value = item?.category || "Web & API";
      $("#project-severity").value = item?.severity || "High";
      $("#project-status").value = item?.status || "Draft";
      $("#project-summary").value = item?.summary || "";
      $("#project-tags").value = item?.tags || "";
      $("#project-confidential").checked = item?.confidential ?? true;
      $("[data-project-dialog-title]").textContent = item ? "Edit case study" : "New case study";
      projectDialog.showModal();
    }

    function openPost(item = null) {
      if (!postDialog || !postForm) return;
      postForm.reset();
      $("#post-id").value = item?.id || "";
      $("#post-title").value = item?.title || "";
      $("#post-slug").value = item?.slug || "";
      $("#post-category").value = item?.category || "Application security";
      $("#post-status").value = item?.status || "Draft";
      $("#post-summary").value = item?.summary || "";
      $("[data-post-dialog-title]").textContent = item ? "Edit article" : "New article";
      postDialog.showModal();
    }

    $$("[data-new-project]").forEach((button) => button.addEventListener("click", () => openProject()));
    $$("[data-new-post]").forEach((button) => button.addEventListener("click", () => openPost()));

    $$("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", () => button.closest("dialog")?.close());
    });

    [projectDialog, postDialog].forEach((dialog) => {
      dialog?.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });

    projectForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = $("#project-id").value;
      const item = {
        id: id || `project-${Date.now()}`,
        title: $("#project-title").value.trim(),
        slug: $("#project-slug").value.trim() || `projects/#${id || "new-case"}`,
        category: $("#project-category").value,
        severity: $("#project-severity").value,
        status: $("#project-status").value,
        summary: $("#project-summary").value.trim(),
        tags: $("#project-tags").value.trim(),
        confidential: $("#project-confidential").checked,
      };
      if (!item.title) return;
      const index = state.projects.findIndex((project) => project.id === id);
      if (index >= 0) state.projects[index] = item;
      else state.projects.unshift(item);
      addActivity(`${index >= 0 ? "Case study updated" : "Case study created"}: ${item.title}`);
      saveState();
      renderAll();
      projectDialog.close();
    });

    postForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = $("#post-id").value;
      const item = {
        id: id || `post-${Date.now()}`,
        title: $("#post-title").value.trim(),
        slug: $("#post-slug").value.trim(),
        category: $("#post-category").value,
        status: $("#post-status").value,
        summary: $("#post-summary").value.trim(),
      };
      if (!item.title) return;
      const index = state.posts.findIndex((post) => post.id === id);
      if (index >= 0) state.posts[index] = item;
      else state.posts.unshift(item);
      addActivity(`${index >= 0 ? "Article updated" : "Article created"}: ${item.title}`);
      saveState();
      renderAll();
      postDialog.close();
    });

    document.addEventListener("click", (event) => {
      const editProject = event.target.closest("[data-edit-project]");
      if (editProject) {
        const item = state.projects.find((project) => project.id === editProject.getAttribute("data-edit-project"));
        if (item) openProject(item);
        return;
      }

      const deleteProject = event.target.closest("[data-delete-project]");
      if (deleteProject) {
        const id = deleteProject.getAttribute("data-delete-project");
        const item = state.projects.find((project) => project.id === id);
        if (item && window.confirm(`Delete “${item.title}” from this local draft?`)) {
          state.projects = state.projects.filter((project) => project.id !== id);
          addActivity(`Case study deleted: ${item.title}`);
          saveState();
          renderAll();
        }
        return;
      }

      const editPost = event.target.closest("[data-edit-post]");
      if (editPost) {
        const item = state.posts.find((post) => post.id === editPost.getAttribute("data-edit-post"));
        if (item) openPost(item);
        return;
      }

      const deletePost = event.target.closest("[data-delete-post]");
      if (deletePost) {
        const id = deletePost.getAttribute("data-delete-post");
        const item = state.posts.find((post) => post.id === id);
        if (item && window.confirm(`Delete “${item.title}” from this local draft?`)) {
          state.posts = state.posts.filter((post) => post.id !== id);
          addActivity(`Article deleted: ${item.title}`);
          saveState();
          renderAll();
        }
      }
    });

    document.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-check]");
      if (!checkbox) return;
      const item = state.checklist.find((check) => check.id === checkbox.getAttribute("data-check"));
      if (!item) return;
      item.checked = checkbox.checked;
      $$(`[data-check="${CSS.escape(item.id)}"]`).forEach((el) => {
        el.checked = checkbox.checked;
      });
      saveState();
      renderMetrics();
    });

    function exportState() {
      const payload = {
        exportedAt: new Date().toISOString(),
        note: "Local authoring data only. Review before publishing.",
        ...state,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "okasha-portfolio-content.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast("Content exported as JSON.");
    }

    $$("[data-export]").forEach((button) => button.addEventListener("click", exportState));

    const importInput = $("[data-import-input]");
    $("[data-import]")?.addEventListener("click", () => importInput?.click());

    importInput?.addEventListener("change", async () => {
      const file = importInput.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        if (!Array.isArray(parsed.projects) || !Array.isArray(parsed.posts)) {
          throw new Error("Invalid content file.");
        }
        state = {
          ...clone(defaults),
          ...parsed,
          profile: { ...defaults.profile, ...(parsed.profile || {}) },
        };
        addActivity("Content imported from JSON");
        saveState();
        renderAll();
        toast("Content imported.");
      } catch (error) {
        toast("That file is not a valid content export.", "error");
      } finally {
        importInput.value = "";
      }
    });

    $("[data-reset]")?.addEventListener("click", () => {
      if (!window.confirm("Reset this local studio to the shipped defaults? Your browser-only edits will be replaced.")) return;
      state = clone(defaults);
      localStorage.removeItem(storageKey);
      renderAll();
      toast("Studio reset to shipped defaults.");
    });

    $("[data-copy-json]")?.addEventListener("click", () => copyText(JSON.stringify(state, null, 2), "Content JSON copied."));

    renderAll();
  }
})();
