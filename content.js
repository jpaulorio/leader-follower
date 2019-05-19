var domainsToExclude = [];
var currentDomain = window.location.hostname;

chrome.storage.sync.get('domainsToExclude', function (data) {
    if (data.domainsToExclude) {
        domainsToExclude = data.domainsToExclude;
    }

    if (domainsToExclude.indexOf(currentDomain) === -1) {
        doReplace();
    }

    console.log("domains to exclude: " + domainsToExclude);
    console.log("current domain: " + currentDomain);
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("enabled: " + request.enabled);
        if (request.enabled) {
            console.log("do replace");
            doReplace();
        }
        else {
            console.log("undo replace");
            undoReplace();
        }
    });

function replaceOccurrences(original, replacement) {
    var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var regex = new RegExp(original, "gi");
                var replacedText = text.replace(regex, replacement);

                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
}

function doReplace() {
    replaceOccurrences('master', 'leader');
    replaceOccurrences('slave', 'follower');
}

function undoReplace() {
    replaceOccurrences('leader', 'master');
    replaceOccurrences('follower', 'slave');
}