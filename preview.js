const makehtmlFunc = () => window.makehtml && window.makehtml();

const container = document.getElementById('previewContainer');
const iframe = document.getElementById('previewIframe');
const toggleBtn = document.getElementById('togglePreview');
const resizeHandle = document.getElementById('resizeHandle');
const closeBtn = document.getElementById('closePreview');
const runBtn = document.getElementById('Run');

const HEADER_H = 40;
const MIN_W = 320;
const MIN_H = 180;
const TOOLBAR_H = 50;

let collapsed = false;
let dragging = false;
let resizing = false;
let startX, startY, startLeft, startTop, startWidth, startHeight;

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function updateContent() {
    if (!iframe || collapsed || container.style.display === 'none') return;

    try {
        let html = makehtmlFunc();
        if (!html) {
            iframe.srcdoc = '<body style="background:#f0f0f0;display:flex;align-items:center;justify-content:center;"><div>No code</div></body>';
            return;
        }

        const alertScript = `<script>
            const oa=window.alert;
            window.alert=function(m){
                if(window.__inPreview){
                    const d=document.createElement('div');
                    d.style='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;';
                    const c=document.createElement('div');
                    c.style='background:white;padding:20px;border-radius:8px;max-width:400px;width:90%;text-align:center;';
                    const t=document.createElement('div');
                    t.textContent=m;
                    t.style.marginBottom="15px";
                    const b=document.createElement('button');
                    b.textContent='OK';
                    b.style='background:#4C97FF;color:white;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;';
                    b.onclick=()=>d.remove();
                    c.appendChild(t);
                    c.appendChild(b);
                    d.appendChild(c);
                    document.body.appendChild(d);
                    b.focus();
                    return;
                }
                if(oa)oa(m);
            };
            window.__inPreview=true;
        <\/script>`;

        if (/<body.*?>/i.test(html)) {
            html = html.replace(/<body.*?>/i, match => match + alertScript);
        } else {
            html += alertScript;
        }

        iframe.srcdoc = html;
    } catch {
        iframe.srcdoc = '<body style="background:#f0f0f0;color:#d00;display:flex;align-items:center;justify-content:center;"><div>Error</div></body>';
    }
}

function openPreview() {
    if (!container) return;
    
    container.style.display = 'flex';
    container.classList.remove('preview-collapsed');
    collapsed = false;
    
    bringToFront(container);
    
    if (toggleBtn) toggleBtn.textContent = '▼';
    
    const savedSize = localStorage.getItem('EasyScript_PreviewSize');
    if (savedSize) {
        try {
            const { width, height } = JSON.parse(savedSize);
            container.style.width = clamp(width, MIN_W, window.innerWidth - 20) + 'px';
            container.style.height = clamp(height, MIN_H, window.innerHeight - TOOLBAR_H - 20) + 'px';
        } catch {}
    } else {
        container.style.width = '480px';
        container.style.height = '270px';
    }
    
    const savedPos = localStorage.getItem('EasyScript_PreviewPosition');
    if (savedPos) {
        try {
            const { left, top } = JSON.parse(savedPos);
            container.style.left = clamp(left, 10, window.innerWidth - MIN_W - 10) + 'px';
            container.style.top = clamp(top, TOOLBAR_H + 10, window.innerHeight - MIN_H - 10) + 'px';
        } catch {}
    } else {
        container.style.left = '50px';
        container.style.top = (TOOLBAR_H + 20) + 'px';
    }
    
    if (iframe) {
        iframe.style.display = 'block';
        updateContent();
    }
    
    if (resizeHandle) resizeHandle.style.display = 'block';
}

function togglePreview() {
    if (!container) return;
    
    if (collapsed) {
        container.classList.remove('preview-collapsed');
        container.style.height = startHeight + 'px' || '270px';
        if (iframe) iframe.style.display = 'block';
        if (resizeHandle) resizeHandle.style.display = 'block';
        if (toggleBtn) toggleBtn.textContent = '▼';
        collapsed = false;
        updateContent();
    } else {
        startHeight = container.offsetHeight;
        container.classList.add('preview-collapsed');
        container.style.height = HEADER_H + 'px';
        if (iframe) iframe.style.display = 'none';
        if (resizeHandle) resizeHandle.style.display = 'none';
        if (toggleBtn) toggleBtn.textContent = '▲';
        collapsed = true;
    }
}

function initEvents() {
    if (!container) return;
    
    const header = container.querySelector('.preview-header');
    
    if (header) {
        header.addEventListener('pointerdown', e => {
            if (e.target.tagName === 'BUTTON') return;
            if (collapsed) return;
            
            bringToFront(container);
            dragging = true;
            
            startX = e.clientX;
            startY = e.clientY;
            startLeft = container.offsetLeft;
            startTop = container.offsetTop;
            
            header.setPointerCapture(e.pointerId);
            document.body.style.userSelect = 'none';
            
            const handleMove = ev => {
                if (!dragging) return;
                
                let nx = startLeft + ev.clientX - startX;
                let ny = startTop + ev.clientY - startY;
                
                nx = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, nx));
                ny = Math.max(50, Math.min(window.innerHeight - container.offsetHeight, ny));
                
                container.style.left = nx + 'px';
                container.style.top = ny + 'px';
            };
            
            const handleUp = () => {
                dragging = false;
                document.body.style.userSelect = 'auto';
                
                localStorage.setItem('EasyScript_PreviewPosition', JSON.stringify({
                    left: container.offsetLeft,
                    top: container.offsetTop
                }));
                
                document.removeEventListener('pointermove', handleMove);
                document.removeEventListener('pointerup', handleUp);
            };
            
            document.addEventListener('pointermove', handleMove);
            document.addEventListener('pointerup', handleUp);
        });
    }
    
    if (resizeHandle) {
        resizeHandle.addEventListener('pointerdown', e => {
            if (collapsed) return;
            
            bringToFront(container);
            resizing = true;
            
            startX = e.clientX;
            startY = e.clientY;
            startWidth = container.offsetWidth;
            startHeight = container.offsetHeight;
            startLeft = container.offsetLeft;
            
            resizeHandle.setPointerCapture(e.pointerId);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'se-resize';
            
            const handleMove = ev => {
                if (!resizing) return;
                
                const deltaX = ev.clientX - startX;
                const deltaY = ev.clientY - startY;
                
                const newWidth = Math.max(MIN_W, startWidth + deltaX);
                const newHeight = Math.max(MIN_H, startHeight + deltaY);
                
                container.style.width = `${newWidth}px`;
                container.style.height = `${newHeight}px`;
                
                if (iframe) {
                    iframe.style.height = (newHeight - HEADER_H) + 'px';
                }
            };
            
            const handleUp = () => {
                if (!resizing) return;
                
                resizing = false;
                document.body.style.userSelect = 'auto';
                document.body.style.cursor = '';
                
                localStorage.setItem('EasyScript_PreviewSize', JSON.stringify({
                    width: container.offsetWidth,
                    height: container.offsetHeight
                }));
                
                document.removeEventListener('pointermove', handleMove);
                document.removeEventListener('pointerup', handleUp);
            };
            
            document.addEventListener('pointermove', handleMove);
            document.addEventListener('pointerup', handleUp);
        });
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePreview);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });
    }
    
    if (runBtn) {
        runBtn.addEventListener('click', e => {
            e.preventDefault();
            openPreview();
        });
    }
}

function initPreview() {
    if (!container || !iframe) return;
    
    initEvents();

    const savedSize = localStorage.getItem('EasyScript_PreviewSize');
    if (savedSize && !container.classList.contains('preview-collapsed')) {
        try {
            const size = JSON.parse(savedSize);
            container.style.width = `${Math.max(MIN_W, size.width)}px`;
            container.style.height = `${Math.max(MIN_H, size.height)}px`;
        } catch {}
    }
    
    const savedPos = localStorage.getItem('EasyScript_PreviewPosition');
    if (savedPos) {
        try {
            const pos = JSON.parse(savedPos);
            container.style.left = `${Math.max(10, pos.left)}px`;
            container.style.top = `${Math.max(TOOLBAR_H + 10, pos.top)}px`;
        } catch {}
    }
}

window.initPreview = initPreview;
window.openPreview = openPreview;
window.updatePreview = updateContent;