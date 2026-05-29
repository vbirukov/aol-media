import { useCallback, useRef } from "react";
import type { PlayerHeroSlotProps } from "@vbonline/player";
import { navigateToWelcome, readHubIntent } from "../lib/appRoute";
import { hubCategoryById } from "../lib/hubCategories";
import { ScriptHeading } from "./ScriptHeading";

export function HubLibraryHero({
  catalog,
  collapsed,
  onCollapse,
  onExpand,
}: PlayerHeroSlotProps) {
  const intent = readHubIntent();
  const category = intent ? hubCategoryById(intent.categoryId) : undefined;

  const isDesktop =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 960px)").matches;
  const isCompact = collapsed && !isDesktop;
  const stackRef = useRef<HTMLDivElement>(null);

  const scrollIntoView = useCallback(() => {
    stackRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, []);

  const handleToggle = useCallback(() => {
    if (isDesktop) return;
    if (collapsed) {
      onExpand();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollIntoView());
      });
    } else {
      onCollapse();
    }
  }, [collapsed, isDesktop, onCollapse, onExpand, scrollIntoView]);

  const handleBack = () => {
    navigateToWelcome();
  };

  return (
    <section className={isCompact ? "hero hero--compact aol-hub-hero" : "hero aol-hub-hero"}>
      <div className="hero-stack" ref={stackRef}>
        <button type="button" className="aol-hub-hero__back ghost" onClick={handleBack}>
          ← На главную
        </button>
        <h1 className="hero-author-link">
          {category ? (
            <ScriptHeading>{category.title}</ScriptHeading>
          ) : (
            <ScriptHeading>Библиотека</ScriptHeading>
          )}
        </h1>
        <p className="hero-author-bio mini-text">
          {category?.subtitle ??
            "Все материалы: беседы, медитации, тексты, баджаны и мантры"}
        </p>
        {!isDesktop ? (
          <button
            type="button"
            className="hero-toggle"
            onClick={handleToggle}
            aria-expanded={!isCompact}
          >
            {collapsed ? "Подробнее" : "Свернуть"}
          </button>
        ) : null}
        <div
          className="hero-expandable"
          aria-hidden={isCompact}
          id="hero-hub-about"
        >
          <div className="hero-expandable-inner">
            <p className="hero-author-bio">
              {catalog.sourceTitle
                ? `Источник: ${catalog.sourceTitle}. `
                : ""}
              Сначала раздел, затем папка — треки внутри. В меню слева то же
              дерево; фильтры по типу — аудио, видео, текст.
            </p>
          </div>
        </div>
        {isCompact ? (
          <p className="hero-compact-stats mini-text">
            {catalog.tracks.length} материалов
          </p>
        ) : null}
      </div>
    </section>
  );
}
