/**
 * Projects Manager for Mahmoud Shaban Portfolio
 * Handles loading custom projects from localStorage and rendering them.
 */

const PROJECTS_KEY = 'custom_portfolio_projects';

async function getCustomProjects() {
    let localProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');

    try {
        // Versuche die fest gespeicherte JSON Datei zu laden
        const response = await fetch('js/projects-data.json');
        if (response.ok) {
            const fileProjects = await response.json();
            // Kombiniere beide, vermeide Duplikate durch IDs
            const combined = [...fileProjects];
            localProjects.forEach(lp => {
                if (!combined.find(p => p.id === lp.id)) {
                    combined.push(lp);
                }
            });
            return combined;
        }
    } catch (e) {
        console.log("Keine js/projects-data.json gefunden oder Fehler beim Laden. Nutze nur LocalStorage.");
    }

    return localProjects;
}

async function saveCustomProject(project) {
    const projects = await getCustomProjects();
    projects.push(project);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

async function deleteCustomProject(id) {
    let projects = await getCustomProjects();
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

/**
 * Renders custom projects into the grid.
 * @param {string} containerSelector - The CSS selector for the project grid.
 * @param {string} lang - 'en' or 'de'.
 */
async function renderCustomProjects(containerSelector, lang = 'en') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const projects = await getCustomProjects();

    projects.forEach((proj, index) => {
        const title = lang === 'de' ? (proj.title_de || proj.title_en) : (proj.title_en || proj.title_de);
        const subtitle = lang === 'de' ? (proj.subtitle_de || proj.subtitle_en) : (proj.subtitle_en || proj.subtitle_de);
        const tags = lang === 'de' ? (proj.tags_de || proj.tags_en) : (proj.tags_en || proj.tags_de);

        const projectCard = document.createElement('a');
        projectCard.href = `project-details.html?id=${proj.id}&lang=${lang}`;
        projectCard.className = 'project-card custom-project-card';
        projectCard.setAttribute('data-aos', 'fade-up');
        projectCard.setAttribute('data-aos-delay', (index + 7) * 100); // Start after original 6 projects

        let tagsHtml = '';
        if (tags && Array.isArray(tags) && tags.length > 0) {
            tagsHtml = `
                <div class="project-tags">
                    ${tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
            `;
        }

        projectCard.innerHTML = `
            <img src="${proj.main_image}" alt="${title}" class="project-img">
            <div class="project-overlay">
                <h3 class="project-title">${title}</h3>
                <p>${subtitle}</p>
                ${tagsHtml}
            </div>
            <div class="custom-badge" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 10px; z-index: 10;">Custom</div>
        `;

        container.appendChild(projectCard);
    });

    // Refresh AOS if available
    if (window.AOS) {
        window.AOS.refresh();
    }
}

/**
 * Loads project details for the details page.
 */
async function loadProjectDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const lang = params.get('lang') || 'en';

    if (!id) return;

    const projects = await getCustomProjects();
    const proj = projects.find(p => p.id === id);

    if (!proj) {
        console.error('Project not found');
        return;
    }

    const title = lang === 'de' ? (proj.title_de || proj.title_en) : (proj.title_en || proj.title_de);
    const subtitle = lang === 'de' ? (proj.subtitle_de || proj.subtitle_en) : (proj.subtitle_en || proj.subtitle_de);
    const tags = lang === 'de' ? (proj.tags_de || proj.tags_en) : (proj.tags_en || proj.tags_de);

    // Get section content
    const problem = lang === 'de' ? (proj.problem_de || proj.problem_en) : (proj.problem_en || proj.problem_de);
    const solution = lang === 'de' ? (proj.solution_de || proj.solution_en) : (proj.solution_en || proj.solution_de);
    const techDesc = lang === 'de' ? (proj.tech_desc_de || proj.tech_desc_en) : (proj.tech_desc_en || proj.tech_desc_de);

    // Header labels (Use custom if available, otherwise default)
    const labels = {
        problem: lang === 'de' ? (proj.header_problem_de || 'Das Problem') : (proj.header_problem_en || 'The Problem'),
        solution: lang === 'de' ? (proj.header_solution_de || 'Die Lösung') : (proj.header_solution_en || 'The Solution'),
        tech: lang === 'de' ? (proj.header_tech_de || 'Technologien') : (proj.header_tech_en || 'Technologies')
    };

    // Update Page Elements
    document.title = `Mahmoud Shaban – ${title}`;

    const heroSection = document.querySelector('.slider-item');
    if (heroSection) {
        heroSection.style.backgroundImage = `url('${proj.main_image}')`;
    }

    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = title;

    const breadcrumb = document.querySelector('.custom-breadcrumbs');
    if (breadcrumb) {
        breadcrumb.innerHTML = `<a href="index.html">Home</a> <span class="mx-3">/</span> ${subtitle}`;
    }

    const detailTitle = document.querySelector('.detail-title');
    if (detailTitle) detailTitle.textContent = lang === 'de' ? 'Projektdetails' : 'Project Details';

    const detailDesc = document.querySelector('.detail-description');
    if (detailDesc) {
        let html = '';
        if (problem) html += `<div class="mb-4"><strong class="d-block text-black">${labels.problem}:</strong><p>${problem.replace(/\n/g, '<br>')}</p></div>`;
        if (solution) html += `<div class="mb-4"><strong class="d-block text-black">${labels.solution}:</strong><p>${solution.replace(/\n/g, '<br>')}</p></div>`;

        // Show Technologies header if either techDesc or tags exist
        if (techDesc || (tags && tags.length > 0)) {
            html += `<div class="mb-4"><strong class="d-block text-black">${labels.tech}:</strong>`;
            if (techDesc) {
                html += `<p>${techDesc.replace(/\n/g, '<br>')}</p>`;
            }
            html += `</div>`;
        }
        detailDesc.innerHTML = html;
    }

    const imageContainer = document.querySelector('.project-images-container');
    if (imageContainer && proj.detail_images) {
        imageContainer.innerHTML = proj.detail_images.map(img => `
            <a href="${img}" class="mb-3 d-block" data-fancybox="gal">
                <img src="${img}" alt="Project Detail" class="img-fluid">
            </a>
        `).join('');
    }

    const techList = document.querySelector('.tech-list');
    if (techList && tags) {
        techList.innerHTML = tags.map(tag => `<li><strong>${tag}</strong></li>`).join('');
    }

    const githubBtn = document.querySelector('.github-btn');
    if (githubBtn) {
        if (proj.github_url) {
            githubBtn.href = proj.github_url;
            githubBtn.style.display = 'inline-block';
        } else {
            githubBtn.style.display = 'none';
        }
    }
}
