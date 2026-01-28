let projects = {};
let currentProject = null;
let currentProjectData = null;
let isProjectsLoaded = false;

const STORAGE_KEYS = {
    projects: 'EasyScript_Projects',
    current: 'EasyScript_CurrentProject',
    size: 'EasyScript_ProjectsPanelSize'
};

function getWorkspaceData() {
    return workspaceRef ? {
        scripts: currentProjectData?.scripts || {},
        projectName: document.getElementById('projectName')?.value || 'New Project'
    } : null;
}

function loadWorkspaceData(data) {
    if (!workspaceRef || !data) return;
    
    if (currentProject && currentProjectData) saveCurrentProjectData();
    
    currentProjectData = data;
    if (data.projectName) document.getElementById('projectName').value = data.projectName;
    
    saveProjects();
}

function renderProjectsList() {
    const list = document.getElementById('projectsList');
    if (!list) return;
    
    list.innerHTML = '';
    
    Object.keys(projects).forEach(id => {
        const proj = projects[id];
        const row = document.createElement('div');
        row.className = `project-row${id === currentProject ? ' active' : ''}`;
        row.dataset.id = id;
        
        const title = document.createElement('span');
        title.textContent = proj.name || 'Unnamed Project';
        title.style.flex = '1';
        
        const actions = document.createElement('div');
        actions.className = 'project-actions';
        
        ['▶', '✎', '🗑'].forEach((icon, i) => {
            const btn = document.createElement('button');
            btn.textContent = icon;
            btn.title = i === 0 ? 'Run Project' : i === 1 ? 'Rename Project' : 'Delete Project';
            btn.onclick = (e) => {
                e.stopPropagation();
                if (i === 0) runProject(id);
                else if (i === 1) renameProject(id);
                else deleteProject(id);
            };
            actions.appendChild(btn);
        });
        
        title.onclick = () => switchProject(id);
        row.appendChild(title);
        row.appendChild(actions);
        list.appendChild(row);
    });
}

function saveCurrentProjectData() {
    if (!currentProject || !workspaceRef) return;
    
    projects[currentProject] = {
        ...projects[currentProject],
        data: getWorkspaceData(),
        lastModified: new Date().toISOString()
    };
}

function createProject(name) {
    if (!name?.trim()) return;
    
    const id = `project_${Date.now()}`;
    const projName = name.trim();
    
    projects[id] = {
        id,
        name: projName,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        data: { projectName: projName, scripts: { Main: null } }
    };
    
    switchProject(id);
    renderProjectsList();
    saveProjects();
    return id;
}

function deleteProject(id) {
    if (!projects[id] || Object.keys(projects).length <= 1) {
        alert('Cannot delete the only project');
        return;
    }
    
    if (!confirm(`Delete "${projects[id].name}"?`)) return;
    
    delete projects[id];
    
    if (currentProject === id) {
        const remaining = Object.keys(projects);
        if (remaining.length) switchProject(remaining[0]);
    }
    
    renderProjectsList();
    saveProjects();
}

function renameProject(id) {
    if (!projects[id]) return;
    
    const newName = prompt('New project name:', projects[id].name);
    if (!newName?.trim() || newName === projects[id].name) return;
    
    projects[id].name = newName.trim();
    projects[id].lastModified = new Date().toISOString();
    
    if (currentProject === id) {
        document.getElementById('projectName').value = newName.trim();
    }
    
    renderProjectsList();
    saveProjects();
}

function switchProject(id) {
    if (!workspaceRef || id === currentProject || !projects[id]) return;
    
    if (currentProject) saveCurrentProjectData();
    
    currentProject = id;
    currentProjectData = projects[id].data;
    
    document.getElementById('projectName').value = projects[id].name;
    loadWorkspaceData(currentProjectData);
    renderProjectsList();
    
    localStorage.setItem(STORAGE_KEYS.current, id);
    saveProjects();
}

function runProject(id) {
    if (!projects[id]) return;
    
    if (currentProject !== id) {
        saveCurrentProjectData();
        currentProject = id;
        currentProjectData = projects[id].data;
        loadWorkspaceData(currentProjectData);
    }
    
    document.getElementById('Run')?.click();
}

function saveProjects() {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
    if (currentProject) localStorage.setItem(STORAGE_KEYS.current, currentProject);
}

function loadProjects() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.projects);
        if (stored) projects = JSON.parse(stored);
        
        const currentId = localStorage.getItem(STORAGE_KEYS.current);
        if (currentId && projects[currentId]) {
            currentProject = currentId;
            currentProjectData = projects[currentId].data;
        } else if (Object.keys(projects).length) {
            const firstId = Object.keys(projects)[0];
            currentProject = firstId;
            currentProjectData = projects[firstId].data;
        }
        return true;
    } catch {
        return false;
    }
}

function setupResize(panel) {
    const handle = panel.querySelector('.resize-handle, .resize-handle-projects');
    if (!handle) return;
    
    let resizing = false;
    const MIN = { w: 250, h: 200 };
    const MAX_H = window.innerHeight - 100;
    let start = { w: 0, h: 0, x: 0, y: 0, left: 0 };
    
    handle.addEventListener('pointerdown', (e) => {
        if (panel.classList.contains('collapsed') || panel.classList.contains('hidden')) return;
        
        resizing = true;
        bringToFront(panel);
        
        start = {
            w: panel.offsetWidth,
            h: panel.offsetHeight,
            x: e.clientX,
            y: e.clientY,
            left: panel.offsetLeft
        };
        
        handle.setPointerCapture(e.pointerId);
        document.body.style.userSelect = 'none';
        e.stopPropagation();
    });
    
    const move = (e) => {
        if (!resizing) return;
        
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        
        const w = Math.max(MIN.w, start.w - dx);
        const h = Math.max(MIN.h, Math.min(MAX_H, start.h + dy));
        const left = start.left + (start.w - w);
        
        panel.style.left = `${left}px`;
        panel.style.width = `${w}px`;
        panel.style.height = `${h}px`;
        
        const list = panel.querySelector('.projects-list');
        if (list && !panel.classList.contains('collapsed')) {
            list.style.height = `calc(${h}px - var(--panel-header-height))`;
        }
    };
    
    const up = () => {
        if (!resizing) return;
        
        resizing = false;
        document.body.style.userSelect = 'auto';
        
        localStorage.setItem(STORAGE_KEYS.size, JSON.stringify({
            width: panel.offsetWidth,
            height: panel.offsetHeight,
            left: parseInt(panel.style.left) || panel.offsetLeft
        }));
    };
    
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    
    const saved = localStorage.getItem(STORAGE_KEYS.size);
    if (saved && !panel.classList.contains('collapsed')) {
        try {
            const size = JSON.parse(saved);
            panel.style.width = `${Math.max(MIN.w, size.width)}px`;
            panel.style.height = `${Math.max(MIN.h, Math.min(MAX_H, size.height))}px`;
            if (size.left) panel.style.left = `${size.left}px`;
        } catch {}
    }
}

function initProjectsManager(workspace) {
    workspaceRef = workspace;
    
    const panel = document.getElementById('projectsPanel');
    const list = document.getElementById('projectsList');
    const btnProjects = document.getElementById('projectsBtn');
    const btnNew = document.getElementById('newProject');
    const btnClose = document.getElementById('closeProjectsPanel');
    const btnToggle = document.getElementById('toggleProjects');
    const header = panel?.querySelector('.projects-panel-header');
    
    if (!loadProjects()) createProject('My First Project');
    
    if (currentProject && currentProjectData) {
        document.getElementById('projectName').value = projects[currentProject].name;
    }
    
    if (panel) setupResize(panel);
    
    if (btnProjects) btnProjects.onclick = () => {
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            renderProjectsList();
            bringToFront(panel);
        }
    };
    
    if (btnNew) btnNew.onclick = () => {
        const name = prompt('New project name:', `Project ${Object.keys(projects).length + 1}`);
        if (name?.trim()) {
            createProject(name);
            renderProjectsList();
            bringToFront(panel);
        }
    };
    
    if (btnClose) btnClose.onclick = () => {
        panel.classList.add('hidden');
        saveCurrentProjectData();
    };
    
    if (btnToggle) btnToggle.onclick = () => {
        if (panel.classList.contains('collapsed')) {
            panel.classList.remove('collapsed');
            list.style.display = 'flex';
            panel.style.height = 'auto';
            
            const saved = localStorage.getItem(STORAGE_KEYS.size);
            if (saved) {
                try {
                    const size = JSON.parse(saved);
                    panel.style.height = `${Math.max(200, Math.min(window.innerHeight - 100, size.height))}px`;
                } catch {}
            }
        } else {
            panel.classList.add('collapsed');
            list.style.display = 'none';
            panel.style.height = 'var(--panel-header-height)';
        }
        bringToFront(panel);
    };
    
    if (header) {
        header.addEventListener('pointerdown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            bringToFront(panel);
            
            let dragging = true;
            const start = { x: e.clientX, y: e.clientY, left: panel.offsetLeft, top: panel.offsetTop };
            
            header.setPointerCapture(e.pointerId);
            document.body.style.userSelect = 'none';
            
            const move = (ev) => {
                if (!dragging) return;
                
                let nx = start.left + ev.clientX - start.x;
                let ny = start.top + ev.clientY - start.y;
                
                nx = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, nx));
                ny = Math.max(50, Math.min(window.innerHeight - panel.offsetHeight, ny));
                
                panel.style.left = `${nx}px`;
                panel.style.top = `${ny}px`;
            };
            
            const up = () => {
                dragging = false;
                document.body.style.userSelect = 'auto';
                document.removeEventListener('pointermove', move);
                document.removeEventListener('pointerup', up);
            };
            
            document.addEventListener('pointermove', move);
            document.addEventListener('pointerup', up);
        });
    }
    
    workspaceRef.addChangeListener(() => {
        if (!isProjectsLoaded) return;
        
        if (autosaveTimer) clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(() => {
            if (currentProject) {
                saveCurrentProjectData();
                saveProjects();
            }
        }, 500);
    });
    
    isProjectsLoaded = true;
    renderProjectsList();
}

window.initProjectsManager = initProjectsManager;