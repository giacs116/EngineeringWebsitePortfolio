import projects from "../data/projects.js";

document.addEventListener("DOMContentLoaded", () => {
    const projectsGrid = document.getElementById("projects-grid");
    const searchInput = document.getElementById("search-input");
    const sortFilter = document.getElementById("sort-filter");
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

    renderProjects();
    initializeThemeToggle();
    setupEventListeners();
    revealSections();

    function renderProjects() {
        const query = searchQuery.toLowerCase();
        const filteredProjects = projects
            .filter((project) =>
                project.title.toLowerCase().includes(query) ||
                project.tech.some((tech) => tech.toLowerCase().includes(query))
            )
            .sort((a, b) => compareProjects(a, b, sortMode));

        if (filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No projects found</h3>
                    <p>Try a different search term or technology filter.</p>
                </div>
            `;
            return;
        }

        projectsGrid.innerHTML = filteredProjects.map((project) => `
            <article class="project-card" data-id="${project.id}">
                <div class="card-top">
                    <span class="project-year">${project.year}</span>
                    <div class="external-links">
                        ${project.githubUrl ? iconLink(project.githubUrl, "GitHub", githubIcon()) : ""}
                        ${project.googleDriveUrl ? iconLink(project.googleDriveUrl, "Google Drive", driveIcon()) : ""}
                        ${project.liveUrl ? iconLink(project.liveUrl, "Live Demo", externalIcon()) : ""}
                    </div>
                </div>
                <h3 class="card-title">${project.title}</h3>
                <p class="card-role">${project.role}</p>
                <p class="card-desc">${project.shortDescription}</p>
                <div class="card-tech">
                    ${project.tech.map((tech) => `<span>${tech}</span>`).join("")}
                </div>
            </article>
        `).join("");

        document.querySelectorAll(".project-card").forEach((card) => {
            card.addEventListener("click", (event) => {
                if (event.target.closest("a")) {
                    return;
                }
                openModal(Number(card.dataset.id));
            });
        });
    }

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
                    <p class="modal-subtitle">${project.role} | ${project.year}</p>
                </div>
                <div class="external-links">
                    ${project.githubUrl ? iconLink(project.githubUrl, "GitHub", githubIcon()) : ""}
                    ${project.googleDriveUrl ? iconLink(project.googleDriveUrl, "Google Drive", driveIcon()) : ""}
                    ${project.liveUrl ? iconLink(project.liveUrl, "Live Demo", externalIcon()) : ""}
                </div>
            </div>
            <p class="modal-copy">${project.longDescription}</p>
            <h3 class="modal-section-title">Highlights</h3>
            <ul class="modal-highlights">
                ${project.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
            </ul>
            <h3 class="modal-section-title">Technologies</h3>
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
        themeToggleText.textContent = isLight ? "Dark Mode" : "Light Mode";
    }

    function revealSections() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14 });

        document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    }

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
