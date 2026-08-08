// Global state
let zIndexCounter = 1000;
let openWindows = {}; // id -> window element
let projectsData = null;

// Icons mapping
const icons = {
    'my-computer': 'https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png',
    'projects': 'https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png',
    'recycle-bin': 'https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png',
    'resume': 'https://win98icons.alexmeub.com/icons/png/notepad_file-0.png',
    'project-file': 'https://win98icons.alexmeub.com/icons/png/console_prompt-0.png'
};

document.addEventListener('DOMContentLoaded', () => {
    // Clock
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);

    // Click outside start menu closes it
    document.addEventListener('click', (e) => {
        const startMenu = document.getElementById('start-menu');
        const startBtn = document.getElementById('start-button');
        if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
            startMenu.classList.add('hidden');
        }
    });

    // Desktop icon selection
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
            e.stopPropagation();
        });
    });

    document.getElementById('desktop').addEventListener('click', () => {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    });

    // Fetch projects
    fetch('projects.json')
        .then(res => res.json())
        .then(data => {
            projectsData = data;
            // Optionally auto-open projects on load
            setTimeout(() => {
                openWindow('projects');
            }, 500);
        })
        .catch(err => console.error("Error loading projects.json", err));
});

function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenu.classList.toggle('hidden');
}

function shutdown() {
    document.body.innerHTML = '<div style="background:black; width:100vw; height:100vh; display:flex; justify-content:center; align-items:center; color:white; font-family:Tahoma; font-size: 24px;">It is now safe to turn off your computer.</div>';
}

function bringToFront(winId) {
    const win = openWindows[winId];
    if (win) {
        zIndexCounter++;
        win.style.zIndex = zIndexCounter;
        
        // Update active classes
        Object.values(openWindows).forEach(w => w.classList.remove('active'));
        win.classList.add('active');

        // Update taskbar active state
        document.querySelectorAll('.taskbar-item').forEach(btn => btn.classList.remove('active'));
        const taskBtn = document.getElementById(`taskbtn-${winId}`);
        if (taskBtn) taskBtn.classList.add('active');
    }
}

function openWindow(id, titleOverride, contentOverride) {
    // If already open, just bring to front and unminimize
    if (openWindows[id]) {
        const win = openWindows[id];
        win.style.display = 'flex';
        bringToFront(id);
        return;
    }

    const template = document.getElementById('window-template');
    const winWrap = template.content.cloneNode(true);
    const win = winWrap.querySelector('.window');
    
    win.id = `win-${id}`;
    
    let title = titleOverride || (id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' '));
    let iconSrc = icons[id] || icons['project-file'];
    
    win.querySelector('.title-name').innerText = title;
    win.querySelector('.title-icon').src = iconSrc;

    // Content Population
    const contentArea = win.querySelector('.window-content');
    if (contentOverride) {
        contentArea.innerHTML = contentOverride;
    } else {
        if (id === 'projects') {
            contentArea.innerHTML = buildProjectsContent();
        } else if (id === 'resume') {
            contentArea.innerHTML = `<div class="content-inner" style="font-family: Arial, sans-serif; line-height: 1.4;">
                <h1 style="margin: 0 0 5px 0; font-size: 20px;">NIVEDH SUNIL</h1>
                <p style="margin: 0 0 15px 0; font-size: 12px; color: #555;">Backend AI Engineer | Full-Stack Developer | Systems Builder<br>
                <a href="mailto:nivedhn160@gmail.com">nivedhn160@gmail.com</a> | <a href="https://github.com/NivedhN160" target="_blank">github.com/NivedhN160</a> | <a href="https://linkedin.com/in/nivedhn160" target="_blank">LinkedIn</a></p>
                
                <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 5px;">PROFESSIONAL SUMMARY</h3>
                <p style="font-size: 11px;">Third-year CSE student and Backend AI Engineering Intern at FlyRank AI. Built production agentic backends (FastAPI + LLMs), a bare-metal OS in C, and a full transformer from scratch in Zig. Seeking full-time roles in Backend and AI Engineering.</p>
                
                <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 5px;">EXPERIENCE</h3>
                <p style="font-size: 11px; margin: 2px 0;"><strong>Backend AI Engineering Intern</strong> — FlyRank AI (2026 - Present)</p>
                <ul style="font-size: 11px; padding-left: 20px; margin-top: 5px; margin-bottom: 10px;">
                    <li>Shipped agentic AI backend systems to production in Python and FastAPI, integrating LLM reasoning into internal tooling.</li>
                    <li>Designed and built REST APIs and backend infrastructure end-to-end for cohort-based capstone deliverables.</li>
                </ul>
                
                <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 5px;">FEATURED PROJECTS</h3>
                <ul style="font-size: 11px; padding-left: 20px; margin-top: 5px;">
                    <li><strong>N-OS (Bare-Metal OS):</strong> Built a 32-bit OS from scratch in C with PE/ELF loaders and a hand-rolled TCP/IP stack.</li>
                    <li><strong>N.E.O.S (AI Orchestrator):</strong> Built an autonomous AI orchestrator with real-time VAD and agentic tool-calling on Groq Llama 3.3.</li>
                    <li><strong>ZigNGPT v2 (Transformer from Scratch):</strong> Hand-wrote attention and backpropagation at the matrix level in Zig without ML frameworks.</li>
                    <li><strong>MAT-CHA.AI:</strong> Architected a serverless AWS pipeline for an AI matchmaking platform and extended it with an MCP tool server.</li>
                </ul>

                <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 5px;">TECHNICAL SKILLS</h3>
                <p style="font-size: 11px;"><strong>Languages:</strong> Python, JavaScript/Node.js, C, C++, Zig, Go, SQL<br>
                <strong>AI / ML:</strong> LLaMA 2/3, Groq, OpenCV, MediaPipe, PyTorch, Hugging Face, RAG, Agentic AI, MCP<br>
                <strong>Web & Backend:</strong> FastAPI, React, Flask, Django REST, Node.js, REST APIs<br>
                <strong>Cloud & Databases:</strong> AWS (Lambda, S3, DynamoDB, Bedrock), PostgreSQL, Git, CI/CD</p>
            </div>`;
        } else if (id === 'my-computer') {
            contentArea.innerHTML = `<div class="content-inner"><p>Local Disk (C:)</p><p>Total Size: 500GB</p></div>`;
        } else if (id === 'recycle-bin') {
            contentArea.innerHTML = `<div class="content-inner"><p>The recycle bin is empty.</p></div>`;
        }
    }

    // Centering with some random offset
    const offset = Object.keys(openWindows).length * 20;
    if (window.innerWidth <= 768) {
        win.style.top = `${50 + offset}px`;
    } else {
        win.style.top = `${100 + offset}px`;
        win.style.left = `${150 + offset}px`;
    }

    // Controls
    win.querySelector('.btn-close').addEventListener('click', () => closeWindow(id));
    win.querySelector('.btn-minimize').addEventListener('click', () => minimizeWindow(id));
    
    // Maximize logic
    let isMaximized = false;
    let preMaxRect = {};
    win.querySelector('.btn-maximize').addEventListener('click', () => {
        if (!isMaximized) {
            preMaxRect = { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height };
            win.style.top = '0';
            win.style.left = '0';
            win.style.width = '100vw';
            win.style.height = 'calc(100vh - 30px)';
        } else {
            win.style.top = preMaxRect.top;
            win.style.left = preMaxRect.left;
            win.style.width = preMaxRect.width;
            win.style.height = preMaxRect.height;
        }
        isMaximized = !isMaximized;
    });

    win.addEventListener('mousedown', () => bringToFront(id));
    
    // Dragging logic
    const titleBar = win.querySelector('.title-bar');
    let isDragging = false;
    let dragStartX, dragStartY;
    
    const startDrag = (e) => {
        if (e.target.closest('button')) return; // Don't drag if clicking buttons
        isDragging = true;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        dragStartX = clientX - win.offsetLeft;
        dragStartY = clientY - win.offsetTop;
        bringToFront(id);
    };

    const doDrag = (e) => {
        if (isDragging) {
            // Only prevent default on touch to stop scrolling while dragging
            if (e.type.includes('touch')) e.preventDefault();
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            win.style.left = `${clientX - dragStartX}px`;
            win.style.top = `${clientY - dragStartY}px`;
        }
    };

    const stopDrag = () => {
        isDragging = false;
    };

    titleBar.addEventListener('mousedown', startDrag);
    titleBar.addEventListener('touchstart', startDrag, {passive: false});

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('touchmove', doDrag, {passive: false});

    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    document.body.appendChild(win);
    win.style.display = 'flex';
    openWindows[id] = win;

    // Add to taskbar
    addTaskbarItem(id, title, iconSrc);
    bringToFront(id);
}

function closeWindow(id) {
    const win = openWindows[id];
    if (win) {
        win.remove();
        delete openWindows[id];
    }
    const taskBtn = document.getElementById(`taskbtn-${id}`);
    if (taskBtn) taskBtn.remove();
}

function minimizeWindow(id) {
    const win = openWindows[id];
    if (win) {
        win.style.display = 'none';
        win.classList.remove('active');
    }
    const taskBtn = document.getElementById(`taskbtn-${id}`);
    if (taskBtn) taskBtn.classList.remove('active');
}

function addTaskbarItem(id, title, iconSrc) {
    const taskbarTasks = document.getElementById('taskbar-tasks');
    const btn = document.createElement('div');
    btn.className = 'taskbar-item active';
    btn.id = `taskbtn-${id}`;
    btn.innerHTML = `<img src="${iconSrc}" alt="icon">${title}`;
    
    btn.addEventListener('click', () => {
        const win = openWindows[id];
        if (win.style.display === 'none') {
            win.style.display = 'flex';
            bringToFront(id);
        } else if (win.classList.contains('active')) {
            minimizeWindow(id);
        } else {
            bringToFront(id);
        }
    });

    taskbarTasks.appendChild(btn);
}

function buildProjectsContent() {
    if (!projectsData || !projectsData.projects) return '<div class="content-inner">Loading projects...</div>';
    
    let html = `
    <div class="explorer-toolbar">
        <span>Address</span>
        <select disabled><option>C:\\Users\\Nivedh\\Projects</option></select>
    </div>
    <div class="project-grid">`;
    
    projectsData.projects.forEach(p => {
        const isFeatured = p.name === projectsData.featured;
        const badge = isFeatured ? `<span class="featured-badge">★ Featured</span>` : '';
        html += `
        <div class="project-item" ondblclick="openProjectDetail('${p.name}')">
            <img src="${icons['project-file']}" alt="Project">
            <div class="project-details">
                <span class="project-name">${p.name}${badge}</span>
                <span class="project-desc">${p.description || 'No description provided.'}</span>
            </div>
        </div>`;
    });
    
    html += `</div>`;
    return html;
}

function openProjectDetail(projectName) {
    const project = projectsData.projects.find(p => p.name === projectName);
    if (!project) return;
    
    const content = `
        <div class="content-inner" style="font-family: Arial, sans-serif;">
            <h2>${project.name}</h2>
            <p><strong>Description:</strong> ${project.description || 'N/A'}</p>
            <p><strong>Language:</strong> ${project.language}</p>
            <p><strong>Last Updated:</strong> ${new Date(project.last_updated).toLocaleDateString()}</p>
            <hr>
            <p><a href="${project.url}" target="_blank">View Source Code on GitHub</a></p>
            ${project.homepage ? `<p><a href="${project.homepage}" target="_blank">Live Demo</a></p>` : ''}
        </div>
    `;
    
    openWindow(`proj-${project.name}`, project.name, content);
}
