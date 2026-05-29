import type { PlayerHeaderSlotProps } from "@vbonline/player";
import { navigateToWelcome } from "../lib/appRoute";
import { AppearanceToggle } from "./AppearanceToggle";
import { BrandLogo } from "./BrandLogo";

export function AppHeader({
  onOpenNav,
  installPrompt,
  onInstall,
  showIosInstallHint,
  onDismissIosHint,
  skin,
  onSkinChange,
}: PlayerHeaderSlotProps) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-button round ghost menu-toggle"
        onClick={onOpenNav}
        aria-label="Открыть меню"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
          />
        </svg>
      </button>
      <button
        type="button"
        className="aol-topbar-logo"
        onClick={navigateToWelcome}
        aria-label="На главную"
      >
        <BrandLogo skin={skin} />
      </button>
      <div className="toolbar topbar-toolbar">
        <AppearanceToggle skin={skin} onSkinChange={onSkinChange} />
        {installPrompt ? (
          <button type="button" className="ghost aol-install-btn" onClick={onInstall}>
            Установить
          </button>
        ) : null}
        {showIosInstallHint ? (
          <button
            type="button"
            className="ghost"
            onClick={onDismissIosHint}
            title="Закрыть подсказку"
          >
            iOS: Поделиться → На экран «Домой»
          </button>
        ) : null}
      </div>
    </header>
  );
}
