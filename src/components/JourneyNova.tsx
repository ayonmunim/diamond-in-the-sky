import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { NovaSprite } from "./NovaSprite";

export function JourneyNova() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  if (path === "/" || /^\/missions\/[^/]+\/[^/]+/.test(path)) return null;
  const text = path.includes("settings")
    ? "Use the sound and caption controls to make our adventure comfortable for you."
    : path.includes("missions")
      ? "Choose your chapter, mission, and unlocked level. Watch the story, then explore with me!"
      : path.includes("learn")
        ? "Choose a lesson. Watch and listen, then bring your discoveries into our missions."
        : "I'm Nova from Team Dimonds. Explore, learn, and collect discoveries at your own pace!";
  return (
    <div className="journey-nova">
      {open && <p role="status">{text}</p>}
      <button
        aria-label="Ask Nova for guidance"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <NovaSprite />
      </button>
    </div>
  );
}
