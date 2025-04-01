import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ContentScript from "./contentScript/ContentScript";

const root = document.createElement("div");
root.id = "__INSTAGRAM_KID_EXTENSION_DIV__";
root.style.position = "fixed";
root.style.top = "5px";
root.style.left = "50%";
root.style.width = "100%";
root.style.transform = "translate(-50%)";
document.body.append(root);

createRoot(root).render(
  <StrictMode>
    <ContentScript />
  </StrictMode>
);
