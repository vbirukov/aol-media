import { useCallback, useSyncExternalStore } from "react";
import type { AppSkin } from "@vbonline/player";
import {
  AOL_SKIN_DARK,
  AOL_SKIN_LIGHT,
  isAolDarkSkin,
  persistAolSkin,
  readStoredAolSkin,
  toggleAolSkin,
  applyAolDocumentTheme,
} from "../lib/aolTheme";

type Props = {
  skin?: AppSkin;
  onSkinChange?: (skin: AppSkin) => void;
  className?: string;
};

function subscribeTheme(onChange: () => void) {
  const root = document.documentElement;
  const observer = new MutationObserver(onChange);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ["data-skin", "data-theme"],
  });
  return () => observer.disconnect();
}

function readDocumentSkin(): AppSkin {
  const skin = document.documentElement.getAttribute("data-skin");
  if (skin === AOL_SKIN_DARK || skin === AOL_SKIN_LIGHT) return skin;
  return readStoredAolSkin();
}

export function AppearanceToggle({ skin, onSkinChange, className }: Props) {
  const docSkin = useSyncExternalStore(
    subscribeTheme,
    readDocumentSkin,
    () => AOL_SKIN_LIGHT,
  );
  const current = skin ?? docSkin;
  const dark = isAolDarkSkin(current);

  const handleToggle = useCallback(() => {
    const active = skin ?? readDocumentSkin();
    const next = toggleAolSkin(active);
    if (onSkinChange) {
      onSkinChange(next);
      return;
    }
    applyAolDocumentTheme(next);
    persistAolSkin(next);
  }, [onSkinChange, skin]);

  return (
    <button
      type="button"
      className={["aol-appearance-toggle ghost", className]
        .filter(Boolean)
        .join(" ")}
      onClick={handleToggle}
      aria-pressed={dark}
      title={dark ? "Светлая тема" : "Тёмная тема"}
    >
      <span className="aol-appearance-toggle__icon" aria-hidden>
        {dark ? "☀" : "☽"}
      </span>
      <span className="aol-appearance-toggle__label">
        {dark ? "Светлая" : "Тёмная"}
      </span>
    </button>
  );
}
