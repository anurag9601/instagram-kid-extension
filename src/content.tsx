import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ContentScript from "./contentScript/ContentScript";

const root = document.createElement("div");
root.id = "__INSTAGRAM_KID_EXTENSION_DIV__";
root.style.position = "fixed";
root.style.top = "5px";
root.style.left = "50%";
root.style.width = "100%";
root.style.zIndex = "999999";
root.style.transform = "translate(-50%)";
document.body.append(root);

chrome.runtime.onMessage.addListener((message) => {
  chrome.storage.sync.get(["reelOptionVisible"], (response) => {
    const reelsDiv: any = document.querySelector('a[href="/reels/"]');
    const exploreDiv: any = document.querySelector('a[href="/explore/"]');

    if (response.reelOptionVisible === true) {
      if (reelsDiv) {
        reelsDiv.style.display = "none";
      }
      if (exploreDiv) {
        exploreDiv.style.display = "none";
      }
      if (message.url && message.url.includes("reels")) {
        window.location.href = "https://www.instagram.com";
      }
    }
  });
});

createRoot(root).render(
  <StrictMode>
    <ContentScript />
  </StrictMode>
);
