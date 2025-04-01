import { GoogleGenAI } from "@google/genai";
import React from "react";
import styles from "./ContentScript.module.css";

interface JSONDataType {
  adult_content: boolean;
  age_limit: string;
  children_watch: boolean;
}

const ContentScript = () => {
  const isInProcess = React.useRef<boolean>(false);

  const [anaylsisWindowOpen, setAnalysisWindowOpen] =
    React.useState<boolean>(false);

  const [currentJSON, setCurrentJSON] = React.useState<JSONDataType | null>(
    null
  );

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
  });

  async function getRealJSON(response: string) {
    const cleanedResponse = response
      .trim()
      .replace("```json", "")
      .replace("```", "");

    const realJSON = await JSON.parse(cleanedResponse);

    return realJSON;
  }

  async function scanReelURL(url: string) {
    if (isInProcess.current) {
      console.log("A request is already in process. Ignoring new requests...");
      return;
    }

    isInProcess.current = true;

    setCurrentJSON(null);

    const PROMPT = `You are an Instagram Reel Recognition AI Agent that analyzes reels using their URLs to determine if the content is adult-oriented, whether children can watch it, and the minimum recommended age for viewers find this all information from that video by searching the written text in that also the voice of it and the content. Your response must be strictly in JSON format without any extra text. Example response: 
    { 
        "adult_content": true,
        "children_watch": false, 
        "age_limit": "16+" 
    }
    Current reel url: ${url}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: PROMPT,
      });

      if (response.text) {
        const realJSON = await getRealJSON(response.text);
        setCurrentJSON(realJSON);
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }

    isInProcess.current = false;
  }

  chrome.runtime.onMessage.addListener(async (message) => {
    if (message.url.includes("reels")) {
      setAnalysisWindowOpen(true);
    } else {
      setAnalysisWindowOpen(false);
    }
    if (message.url && anaylsisWindowOpen) {
      await scanReelURL(message.url);
    }
  });

  return (
    <div className={styles.contentContainer}>
      {anaylsisWindowOpen && (
        <ul className={styles.externalContentAnalysisBar}>
          <li>
            <span>Adult content:</span>
            {currentJSON !== null && `${currentJSON?.adult_content}`}
          </li>
          <li>
            <span>Children watch:</span>
            {currentJSON !== null && `${currentJSON?.children_watch}`}
          </li>
          <li>
            <span>Age limit:</span>
            {currentJSON !== null && `${currentJSON?.age_limit}`}
          </li>
        </ul>
      )}
    </div>
  );
};

export default ContentScript;
