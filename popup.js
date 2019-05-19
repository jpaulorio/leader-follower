var toggleReplacement = document.getElementById('toggleReplacement');
var currentDomain = "";
var domainsToExclude = [];

chrome.storage.sync.get('domainsToExclude', function (data) {
    if (data.domainsToExclude) {
        domainsToExclude = data.domainsToExclude;
    }

    toggleReplacement.checked = (domainsToExclude.indexOf(currentDomain) === -1);

    console.log("loaded domains to exlude: " + domainsToExclude);
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url)
    currentDomain = url.hostname
});

toggleReplacement.onclick = function (element) {
    let checked = element.target.checked;
    console.log("checked: " + checked);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { enabled: checked });
    });
    if (checked) {
        var index = domainsToExclude.indexOf(currentDomain);
        if (index > -1) {
            domainsToExclude.splice(index, 1);
        }
    } else {
        domainsToExclude.push(currentDomain);
    }

    chrome.storage.sync.set({ "domainsToExclude": domainsToExclude }, function () {
        console.log("domains to exclude: " + domainsToExclude);
        console.log("current domain: " + currentDomain);
    });
};