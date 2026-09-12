import { useState, useEffect } from "react";

const SESSION_SCRIPT = [
  { type: "cmd", text: "credentials unlock --biometric" },
  { type: "out", text: "✓ identity verified · 0.31s", tone: "ok", delay: 500 },
  { type: "cmd", text: "credentials fetch github.com" },
  { type: "out", text: "· decrypting ·········· done", tone: "dim", delay: 420 },
  { type: "out", text: "→ autofilled as Cr@Credentials.io", tone: "ok", delay: 320 },
  { type: "cmd", text: "credentials audit --breaches" },
  { type: "out", text: "✓ 0 credentials found in known breaches", tone: "ok", delay: 520 },
  { type: "out", text: "✓ vault sealed · 47 secrets protected", tone: "dim", delay: 340 },
];

export function useTypedSession() {
  const [lines, setLines] = useState([]);
  const [typingText, setTypingText] = useState("");

  useEffect(() => {
    let alive = true;
    const timers = [];
    const wait = (ms) =>
      new Promise((res) => {
        timers.push(setTimeout(res, ms));
      });

    (async () => {
      while (alive) {
        setLines([]);
        setTypingText("");
        await wait(700);
        for (const item of SESSION_SCRIPT) {
          if (!alive) return;
          if (item.type === "cmd") {
            for (let idx = 1; idx <= item.text.length; idx++) {
              if (!alive) return;
              setTypingText(item.text.slice(0, idx));
              await wait(26);
            }
            await wait(220);
            if (!alive) return;
            setLines((prev) => [...prev, item]);
            setTypingText("");
          } else {
            await wait(item.delay || 320);
            if (!alive) return;
            setLines((prev) => [...prev, item]);
          }
        }
        await wait(2800);
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return { lines, typingText };
}