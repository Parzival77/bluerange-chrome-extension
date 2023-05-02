var urls = [];
var isBlueRange = false;
var isDevMode = false;
var servers = [
    { key: 'local', url: 'https://localhost:4200' },
    { key: 'alpha', url: 'https://alpha.bluerange.io' },
    { key: 'beta', url: 'https://beta.bluerange.io' }
]

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    isBlueRange = !!tabs[0].url.match(/https:\/\/.*\.bluerange/g)

    if (isBlueRange === true) {
        document.getElementById('no-blueRange').remove()
        servers.forEach((server, index) => {
            urls[index] = tabs[0].url.replaceAll(/https:\/\/.*\.bluerange\.io/g, server.url);
            document.getElementById(server.key).setAttribute('href', urls[index]);
        })
    } else {
        document.getElementById('main-content').remove()
    }
});

document.addEventListener('DOMContentLoaded', function () {
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


// =============== DEVELOPMENT MODE ===============