const CrossTabCopyPaste = window.CrossTabCopyPaste;
const KeyboardNavigation = window.KeyboardNavigation;
const WorkspaceSearch = window.WorkspaceSearch;
const ZoomToFitControl = window.ZoomToFitControl;
const PositionedMinimap = window.PositionedMinimap;
const DarkTheme = window.DarkTheme;
const ModernTheme = window.ModernTheme;
const DefaultTheme = window.DefaultTheme;
const toolbox = window.toolbox;
window.EasyScriptTopZ = 1000;
window.bringToFront = (el) => el && (el.style.zIndex = ++window.EasyScriptTopZ);

if (KeyboardNavigation && typeof KeyboardNavigation.registerKeyboardNavigationStyles === 'function') {
    try { KeyboardNavigation.registerKeyboardNavigationStyles(); } catch {}
}

const themes = { Modern: ModernTheme, Default: DefaultTheme, Dark: DarkTheme };

const workspace = Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    trashcan: true,
    scrollbars: true,
    theme: DefaultTheme,
    zoom: { controls: false, wheel: true, startScale: 1, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
    grid: { spacing: 40, length: 3, colour: '#ccc', snap: true },
    renderer: 'thrasos',
});

workspace.addChangeListener((e) => {
    if (e.type === Blockly.Events.VIEWPORT_CHANGE) {
        setTimeout(() => { try { workspace.resize(); } catch {} }, 100);
    }
});

try { if (WorkspaceSearch) new WorkspaceSearch(workspace).init(); } catch {}
try { if (ZoomToFitControl) new ZoomToFitControl(workspace).init(); } catch {}
try { if (PositionedMinimap) new PositionedMinimap(workspace).init(); } catch {}

try { if (CrossTabCopyPaste) new CrossTabCopyPaste().init({ contextMenu: true, shortcut: true }, () => {}); } catch {}
try { if (KeyboardNavigation) new KeyboardNavigation(workspace, { allowCrossWorkspacePaste: true }); } catch {}

if (window.initScriptManager) initScriptManager(workspace);
if (window.initProjectsManager) initProjectsManager(workspace);
if (window.initPreview) initPreview();

document.getElementById('Build').addEventListener('click', () => {
    const name = document.getElementById('projectName').value || 'project';
    const html = makehtml(true);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '.html';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('Save').addEventListener('click', () => {
    if (window.saveProjectToFile) saveProjectToFile();
});
document.getElementById('Load').addEventListener('click', () => document.getElementById('ImportFile').click());

document.getElementById('ImportFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && window.loadProjectFromFile) loadProjectFromFile(file);
});

document.getElementById('themeSelect').addEventListener('change', (e) => {
    const theme = themes[e.target.value];
    if (theme) {
        workspace.setTheme(theme);
        localStorage.setItem('blocklyTheme', e.target.value);
    }
});

document.getElementById('Share').onclick = () => {
    const url = `data:text/html;base64,${btoa(unescape(encodeURIComponent(makehtml(true))))}`;
    const copy = (text) => navigator.clipboard?.writeText?.(text) || new Promise(resolve => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
    });
    
    copy(url).then(() => alert("Link copied 📋\n\nThis link opens your project anywhere,\neven offline, without any server."));
};

const savedTheme = localStorage.getItem('blocklyTheme');
if (!savedTheme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? 'Dark' : 'Default';
    workspace.setTheme(themes[defaultTheme]);
    localStorage.setItem('blocklyTheme', defaultTheme);
    document.getElementById('themeSelect').value = defaultTheme;
} else if (themes[savedTheme]) {
    workspace.setTheme(themes[savedTheme]);
    document.getElementById('themeSelect').value = savedTheme;
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'r' && confirm('Reset all panel positions and sizes?')) {
        ['EasyScript_ScriptsPanelSize', 'EasyScript_ProjectsPanelSize', 'EasyScript_PreviewSize', 'EasyScript_PreviewPosition']
            .forEach(key => localStorage.removeItem(key));
        location.reload();
    }
});

function initMobileWarning() {
    const msg = document.getElementById('mobile-portrait-message');
    if (!msg) return;
    
    function checkMobilePortrait() {
        const isMobile = window.innerWidth <= 768;
        const isPortrait = window.innerHeight > window.innerWidth;
        
        if (isMobile && isPortrait) {
            msg.style.display = 'flex';
        } else {
            msg.style.display = 'none';
        }
    }
    
    const continueBtn = document.getElementById('continueAnyway');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            msg.style.display = 'none';
        });
    }
    
    msg.addEventListener('click', (e) => {
        if (e.target === msg) {
            msg.style.display = 'none';
        }
    });
    
    checkMobilePortrait();
    
    window.addEventListener('resize', checkMobilePortrait);
    window.addEventListener('orientationchange', () => {
        setTimeout(checkMobilePortrait, 100);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initMobileWarning, 100);
});

window.addEventListener('load', initMobileWarning);