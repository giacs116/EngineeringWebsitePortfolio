import projects from "../data/projects.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer: fine)").matches;

document.addEventListener("DOMContentLoaded", () => {
    const projectsGrid = document.getElementById("projects-grid");
    const spotlightList = document.getElementById("spotlight-list");
    const searchInput = document.getElementById("search-input");
    const sortFilter = document.getElementById("sort-filter");
    const resultCount = document.getElementById("result-count");
    const modal = document.getElementById("project-modal");
    const modalContent = modal.querySelector(".modal-content");
    const modalCloseBtn = modal.querySelector(".modal-close");
    const modalOverlay = modal.querySelector(".modal-overlay");
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const themeToggle = document.querySelector(".theme-toggle");
    const themeToggleText = document.querySelector(".theme-toggle-text");
    const navMenu = document.querySelector(".nav-menu");
    const body = document.body;
    const topicSelect = document.getElementById("topic");
    const otherTopicGroup = document.getElementById("other-topic-group");
    const otherTopicInput = document.getElementById("other-topic");

    let searchQuery = "";
    let sortMode = "featured";

    renderSpotlight();
    renderProjects();
    initializeThemeToggle();
    setupEventListeners();
    revealSections();
    initScrambleHeadings();
    initRoleRotator();
    initCounters();
    initCursorHud();
    initMagneticButtons();

    /* ============ FEATURED SPOTLIGHT ============ */

    function renderSpotlight() {
        const spotlightIds = [9, 2]; // SmartMitt, VEX Pen-Plotter Robot
        const featured = spotlightIds
            .map((id) => projects.find((project) => project.id === id))
            .filter(Boolean);

        spotlightList.innerHTML = featured.map((project, index) => `
            <article class="spotlight-item reveal" data-id="${project.id}">
                <div class="spotlight-media corner-frame tilt" data-open="${project.id}" data-tilt-max="4">
                    <span class="corners" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                    <span class="spotlight-code">F-${String(index + 1).padStart(2, "0")}</span>
                    ${project.image
                        ? `<img src="${project.image}" alt="${project.title} preview" loading="lazy">`
                        : `<div class="spotlight-placeholder">NO VISUAL ON FILE</div>`}
                </div>
                <div class="spotlight-body">
                    <p class="spotlight-meta">
                        <span class="meta-year">${project.year}</span>
                        <span class="meta-sep">//</span>
                        <span>${project.role}</span>
                    </p>
                    <h3 class="spotlight-title">${project.title}</h3>
                    <p class="spotlight-desc">${project.shortDescription}</p>
                    <ul class="spotlight-highlights">
                        ${project.highlights.slice(0, 3).map((highlight) => `<li>${highlight}</li>`).join("")}
                    </ul>
                    <div class="card-tech spotlight-tech">
                        ${project.tech.map((tech) => `<span>${tech}</span>`).join("")}
                    </div>
                    <div class="spotlight-actions">
                        <button type="button" class="btn btn-primary magnetic" data-open="${project.id}">Open Datasheet<span class="btn-arrow" aria-hidden="true">↘</span></button>
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary magnetic">View Code</a>` : ""}
                        ${!project.githubUrl && project.googleDriveUrl ? `<a href="${project.googleDriveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary magnetic">Open Drive</a>` : ""}
                    </div>
                </div>
            </article>
        `).join("");

        spotlightList.querySelectorAll("[data-open]").forEach((element) => {
            element.addEventListener("click", () => openModal(Number(element.dataset.open)));
        });

        initTilt(spotlightList);
    }

    /* ============ PROJECT INDEX GRID ============ */

    function renderProjects() {
        const query = searchQuery.toLowerCase();
        const filteredProjects = projects
            .filter((project) =>
                project.title.toLowerCase().includes(query) ||
                project.tech.some((tech) => tech.toLowerCase().includes(query))
            )
            .sort((a, b) => compareProjects(a, b, sortMode));

        if (resultCount) {
            resultCount.textContent = `${String(filteredProjects.length).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")} records`;
        }

        if (filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No records found</h3>
                    <p>QUERY RETURNED 0 RESULTS — TRY A DIFFERENT TERM OR TECHNOLOGY.</p>
                </div>
            `;
            return;
        }

        projectsGrid.innerHTML = filteredProjects.map((project) => `
            <article class="project-card tilt" data-id="${project.id}" data-tilt-max="6" tabindex="0" role="button" aria-label="Open details for ${project.title}">
                <div class="card-top">
                    <span class="card-index">P-${String(project.id).padStart(2, "0")}</span>
                    <div class="card-meta-right">
                        <span class="project-year">${project.year}</span>
                        <div class="external-links">
                            ${project.githubUrl ? iconLink(project.githubUrl, "GitHub", githubIcon()) : ""}
                            ${project.googleDriveUrl ? iconLink(project.googleDriveUrl, "Google Drive", driveIcon()) : ""}
                            ${project.liveUrl ? iconLink(project.liveUrl, "Live Demo", externalIcon()) : ""}
                        </div>
                    </div>
                </div>
                <h3 class="card-title">${project.title}</h3>
                <p class="card-role">${project.role}</p>
                <p class="card-desc">${project.shortDescription}</p>
                <div class="card-tech">
                    ${project.tech.map((tech) => `<span>${tech}</span>`).join("")}
                </div>
                <span class="card-open"><span>Open datasheet</span><span aria-hidden="true">↘</span></span>
            </article>
        `).join("");

        projectsGrid.querySelectorAll(".project-card").forEach((card) => {
            card.addEventListener("click", (event) => {
                if (event.target.closest("a")) {
                    return;
                }
                openModal(Number(card.dataset.id));
            });
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openModal(Number(card.dataset.id));
                }
            });
        });

        initTilt(projectsGrid);
    }

    /* ============ EVENTS ============ */

    function setupEventListeners() {
        if (themeToggle) {
            themeToggle.addEventListener("click", toggleTheme);
        }

        searchInput.addEventListener("input", (event) => {
            searchQuery = event.target.value.trim();
            renderProjects();
        });

        if (sortFilter) {
            sortFilter.addEventListener("change", (event) => {
                sortMode = event.target.value;
                renderProjects();
            });
        }

        mobileMenuBtn.addEventListener("click", () => {
            const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
            mobileMenuBtn.setAttribute("aria-expanded", String(!isExpanded));
            mobileMenuBtn.classList.toggle("active");
            navMenu.classList.toggle("active");
            body.style.overflow = isExpanded ? "" : "hidden";
        });

        document.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                if (navMenu.classList.contains("active")) {
                    mobileMenuBtn.click();
                }
            });
        });

        modalCloseBtn.addEventListener("click", closeModal);
        modalOverlay.addEventListener("click", closeModal);
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal.classList.contains("open")) {
                closeModal();
            }
        });

        topicSelect.addEventListener("change", (event) => {
            if (event.target.value === "other") {
                otherTopicGroup.classList.remove("hidden");
                otherTopicInput.required = true;
            } else {
                otherTopicGroup.classList.add("hidden");
                otherTopicInput.required = false;
                otherTopicInput.value = "";
            }
        });
    }

    /* ============ MODAL ============ */

    function openModal(id) {
        const project = projects.find((entry) => entry.id === id);
        if (!project) {
            return;
        }

        modalContent.innerHTML = `
            ${project.image ? `<img src="${project.image}" alt="${project.title} preview" class="modal-img" onerror="this.style.display='none'">` : ""}
            <div class="modal-header">
                <div>
                    <h2 id="modal-title" class="modal-title">${project.title}</h2>
                    <p class="modal-subtitle">P-${String(project.id).padStart(2, "0")} // ${project.role} // ${project.year}</p>
                </div>
                <div class="external-links">
                    ${project.githubUrl ? iconLink(project.githubUrl, "GitHub", githubIcon()) : ""}
                    ${project.googleDriveUrl ? iconLink(project.googleDriveUrl, "Google Drive", driveIcon()) : ""}
                    ${project.liveUrl ? iconLink(project.liveUrl, "Live Demo", externalIcon()) : ""}
                </div>
            </div>
            <p class="modal-copy">${project.longDescription}</p>
            <h3 class="modal-section-title">// Highlights</h3>
            <ul class="modal-highlights">
                ${project.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
            </ul>
            <h3 class="modal-section-title">// Technologies</h3>
            <div class="card-tech">
                ${project.tech.map((tech) => `<span>${tech}</span>`).join("")}
            </div>
            <div class="modal-links">
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">View Code</a>` : ""}
                ${project.googleDriveUrl ? `<a href="${project.googleDriveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Open Drive Folder</a>` : ""}
                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Visit Project</a>` : ""}
            </div>
        `;

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        body.style.overflow = "hidden";
        modalContent.focus();
    }

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        body.style.overflow = "";
    }

    /* ============ SORTING HELPERS ============ */

    function compareProjects(a, b, mode) {
        if (mode === "az") {
            return a.title.localeCompare(b.title);
        }

        if (mode === "date-desc") {
            return extractEndYear(b.year) - extractEndYear(a.year);
        }

        if (mode === "date-asc") {
            return extractStartYear(a.year) - extractStartYear(b.year);
        }

        return Number(b.featured) - Number(a.featured);
    }

    function extractStartYear(value) {
        const matches = String(value).match(/\d{4}/g);
        return matches ? Number(matches[0]) : 0;
    }

    function extractEndYear(value) {
        const text = String(value);
        if (/present/i.test(text)) {
            return new Date().getFullYear();
        }

        const matches = text.match(/\d{4}/g);
        return matches ? Number(matches[matches.length - 1]) : 0;
    }

    /* ============ THEME ============ */

    function initializeThemeToggle() {
        updateThemeToggleUi(document.documentElement.dataset.theme || "dark");
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
        const nextTheme = currentTheme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem("portfolio-theme", nextTheme);
        updateThemeToggleUi(nextTheme);
        document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: nextTheme } }));
    }

    function updateThemeToggleUi(theme) {
        if (!themeToggle || !themeToggleText) {
            return;
        }

        const isLight = theme === "light";
        themeToggle.setAttribute("aria-pressed", String(isLight));
        themeToggleText.textContent = isLight ? "LIGHT" : "DARK";
    }

    /* ============ SCROLL REVEAL ============ */

    function revealSections() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    }

    /* ============ TEXT SCRAMBLE / DECODE ============ */

    function initScrambleHeadings() {
        const targets = document.querySelectorAll("[data-scramble]");
        if (prefersReducedMotion || targets.length === 0) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    scrambleText(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        targets.forEach((element) => observer.observe(element));
    }

    function scrambleText(element) {
        const finalText = element.textContent;
        const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/\\_<>[]";
        const duration = 900;
        const start = performance.now();

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const lockedCount = Math.floor(progress * finalText.length);
            let output = "";

            for (let i = 0; i < finalText.length; i += 1) {
                const char = finalText[i];
                if (char === " " || i < lockedCount) {
                    output += char;
                } else {
                    output += glyphs[Math.floor(Math.random() * glyphs.length)];
                }
            }

            element.textContent = output;
            if (progress < 1) {
                window.requestAnimationFrame(frame);
            } else {
                element.textContent = finalText;
            }
        }

        window.requestAnimationFrame(frame);
    }

    /* ============ ROLE ROTATOR (TYPEWRITER) ============ */

    function initRoleRotator() {
        const rotator = document.getElementById("role-rotator");
        if (!rotator) {
            return;
        }

        const roles = [
            "Software Development",
            "Mechanical Design",
            "Robotics & Embedded",
            "UI/UX Engineering"
        ];

        if (prefersReducedMotion) {
            rotator.textContent = roles.join(" · ");
            return;
        }

        let roleIndex = 0;
        let charIndex = roles[0].length;
        let deleting = false;

        function tick() {
            const word = roles[roleIndex];

            if (deleting) {
                charIndex -= 1;
            } else {
                charIndex += 1;
            }

            rotator.textContent = word.slice(0, charIndex);

            let delay = deleting ? 34 : 62;
            if (!deleting && charIndex === word.length) {
                delay = 2100;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 380;
            }

            window.setTimeout(tick, delay);
        }

        window.setTimeout(tick, 2400);
    }

    /* ============ STAT COUNTERS ============ */

    function initCounters() {
        const counters = document.querySelectorAll(".stat-num[data-count]");
        if (counters.length === 0) {
            return;
        }

        if (prefersReducedMotion) {
            counters.forEach((counter) => {
                counter.textContent = counter.dataset.count;
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach((counter) => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = Number(element.dataset.count);
        const duration = 1200;
        const start = performance.now();

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = String(Math.round(eased * target));
            if (progress < 1) {
                window.requestAnimationFrame(frame);
            }
        }

        window.requestAnimationFrame(frame);
    }

    /* ============ 3D TILT ============ */

    function initTilt(scope = document) {
        if (prefersReducedMotion || !isFinePointer) {
            return;
        }

        scope.querySelectorAll(".tilt").forEach((element) => {
            if (element.dataset.tiltBound) {
                return;
            }
            element.dataset.tiltBound = "true";

            const maxTilt = Number(element.dataset.tiltMax || 6);

            element.addEventListener("mousemove", (event) => {
                const rect = element.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                element.style.setProperty("--ry", `${(x - 0.5) * maxTilt * 2}deg`);
                element.style.setProperty("--rx", `${(0.5 - y) * maxTilt * 2}deg`);
                element.style.setProperty("--mx", `${x * 100}%`);
                element.style.setProperty("--my", `${y * 100}%`);
            });

            element.addEventListener("mouseleave", () => {
                element.style.setProperty("--rx", "0deg");
                element.style.setProperty("--ry", "0deg");
            });
        });
    }

    /* ============ CURSOR RETICLE + HUD READOUT ============ */

    function initCursorHud() {
        if (prefersReducedMotion || !isFinePointer) {
            return;
        }

        const reticle = document.querySelector(".cursor-reticle");
        const hudX = document.getElementById("hud-x");
        const hudY = document.getElementById("hud-y");
        if (!reticle) {
            return;
        }

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const target = { x: pos.x, y: pos.y };
        let started = false;

        window.addEventListener("mousemove", (event) => {
            target.x = event.clientX;
            target.y = event.clientY;
            if (!started) {
                started = true;
                pos.x = target.x;
                pos.y = target.y;
                body.classList.add("cursor-on");
                loop();
            }
            if (hudX && hudY) {
                hudX.textContent = String(Math.round(event.clientX)).padStart(4, "0");
                hudY.textContent = String(Math.round(event.clientY)).padStart(4, "0");
            }
        });

        document.addEventListener("mouseover", (event) => {
            const interactive = event.target.closest("a, button, .project-card, .spotlight-media, input, select, textarea");
            reticle.classList.toggle("is-active", Boolean(interactive));
        });

        function loop() {
            pos.x += (target.x - pos.x) * 0.22;
            pos.y += (target.y - pos.y) * 0.22;
            reticle.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            window.requestAnimationFrame(loop);
        }
    }

    /* ============ MAGNETIC BUTTONS ============ */

    function initMagneticButtons() {
        if (prefersReducedMotion || !isFinePointer) {
            return;
        }

        document.addEventListener("mousemove", (event) => {
            const magnetic = event.target.closest(".magnetic");
            document.querySelectorAll(".magnetic").forEach((element) => {
                if (element !== magnetic) {
                    element.style.transform = "";
                }
            });
            if (!magnetic) {
                return;
            }
            const rect = magnetic.getBoundingClientRect();
            const dx = event.clientX - (rect.left + rect.width / 2);
            const dy = event.clientY - (rect.top + rect.height / 2);
            magnetic.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
        });
    }

    /* ============ ICONS ============ */

    function iconLink(url, label, icon) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${label}" class="external-link">${icon}</a>`;
    }

    function githubIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3"></path><path d="M15 22v-4a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18.94 4.5 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-6 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5.06 4.5 5.44 5.44 0 0 0 3.5 8.39c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18v4"></path></svg>`;
    }

    function driveIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="#0F9D58" d="M9.2 2.5 2.9 13.4l2.6 4.5 6.3-10.9z"></path><path fill="#FFC107" d="M9.2 2.5h5.6l6.3 10.9h-5.6z"></path><path fill="#4285F4" d="M5.5 17.9h12.6l3-4.5H8.1z"></path></svg>`;
    }

    function externalIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7"></path><path d="M10 14 21 3"></path><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"></path></svg>`;
    }
});
