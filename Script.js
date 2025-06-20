let folders = JSON.parse(localStorage.getItem("folders")) || [
    { name: "DemoFolder", icon: "ri-folder-2-fill", children: [] }
];
let files = JSON.parse(localStorage.getItem("files"));


function updateTaskbarClock() {
    const now = new Date();
    let hours = now.getHours();
    let seconds = now.getSeconds()
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;
    const dateStr = now.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });


    document.getElementById('taskbar-time').textContent = timeStr;
    document.getElementById('taskbar-date').textContent = dateStr;
}

setInterval(updateTaskbarClock, 1000);
updateTaskbarClock();



function startMenuShow() {
    const startMenu = document.getElementById('startmenu');
    startMenu.classList.toggle('show');
}

document.addEventListener('keydown', function (e) {

    if (e.key === 'Meta') {
        startMenuShow();
    }
});




function MiniMizeWindow() {
    const thisPc = document.querySelector(".ThisPc");
    thisPc.classList.toggle('show');


}
const explorerWindow = document.querySelector('.explorer-window');
const contextMenu = document.getElementById('explorerContextMenu');

explorerWindow.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    if (explorerWindow.classList.length <= 1) {
        FullSizeScreen()
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    } else {
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
    }
});

window.addEventListener('click', function () {
    contextMenu.style.display = 'none';
});


function FullSizeScreen() {
    const thisPc = document.querySelector(".ThisPc");
    const explorerWindow = document.querySelector(".explorer-window")
    thisPc.classList.toggle('positionChange');
    explorerWindow.classList.toggle('fullscreen');
}


function CreateNewFolder() {
    const folderName = prompt("Enter new folder name:");
    if (folderName && folderName.trim() !== "") {
        folders.push({ name: folderName, icon: "ri-folder-2-fill" });
        renderFolders();
        localStorage.setItem("folders", JSON.stringify(folders));
    }
}

function renderFolders(folders, files) {
    const explorerFolders = document.querySelector(".explorer-folders");
    let data = '';

    if (folders) {
        data += folders.map((folder, i) =>
            `<div class="folder"  onclick="openItem('folder',${i})" key="${i}">
                <i class="${folder.icon}"></i> ${folder.name}
            </div>`
        ).join('');
    }

    if (files) {
        data += files.map((file, i) =>
            `<div class="file" key="${i}"  onclick="openItem('file',${i})">
                <img src="${file.imgIcon}" alt="file" style="width:90px;height:80px;display:block;margin:auto;"> ${file.name}
            </div>`
        ).join('');
    }
    explorerFolders.innerHTML = data;
}

function createNewfiles(id = null) {
    if (id == null) {
        let filesName = prompt("Enter new File name:");
        if (filesName && filesName.trim() !== "") {
            filesName = filesName.trim();
            if (!filesName.includes('.')) {
                filesName += '.txt';
            }
            files.push({ name: filesName, imgIcon: "./images/icons8-file.svg" });
            localStorage.setItem("files", JSON.stringify(files));
            renderFolders(folders, files);
        }
    }
}

// function deletefolders(data, id) {
//     if (data == "folder") {
//         folders.splice(id, 1);
//         localStorage.setItem("folders", JSON.stringify(folders));
//         renderFolders(folders, files);
//     } else if (data == "files") {
//         files.splice(id, 1);
//         localStorage.setItem("files", JSON.stringify(files));
//         renderFolders(folders, files);
//     }
// }
renderFolders(folders, files)


function openItem(type, index) {
    let content = '';
    let title = '';
    if (type === 'folder') {
        const folder = folders[index];
        title = folder.name;
        if (folder.children && folder.children.length > 0) {
            content = folder.children.map(child =>
                child.icon
                    ? `<div class="folder"><i class="${child.icon}"></i> ${child.name}</div>`
                    : `<div class="file"><img src="${child.imgIcon}" alt="file" style="width:60px;height:50px;display:block;margin:auto;"> ${child.name}</div>`
            ).join('');
        } else {
            content = `<div style="color:#aaa;text-align:center;padding:40px;">Empty</div>`;
        }
        // Open folder window
        const win = document.createElement('div');
        win.className = 'explorer-window child-window';
        win.style.position = 'fixed';
        win.style.top = '120px';
        win.style.left = '120px';
        win.style.width = '400px';
        win.style.zIndex = 4000;
        win.innerHTML = `
            <div class="explorer-titlebar">
                <span class="explorer-title"><i class="ri-folder-2-fill"></i> ${title}</span>
                <div class="explorer-controls">
                    <button class="explorer-btn close" title="Close" onclick="this.parentElement.parentElement.parentElement.remove()"><i class="ri-close-line"></i></button>
                </div>
            </div>
            <div class="explorer-content" style="height:200px;overflow:auto;">
                <div class="explorer-folders">${content}</div>
            </div>
        `;
        document.body.appendChild(win);
    } else if (type === 'file') {
        const file = files[index];
        openNotepadModal(file);
    }
}

// Helper function to open a notepad-like modal for files
function openNotepadModal(file) {
    // Remove any existing notepad modal
    const existing = document.getElementById('notepad-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'notepad-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.width = '420px';
    modal.style.background = '#23272e';
    modal.style.color = '#fff';
    modal.style.borderRadius = '10px';
    modal.style.boxShadow = '0 8px 32px rgba(0,0,0,0.28)';
    modal.style.zIndex = 5000;
    modal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 18px;background:#1a1d22;border-radius:10px 10px 0 0;">
            <span><i class="ri-file-text-line"></i> ${file.name}</span>
            <button onclick="document.getElementById('notepad-modal').remove()" style="background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;"><i class="ri-close-line"></i></button>
        </div>
        <textarea style="width:95%;height:220px;margin:15px 2.5%;background:#181b20;color:#fff;border:none;border-radius:6px;padding:10px;font-size:1rem;resize:vertical;">${file.content || ''}</textarea>
    `;
    document.body.appendChild(modal);
}