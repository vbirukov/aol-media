import type { CSSProperties } from "react";
import { HUB_CATEGORIES } from "../lib/hubCategories";
import { navigateToLibrary } from "../lib/appRoute";
import { BrandLogo } from "./BrandLogo";
import { ScriptHeading } from "./ScriptHeading";

export function WelcomePage() {
  return (
    <div className="aol-welcome">
      <div className="aol-welcome__inner">
        <header className="aol-welcome__header">
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
          {HUB_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="aol-welcome__card"
              style={{ "--card-accent": cat.accent } as CSSProperties}
              data-category={cat.id}
              onClick={() => navigateToLibrary(cat)}
            >
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
