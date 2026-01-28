let workspaceRef = null;
let scripts = {};
let currentScript = null;
let isLoaded = false;
let autosaveTimer = null;

const deepCopy = v => JSON.parse(JSON.stringify(v));

const defaultBringToFront = el => {
  if (!el) return;
  window.EasyScriptTopZ = (window.EasyScriptTopZ || 1000) + 1;
  el.style.zIndex = window.EasyScriptTopZ;
};

const bringToFront = el => {
  if (!el) return;
  if (typeof window.bringToFront === 'function') {
    try { window.bringToFront(el); return; } catch (e) { }
  }
  defaultBringToFront(el);
};

function ensureMainScript() {
  if (!scripts['Main']) {
    scripts['Main'] = null;
    if (!currentScript) {
      currentScript = 'Main';
    }
  }
}

function renderScriptsList() {
  const listEl = document.getElementById('scriptsList') || document.getElementById('scriptsListDynamic');
  if (!listEl) return;
  listEl.innerHTML = '';
  Object.keys(scripts).forEach(name => {
    const row = document.createElement('div');
    row.className = 'script-row' + (name === currentScript ? ' selected' : '');
    row.dataset.name = name;
    
    const title = document.createElement('span');
    title.textContent = name;
    title.style.flex = '1';
    
    if (name !== 'Main') {
      const actions = document.createElement('div');
      actions.className = 'script-actions';
      
      const btnRename = document.createElement('button'); 
      btnRename.textContent = '✎';
      
      const btnDelete = document.createElement('button'); 
      btnDelete.textContent = '🗑';
      
      actions.appendChild(btnRename);
      actions.appendChild(btnDelete);
      row.appendChild(title);
      row.appendChild(actions);
      
      btnRename.addEventListener('click', e => { 
        e.stopPropagation(); 
        renameScript(name); 
      });
      
      btnDelete.addEventListener('click', e => { 
        e.stopPropagation(); 
        removeScript(name); 
      });
    } else {
      row.appendChild(title);
    }
    
    title.addEventListener('click', () => switchScript(name));
    listEl.appendChild(row);
  });
}

function saveCurrentToScripts() {
  if (!currentScript || !workspaceRef) return;
  scripts[currentScript] = deepCopy(Blockly.serialization.workspaces.save(workspaceRef));
}

function createScript(name) {
  if (!name || name.trim() === '') return;
  if (scripts[name]) {
    alert('Script already exists');
    return;
  }
  scripts[name] = null;
  switchScript(name);
  renderScriptsList();
}

function removeScript(name) {
  if (!scripts[name] || name === 'Main') return;
  if (!confirm(`Delete "${name}"?`)) return;
  delete scripts[name];
  if (currentScript === name) {
    switchScript('Main');
  }
  renderScriptsList();
}

function renameScript(oldName) {
  if (oldName === 'Main') return;
  const newName = prompt('New name:', oldName);
  if (!newName || newName.trim() === '' || newName === oldName) return;
  if (scripts[newName]) { 
    alert('Name taken'); 
    return; 
  }
  scripts[newName] = scripts[oldName];
  delete scripts[oldName];
  if (currentScript === oldName) currentScript = newName;
  renderScriptsList();
}

function switchScript(name) {
  if (!workspaceRef || name === currentScript || !scripts[name]) return;
  if (currentScript) saveCurrentToScripts();
  workspaceRef.clear();
  if (scripts[name]) {
    try { Blockly.serialization.workspaces.load(deepCopy(scripts[name]), workspaceRef); }
    catch (e) { alert('Error loading: ' + name); }
  }
  currentScript = name;
  renderScriptsList();
}

function saveProjectToFile() {
  saveCurrentToScripts();
  ensureMainScript();
  const payload = { 
    projectName: document.getElementById('projectName')?.value || 'project', 
    scripts 
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (payload.projectName || 'project') + '.ES1';
  a.click();
  URL.revokeObjectURL(a.href);
}

function loadProjectFromFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      scripts = data.scripts || { Main: data };
      ensureMainScript();
      const keys = Object.keys(scripts);
      if (keys.length) switchScript(keys.includes('Main') ? 'Main' : keys[0]);
      if (data.projectName) document.getElementById('projectName').value = data.projectName;
      renderScriptsList();
    } catch {
      alert('Invalid file');
    }
  };
  reader.readAsText(file);
}

function getSafeGenerator(ws) {
  const JSG = javascriptGenerator;
  try { JSG.init(ws); } catch (e) { JSG.init(ws); }
  JSG.scrub_ = (block, code, opt_thisOnly) => {
    const nextBlock = block.getNextBlock();
    if (nextBlock && !opt_thisOnly) return code + JSG.blockToCode(nextBlock);
    return code;
  };
  return JSG;
}

function makehtml(buildAll = true) {
    if (currentScript) saveCurrentToScripts();
    ensureMainScript();
    const names = buildAll ? Object.keys(scripts) : (currentScript ? [currentScript] : ['Main']);
    if (!workspaceRef) return '';
    
    const tempWs = new Blockly.Workspace();
    const JSG = getSafeGenerator(tempWs);
    let combinedCode = '';
    
    const generateForScript = name => {
        tempWs.clear();
        if (scripts[name]) {
            try { Blockly.serialization.workspaces.load(deepCopy(scripts[name]), tempWs); }
            catch (e) { }
        }
        try {
            JSG.init(tempWs);
        } catch (e) { }
        let codeFinal = '';
        tempWs.getTopBlocks(true).forEach(block => {
            try {
                const c = JSG.blockToCode(block, true) || '';
                codeFinal += Array.isArray(c) ? c[0] : c;
            } catch (e) { }
        });
        try { return JSG.finish(codeFinal || ''); } catch (e) { return codeFinal || ''; }
    };
    
    names.forEach(name => {
        if (scripts[name]) {
            combinedCode += `// Script: ${name}\n`;
            combinedCode += `(async function(){\n${generateForScript(name)}\n})();\n`;
        }
    });
    
    if (currentScript && scripts[currentScript]) {
        try {
            workspaceRef.clear();
            Blockly.serialization.workspaces.load(deepCopy(scripts[currentScript]), workspaceRef);
        } catch (e) { }
    }
    
    const projectNameInput = document.getElementById('projectName');
    const projectName = projectNameInput ? projectNameInput.value || 'New Project' : 'New Project';
    
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${projectName}</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { 
    width: 100%; 
    height: 100%; 
    overflow: hidden;
    background: #2a2a2a;
  }
  #canvas { 
    display: block;
    width: 100vw;
    height: 100vh;
    background: white;
  }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const sprite = { 
  x: canvas.width / 2, 
  y: canvas.height / 2, 
  rotation: 0, 
  penDown: false 
};

if (!window.__gs_initialized) {
  window.__gs_initialized = true;
  window.__lastTime = performance.now();
  window.__deltaTime = 0;
  window.__gs_update = now => {
    window.__deltaTime = (now - window.__lastTime) / 1000;
    window.__lastTime = now;
  };
  
  window.__keyState = {};
  window.addEventListener('keydown', e => {
    let s = window.__keyState[e.key] || { down: false, pressed: false, released: false };
    if (!s.down) s.pressed = true;
    s.down = true;
    s.released = false;
    window.__keyState[e.key] = s;
  });
  
  window.addEventListener('keyup', e => {
    let s = window.__keyState[e.key] || { down: false, pressed: false, released: false };
    s.down = false;
    s.pressed = false;
    s.released = true;
    window.__keyState[e.key] = s;
  });
  
  window.__mouseState = { 
    x: 0, 
    y: 0, 
    left: { down: false, pressed: false, released: false },
    right: { down: false, pressed: false, released: false }
  };
  
  canvas.addEventListener('mousemove', e => {
    window.__mouseState.x = e.clientX;
    window.__mouseState.y = e.clientY;
  });
  
  canvas.addEventListener('mousedown', e => {
    const btn = e.button === 0 ? 'left' : 'right';
    if (!window.__mouseState[btn].down) window.__mouseState[btn].pressed = true;
    window.__mouseState[btn].down = true;
    window.__mouseState[btn].released = false;
  });
  
  canvas.addEventListener('mouseup', e => {
    const btn = e.button === 0 ? 'left' : 'right';
    window.__mouseState[btn].down = false;
    window.__mouseState[btn].pressed = false;
    window.__mouseState[btn].released = true;
  });
  
  canvas.addEventListener('contextmenu', e => e.preventDefault());
}

ctx.strokeStyle = '#000000';
ctx.lineWidth = 2;

ctx.fillStyle = '#f0f0f0';
ctx.fillRect(0, 0, canvas.width, canvas.height);

(async function main() {
${combinedCode}
})();
<\/script>
</body>
</html>`;
  
    return html;
}

function setupScriptsResize(panel) {
  const resizeHandle = panel.querySelector('.resize-handle, .resize-handle-scripts');
  if (!resizeHandle) return;
  
  let resizing = false;
  const MIN_WIDTH = 250;
  const MIN_HEIGHT = 200;
  const MAX_HEIGHT = window.innerHeight - 100;
  let startSize = { width: 0, height: 0, x: 0, y: 0 };

  resizeHandle.addEventListener('pointerdown', (e) => {
    if (panel.classList.contains('collapsed') || panel.classList.contains('hidden')) return;
    
    resizing = true;
    bringToFront(panel);
    
    startSize = {
      width: panel.offsetWidth,
      height: panel.offsetHeight,
      x: e.clientX,
      y: e.clientY
    };
    
    resizeHandle.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'se-resize';
    
    e.stopPropagation();
  });

  const handlePointerMove = (e) => {
    if (!resizing) return;
    
    const deltaX = e.clientX - startSize.x;
    const deltaY = e.clientY - startSize.y;
    
    const newWidth = Math.max(MIN_WIDTH, startSize.width + deltaX);
    const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startSize.height + deltaY));
    
    panel.style.width = `${newWidth}px`;
    panel.style.height = `${newHeight}px`;
    
    const listEl = panel.querySelector('.scripts-list');
    if (listEl && !panel.classList.contains('collapsed')) {
      listEl.style.height = `calc(${newHeight}px - var(--panel-header-height))`;
    }
  };

  const handlePointerUp = () => {
    if (!resizing) return;
    
    resizing = false;
    document.body.style.userSelect = 'auto';
    document.body.style.cursor = '';
    
    localStorage.setItem('EasyScript_ScriptsPanelSize', JSON.stringify({
      width: panel.offsetWidth,
      height: panel.offsetHeight,
      left: parseInt(panel.style.left) || panel.offsetLeft
    }));
  };

  document.addEventListener('pointermove', handlePointerMove);
  document.addEventListener('pointerup', handlePointerUp);
  
  const savedSize = localStorage.getItem('EasyScript_ScriptsPanelSize');
  if (savedSize && !panel.classList.contains('collapsed')) {
    try {
      const size = JSON.parse(savedSize);
      panel.style.width = `${Math.max(MIN_WIDTH, size.width)}px`;
      panel.style.height = `${Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, size.height))}px`;
      if (size.left) {
        panel.style.left = `${size.left}px`;
      }
    } catch (e) {
      console.warn('Failed to restore scripts panel size:', e);
    }
  }
}

function initScriptManager(workspace) {
  workspaceRef = workspace;
  let panel = document.getElementById('scriptsPanel');
  let listEl = document.getElementById('scriptsList');
  let scriptsBtn = document.getElementById('scriptsBtn');
  let addScriptBtn = document.getElementById('addScript');
  let closeScriptsBtn = document.getElementById('closeScriptsPanel');
  
  if (!panel || !listEl || !scriptsBtn || !addScriptBtn || !closeScriptsBtn) {
    const dyn = document.createElement('div');
    dyn.id = 'scriptsPanelDynamic';
    dyn.className = 'scripts-panel hidden';
    dyn.innerHTML = `<div class="scripts-panel-header"><strong>Scripts</strong><div class="button-group"><button id="toggleScriptsDynamic">▲</button><button id="addScriptDynamic">+</button><button id="closeScriptsPanelDynamic">✕</button></div></div><div id="scriptsListDynamic" class="scripts-list"></div><div class="resize-handle resize-handle-scripts"></div>`;
    document.body.appendChild(dyn);
    panel = dyn;
    listEl = document.getElementById('scriptsListDynamic');
    scriptsBtn = document.getElementById('scriptsBtn');
    addScriptBtn = document.getElementById('addScriptDynamic');
    closeScriptsBtn = document.getElementById('closeScriptsPanelDynamic');
    const toggleBtn = document.getElementById('toggleScriptsDynamic');
    const header = panel.querySelector('.scripts-panel-header');
    panel.style.top = '60px';
    panel.style.left = '20px';
    panel.setAttribute('aria-hidden', 'true');
    
    setupScriptsResize(panel);
    
    toggleBtn && toggleBtn.addEventListener('click', () => {
      if (panel.classList.contains('collapsed')) {
        panel.classList.remove('collapsed');
        listEl.style.display = 'flex';
        panel.style.height = 'auto';
        
        const savedSize = localStorage.getItem('EasyScript_ScriptsPanelSize');
        if (savedSize) {
          try {
            const size = JSON.parse(savedSize);
            panel.style.height = `${Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, size.height))}px`;
          } catch (e) {}
        }
      } else {
        panel.classList.add('collapsed');
        listEl.style.display = 'none';
        panel.style.height = 'var(--panel-header-height)';
      }
      bringToFront(panel);
    });
    
    closeScriptsBtn && closeScriptsBtn.addEventListener('click', () => {
      panel.classList.add('hidden');
      saveCurrentToScripts();
    });
    
    scriptsBtn.addEventListener('click', () => {
      panel.classList.toggle('hidden');
      if (!panel.classList.contains('hidden')) {
        renderScriptsList();
        bringToFront(panel);
      }
    });
    
    addScriptBtn && addScriptBtn.addEventListener('click', () => {
      const name = prompt('Script name:', 'Script' + (Object.keys(scripts).length));
      if (!name || name.trim() === '') return;
      if (scripts[name]) {
        alert('Script already exists');
        return;
      }
      createScript(name);
      renderScriptsList();
      bringToFront(panel);
    });
    
    header && (header.onpointerdown = e => {
      if (e.target.tagName === 'BUTTON') return;
      bringToFront(panel);
      let dragging = true;
      const start = { x: e.clientX, y: e.clientY, left: panel.offsetLeft, top: panel.offsetTop };
      header.setPointerCapture(e.pointerId);
      document.body.style.userSelect = 'none';
      const move = ev => {
        if (!dragging) return;
        let nx = start.left + ev.clientX - start.x;
        let ny = start.top + ev.clientY - start.y;
        nx = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, nx));
        ny = Math.max(50, Math.min(window.innerHeight - panel.offsetHeight, ny));
        panel.style.left = nx + 'px';
        panel.style.top = ny + 'px';
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
  } else {
    setupScriptsResize(panel);
    
    scriptsBtn.addEventListener('click', () => {
      panel.classList.toggle('hidden');
      if (!panel.classList.contains('hidden')) {
        renderScriptsList();
        bringToFront(panel);
      }
    });
    
    closeScriptsBtn.addEventListener('click', () => {
      panel.classList.add('hidden');
      saveCurrentToScripts();
    });
    
    addScriptBtn.addEventListener('click', () => {
      const name = prompt('Script name:', 'Script' + (Object.keys(scripts).length));
      if (!name || name.trim() === '') return;
      if (scripts[name]) {
        alert('Script already exists');
        return;
      }
      createScript(name);
      renderScriptsList();
      bringToFront(panel);
    });
    
    const header = panel.querySelector('.scripts-panel-header');
    const toggleBtn = panel.querySelector('#toggleScripts');
    let dragging = false;
    let start = { x: 0, y: 0, left: 0, top: 0 };
    
    header && (header.onpointerdown = e => {
      if (e.target.tagName === 'BUTTON') return;
      bringToFront(panel);
      dragging = true;
      start = { x: e.clientX, y: e.clientY, left: panel.offsetLeft, top: panel.offsetTop };
      header.setPointerCapture(e.pointerId);
      document.body.style.userSelect = 'none';
    });
    
    document.addEventListener('pointermove', e => {
      if (!dragging) return;
      let nx = start.left + e.clientX - start.x;
      let ny = start.top + e.clientY - start.y;
      nx = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, nx));
      ny = Math.max(50, Math.min(window.innerHeight - panel.offsetHeight, ny));
      panel.style.left = nx + 'px';
      panel.style.top = ny + 'px';
    });
    
    document.addEventListener('pointerup', () => {
      dragging = false;
      document.body.style.userSelect = 'auto';
    });
    
    toggleBtn && toggleBtn.addEventListener('click', () => {
      if (panel.classList.contains('collapsed')) {
        panel.classList.remove('collapsed');
        panel.style.height = 'auto';
        listEl.style.display = 'flex';
        
        const savedSize = localStorage.getItem('EasyScript_ScriptsPanelSize');
        if (savedSize) {
          try {
            const size = JSON.parse(savedSize);
            panel.style.height = `${Math.max(200, Math.min(window.innerHeight - 100, size.height))}px`;
          } catch (e) {}
        }
      } else {
        panel.classList.add('collapsed');
        panel.style.height = 'var(--panel-header-height)';
        listEl.style.display = 'none';
      }
      bringToFront(panel);
    });
  }

  const stored = localStorage.getItem('EasyScript_Project');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      scripts = data.scripts || {};
      ensureMainScript();
      switchScript('Main');
      if (data.projectName) document.getElementById('projectName').value = data.projectName;
    } catch { }
  } else {
    scripts = {};
    createScript('Main');
  }

  isLoaded = true;
  renderScriptsList();

  workspaceRef.addChangeListener(() => {
    if (!isLoaded) return;
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      if (currentScript) saveCurrentToScripts();
      ensureMainScript();
      localStorage.setItem('EasyScript_Project', JSON.stringify({ 
        projectName: document.getElementById('projectName')?.value || 'project', 
        scripts 
      }));
    }, 400);
  });
}

window.saveProjectToFile = saveProjectToFile;
window.loadProjectFromFile = loadProjectFromFile;
window.makehtml = makehtml;
window.initScriptManager = initScriptManager;