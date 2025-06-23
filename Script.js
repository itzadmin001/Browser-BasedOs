let zCounter = 10;
let desktopIcons = document.querySelectorAll('.desktop-icon');
let desktop = document.getElementById('desktop');
let explorerCount = 0;

// --- Desktop Icon Drag ---
function updateTaskbarClock() {
    const clock = document.querySelector('#taskbar .clock');
    const date = document.querySelector('#taskbar .date');
    if (clock) clock.textContent = new Date().toLocaleTimeString();
    if (date) date.textContent = new Date().toLocaleDateString();
}
updateTaskbarClock();
setInterval(updateTaskbarClock, 1000);

desktopIcons.forEach(icon => {
    icon.onmousedown = function (e) {
        if (e.button !== 0) return;
        let shiftX = e.clientX - icon.getBoundingClientRect().left;
        let shiftY = e.clientY - icon.getBoundingClientRect().top;
        icon.style.zIndex = ++zCounter;
        function moveAt(pageX, pageY) {
            let dx = Math.max(0, Math.min(pageX - shiftX, desktop.offsetWidth - icon.offsetWidth));
            let dy = Math.max(0, Math.min(pageY - shiftY, desktop.offsetHeight - icon.offsetHeight));
            icon.style.left = dx + 'px';
            icon.style.top = dy + 'px';
        }
        function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };
    icon.ondragstart = () => false;
});

// --- File Explorer Open ---
document.getElementById('fileExplorer').ondblclick = () => openExplorerWindow('Desktop');

// --- File Explorer Window Logic ---
const folderIcons = {
    'Desktop': 'images/icons8-monitor-40.png',
    'Downloads': 'images/icons8-download-40.png',
    'Images': 'images/icons8-image-40.png',
    'Videos': 'images/icons8-movies-folder-40.png',
    'C Drive': 'images/icons8-c-drive-40.png',
    'New Drive': 'images/icons8-usb-memory-stick-40.png',
    'New Folder': 'images/icons8-folder.svg',
    'My PC': 'images/icons8-monitor-40.png',
    'Text File': 'images/icons8-file.svg'
};
const folderStructure = {
    'Desktop': ['New Folder', 'Text File'],
    'Downloads': [],
    'Images': [],
    'Videos': [],
    'C Drive': [],
    'New Drive': [],
    'New Folder': [],
    'My PC': []
};

function openExplorerWindow(currentFolder) {
    explorerCount++;
    let win = document.createElement('div');
    win.className = 'file-explorer-window active';
    win.style.left = (60 + explorerCount * 30) + 'px';
    win.style.top = (60 + explorerCount * 30) + 'px';
    win.style.zIndex = ++zCounter;

    // --- Window Header ---
    win.innerHTML = `
        <div class="window-header">
            <span class="window-title">File Explorer</span>
            <div class="window-controls">
                <button class="min-btn" title="Minimize">_</button>
                <button class="max-btn" title="Maximize">&#9633;</button>
                <button class="close-btn" title="Close">&times;</button>
            </div>
        </div>
        <div class="window-content">
            <div class="window-sidebar"></div>
            <div class="window-main">
                <div class="main-toolbar">
                    <button class="new-btn">New</button>
                </div>
                <div class="file-list"></div>
            </div>
        </div>
    `;
    document.body.appendChild(win);
    setTimeout(() => win.classList.add('active'), 10);
    focusWindow(win)

    // Sidebar
    let sidebar = win.querySelector('.window-sidebar');
    Object.keys(folderStructure).forEach(folder => {
        let div = document.createElement('div');
        div.className = 'sidebar-item' + (folder === currentFolder ? ' active' : '');
        div.innerHTML = `<img src="${folderIcons[folder] || folderIcons['New Folder']}" width="18"> ${folder}`;
        div.onclick = () => {
            openExplorerWindow(folder);
        };
        sidebar.appendChild(div);
    });

    // File List
    function renderFileList() {
        let fileList = win.querySelector('.file-list');
        fileList.innerHTML = '';
        let files = folderStructure[currentFolder] || [];
        files.forEach(file => {
            let fileDiv = document.createElement('div');
            fileDiv.className = 'file-item';
            fileDiv.innerHTML = `<img src="${folderIcons[file] || folderIcons['Text File']}"><span>${file}</span>`;
            fileDiv.ondblclick = () => openExplorerWindow(file);
            fileList.appendChild(fileDiv);
        });
    }
    renderFileList();

    // New Button
    win.querySelector('.new-btn').onclick = () => {
        let name = prompt('Enter file/folder name (add .txt for file):');
        if (!name) return;
        let isFile = name.endsWith('.txt');
        folderStructure[currentFolder].push(name);
        folderIcons[name] = isFile ? 'images/icons8-file.svg' : 'images/icons8-folder.svg';
        renderFileList();
    };

    // Window Controls
    win.querySelector('.min-btn').onclick = () => { win.style.display = 'none'; };
    win.querySelector('.max-btn').onclick = () => {
        if (win.classList.contains('maximized')) {
            win.classList.remove('maximized');
            win.style.left = win.dataset.prevLeft;
            win.style.top = win.dataset.prevTop;
            win.style.width = win.dataset.prevWidth;
            win.style.height = win.dataset.prevHeight;
        } else {
            win.dataset.prevLeft = win.style.left;
            win.dataset.prevTop = win.style.top;
            win.dataset.prevWidth = win.style.width;
            win.dataset.prevHeight = win.style.height;
            win.classList.add('maximized');
            win.style.left = '0px'; win.style.top = '0px';
            win.style.width = '100vw'; win.style.height = 'calc(100vh - 40px)';
        }
    };
    win.querySelector('.close-btn').onclick = () => { clearInterval(clockInterval); win.remove(); };


    // Clock
    let clock = win.querySelector('.clock');
    function updateClock() { if (clock) clock.textContent = new Date().toLocaleTimeString(); }
    updateClock();
    let clockInterval = setInterval(updateClock, 1000);

    // Focus logic
    win.onmousedown = () => focusWindow(win);

    // Drag logic
    let header = win.querySelector('.window-header');
    header.onmousedown = function (e) {
        if (e.button !== 0) return;
        focusWindow(win);
        let shiftX = e.clientX - win.getBoundingClientRect().left;
        let shiftY = e.clientY - win.getBoundingClientRect().top;
        function moveAt(pageX, pageY) {
            win.style.left = (pageX - shiftX) + 'px';
            win.style.top = (pageY - shiftY) + 'px';
        }
        function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };
    header.ondragstart = () => false;

    // Resizer logic
    ['left', 'right', 'top', 'bottom'].forEach(dir => {
        let resizer = document.createElement('div');
        resizer.className = 'resizer ' + dir;
        win.appendChild(resizer);
        resizer.onmousedown = function (e) {
            e.stopPropagation();
            let startX = e.clientX, startY = e.clientY;
            let startW = win.offsetWidth, startH = win.offsetHeight;
            let startL = win.offsetLeft, startT = win.offsetTop;
            function onMove(ev) {
                if (dir === 'right') win.style.width = Math.max(320, startW + (ev.clientX - startX)) + 'px';
                if (dir === 'left') {
                    let newW = Math.max(320, startW - (ev.clientX - startX));
                    win.style.width = newW + 'px';
                    win.style.left = (startL + (ev.clientX - startX)) + 'px';
                }
                if (dir === 'bottom') win.style.height = Math.max(220, startH + (ev.clientY - startY)) + 'px';
                if (dir === 'top') {
                    let newH = Math.max(220, startH - (ev.clientY - startY));
                    win.style.height = newH + 'px';
                    win.style.top = (startT + (ev.clientY - startY)) + 'px';
                }
            }
            function onUp() {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            }
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        };
    });

    // Remove on close (optional: add close button if you want)
    win.onclose = () => { clearInterval(clockInterval); win.remove(); };
}


// --- Focus/Active Window Logic ---
function focusWindow(win) {
    document.querySelectorAll('.file-explorer-window').forEach(w => w.classList.remove('active'));
    win.classList.add('active');
    win.style.zIndex = ++zCounter;
}

// --- Allow open explorer from desktop icons ---
document.getElementById('icon-myPC').ondblclick = () => openExplorerWindow('My PC');
document.getElementById('icon-folder').ondblclick = () => openExplorerWindow('New Folder');
document.getElementById('icon-txt').ondblclick = () => openExplorerWindow('Text File');