function sendUrlToActiveTab(url: string, tabId: number) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0]?.id, { url: url, tabId: tabId }, () => {
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
        if (tab.url && tab.id) {
            sendUrlToActiveTab(tab.url, tab.id);
        }
    })
});

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url && details.tabId) {
        sendUrlToActiveTab(details.url, details.tabId)
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.url && details.tabId) {
        sendUrlToActiveTab(details.url, details.tabId);
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "reloadTab" && message.tabId) {
        chrome.tabs.reload(message.tabId);
    }
});