import { useEffect, useRef } from "react";
import type { MediaKind } from "@vbonline/player";
import { clearHubIntent } from "../lib/appRoute";

const KIND_LABEL: Record<MediaKind, string> = {
  audio: "Аудио",
  video: "Видео",
  text: "Текст",
};

function applyMediaKindFilter(kind: MediaKind): boolean {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    ".media-kind-filter__btn",
  );
  for (const btn of buttons) {
    if (btn.textContent?.includes(KIND_LABEL[kind])) {
      if (!btn.classList.contains("is-active")) btn.click();
      return true;
    }
  }
  return false;
}

export function HubEntrySync() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const params = new URLSearchParams(window.location.search);
    const kind = params.get("kind") as MediaKind | null;
    if (!kind || (kind !== "audio" && kind !== "video" && kind !== "text")) {
      return;
    }

    let attempts = 0;
    const id = window.setInterval(() => {
      attempts += 1;
      if (applyMediaKindFilter(kind)) {
        done.current = true;
        window.clearInterval(id);
        params.delete("kind");
        const qs = params.toString();
        window.history.replaceState(
          null,
          "",
          qs
            ? `${window.location.pathname}?${qs}${window.location.hash}`
            : `${window.location.pathname}${window.location.hash}`,
        );
        clearHubIntent();
      } else if (attempts > 40) {
        window.clearInterval(id);
      }
    }, 150);

    return () => window.clearInterval(id);
  }, []);

  return null;
}
