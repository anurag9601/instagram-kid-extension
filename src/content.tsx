import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ContentScript from "./contentScript/ContentScript";

const root = document.createElement("div");
root.id = "__INSTAGRAM_KID_EXTENSION_DIV__";
document.body.append(root);

createRoot(root).render(
  <StrictMode>
    <ContentScript />
  </StrictMode>
);
