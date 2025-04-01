// import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
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

  const [requestReels, setRequestReels] = React.useState<
    { [key: string]: JSONDataType }[]
  >([]);

  const ageLimitRef = React.useRef<number>(0);

  // const ai = new GoogleGenAI({
  //   apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
  // });

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
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

    const requestAlreadyDone = requestReels.find((obj) =>
      obj.hasOwnProperty(url)
    );

    isInProcess.current = true;

    if (requestAlreadyDone) {
      setCurrentJSON(null);

      setCurrentJSON(requestAlreadyDone[url]);
    } else {
      const PROMPT = `You are an Instagram Reel Recognition AI Agent that analyzes reels using their URLs to determine if the content is adult-oriented, whether children can watch it, and the minimum recommended age for viewers. 
      
      Your response must be strictly in JSON format without any extra text. Example response: 
      { 
          "adult_content": true,
          "children_watch": false, 
          "age_limit": "16+" 
      }
      Current reel url: ${url}`;

      try {
        // const response = await ai.models.generateContent({
        //   model: "gemini-2.0-flash",
        //   contents: PROMPT,
        // });

        const response = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: PROMPT,
            },
          ],
          model: "llama-3.3-70b-versatile",
        });

        if (response.choices[0]?.message?.content) {
          const realJSON = await getRealJSON(
            response.choices[0]?.message?.content
          );

          setRequestReels((prev) => [...prev, { url: realJSON }]);

          if (/\d/.test(realJSON.age_limit) && ageLimitRef.current > 0) {
            try {
              const reelAgeLimit = parseInt(realJSON.age_limit.split("+")[0]);

              if (reelAgeLimit > ageLimitRef.current) {
                const observer = new MutationObserver(() => {
                  const reelVideos = document.querySelector("video");
                  if (reelVideos) {
                    reelVideos.style.display = "none";
                  }
                });
                observer.observe(document.body, {
                  childList: true,
                  subtree: true,
                });
              }
            } catch (err) {
              console.error("Something went wrong", err);
            }
          }
          setCurrentJSON(realJSON);
        }

        // if (response.text) {
        //   const realJSON = await getRealJSON(response.text);

        //   console.log(realJSON);

        //   setRequestReels((prev) => [...prev, { url: realJSON }]);

        //   if (/\d/.test(realJSON.age_limit) && ageLimitRef.current > 0) {
        //     try {
        //       const reelAgeLimit = parseInt(realJSON.age_limit.split("+")[0]);

        //       if (reelAgeLimit > ageLimitRef.current) {
        //         const h1 = document.createAttribute("h1");
        //         h1.textContent = "This content is not for you";
        //         document.body.append(h1);
        //       } else {
        //         document.body.removeAttribute("h1");
        //       }
        //     } catch (err) {
        //       console.error("Something went wrong", err);
        //     }
        //   }
        //   setCurrentJSON(realJSON);
        // }
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    }

    isInProcess.current = false;
  }

  chrome.runtime.onMessage.addListener(async (message) => {
    setAnalysisWindowOpen(() => message.url && message.url.includes("reels"));
    if (message.url) {
      const timeOut = setTimeout(async () => {
        await scanReelURL(message.url);
        clearTimeout(timeOut);
      }, 500);
    }
  });

  React.useLayoutEffect(() => {
    chrome.storage.sync.get(["ageLimit"], (response) => {
      if (response.ageLimit) {
        ageLimitRef.current = response.ageLimit;
      }
    });
  }, []);

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
