function sendUrlToActiveTab(url: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0]?.id, { url: url }, () => {
                if (chrome.runtime.lastError) {
                    console.log(
                        "Content script not available yet:",
                        chrome.runtime.lastError
                    );
                }
            });
        }
    });
}

chrome.tabs.onActivated.addListener((activeTab) => {
    chrome.tabs.get(activeTab.tabId, (tab) => {
        if (tab.url) {
            sendUrlToActiveTab(tab.url);
        }
    })
});

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url) {
        sendUrlToActiveTab(details.url)
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.url) {
        sendUrlToActiveTab(details.url);
    }
})