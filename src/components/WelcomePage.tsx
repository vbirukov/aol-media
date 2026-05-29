import { useEffect, type CSSProperties } from "react";
import { HUB_CATEGORIES } from "../lib/hubCategories";
import { navigateToLibrary } from "../lib/appRoute";
import {
  applyAolDocumentTheme,
  persistAolSkin,
  readStoredAolSkin,
} from "../lib/aolTheme";
import { AppearanceToggle } from "./AppearanceToggle";
import { BrandLogo } from "./BrandLogo";
import { ScriptHeading } from "./ScriptHeading";

export function WelcomePage() {
  useEffect(() => {
    const skin = readStoredAolSkin();
    applyAolDocumentTheme(skin);
    persistAolSkin(skin);
  }, []);

  return (
    <div className="aol-welcome">
      <div className="aol-welcome__ambient" aria-hidden>
        <div className="aol-welcome__orb aol-welcome__orb--1" />
        <div className="aol-welcome__orb aol-welcome__orb--2" />
        <div className="aol-welcome__grain" />
      </div>
      <div className="aol-welcome__inner">
        <header className="aol-welcome__header">
          <div className="aol-welcome__header-row">
            <AppearanceToggle className="aol-welcome__theme" />
          </div>
          <BrandLogo className="aol-welcome__logo" />
          <h1 className="aol-welcome__title-wrap">
            <ScriptHeading>Искусство Жизни</ScriptHeading>
          </h1>
          <p className="aol-welcome__eyebrow">Медиатека</p>
          <p className="aol-welcome__lead">
            Празднование и мудрость — беседы, медитации, тексты, баджаны и
            мантры в одном месте
          </p>
        </header>

        <nav className="aol-welcome__grid" aria-label="Разделы медиатеки">
          {HUB_CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              type="button"
              className="aol-welcome__card"
              style={
                {
                  "--card-accent": cat.accent,
                  "--card-i": i,
                } as CSSProperties
              }
              data-category={cat.id}
              onClick={() => navigateToLibrary(cat)}
            >
              <span className="aol-welcome__card-shell">
                <span className="aol-welcome__card-badge" aria-hidden>
                  {cat.iconUrl ? (
                    <img src={cat.iconUrl} alt="" width={32} height={32} />
                  ) : (
                    cat.badge
                  )}
                </span>
                <span className="aol-welcome__card-body">
                  <span className="aol-welcome__card-title">{cat.title}</span>
                  <span className="aol-welcome__card-sub">{cat.subtitle}</span>
                </span>
                <span className="aol-welcome__card-arrow" aria-hidden>
                  →
                </span>
              </span>
            </button>
          ))}
        </nav>

        <footer className="aol-welcome__footer">
          <button
            type="button"
            className="aol-welcome__all"
            onClick={() => navigateToLibrary()}
          >
            Вся библиотека
          </button>
          <p className="aol-welcome__note">
            Слушайте онлайн или сохраняйте для офлайна
          </p>
        </footer>

        <p className="aol-welcome__band">
          <a href="https://artofliving.ru" target="_blank" rel="noopener noreferrer">
            artofliving.ru
          </a>
        </p>
      </div>
    </div>
  );
}
