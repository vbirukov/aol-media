import type { AppSkin } from "@vbonline/player";
import {
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

export function AppearanceToggle({ skin, onSkinChange, className }: Props) {
  const current = skin ?? readStoredAolSkin();
  const dark = isAolDarkSkin(current);

  const handleToggle = () => {
    const next = toggleAolSkin(current);
    if (onSkinChange) {
      onSkinChange(next);
      return;
    }
    applyAolDocumentTheme(next);
    persistAolSkin(next);
  };

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
