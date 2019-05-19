chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ "domainsToExclude": [] }, function () {
        console.log("Domain to exclude list is empty.");
    });
});