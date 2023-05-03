var urls = [];
const servers = [
    { key: 'local', url: 'https://localhost:4200' },
    { key: 'alpha', url: 'https://alpha.bluerange.io' },
    { key: 'beta', url: 'https://beta.bluerange.io' }
]

chrome.tabs.query({ active: true, lastFocusedWindow: true }, async tabs => {
    const tab = tabs[0]

    if (!!tab.url.match(/https:\/\/.*\.bluerange/g)) {
        document.getElementById('no-blueRange').remove();

        // LINK THIS PAGE
        servers.forEach((server, index) => {
            urls[index] = tabs[0].url.replaceAll(/https:\/\/.*\.bluerange\.io/g, server.url);
            document.getElementById(server.key).setAttribute('href', urls[index]);
        })

        // DEV MODE
        const response = await chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            func: readLocalStorage,
            args: ['devMode'],
        })

        const isDevMode = response[0]?.result === 'true'
        document.getElementById('toggleswitch').checked = isDevMode
        document.getElementById('toggleswitch').addEventListener('change', async () => {
            const response = await chrome.scripting.executeScript({
                target: { tabId: tab.id, allFrames: true },
                func: writeLocalStorage,
                args: ['devMode', !isDevMode],
            })
            chrome.tabs.reload();
        });
    } else {
        document.getElementById('main-content').remove()
    }
});

document.addEventListener('DOMContentLoaded', () => {
    servers.forEach((server, index) => {
        document.getElementById('copy-' + server.key)?.addEventListener('click', () => copyUrl(index));
    })

    servers.forEach((server, index) => {
        document.getElementById('markdown-' + server.key)?.addEventListener('click', () => copyMarkDown(index));
    })
});

function copyUrl(index) {
    navigator.clipboard.writeText(this.urls[index]).then(_ => window.close())
}

function copyMarkDown(index) {
    navigator.clipboard.writeText(`[BlueRange-Portal](${ this.urls[index] })`).then(_ => window.close())
}

function readLocalStorage(key) {
    return localStorage.getItem(key)
}

function writeLocalStorage(key, value) {
    return localStorage.setItem(key, value)
}