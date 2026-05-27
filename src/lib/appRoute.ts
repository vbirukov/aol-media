import { folderShareSlug } from "@vbonline/player/lib/shareOg";
import type { HubCategory, HubCategoryId } from "./hubCategories";
import {
  buildLibrarySearch,
  hubCategoryById,
  HUB_CATEGORIES,
} from "./hubCategories";

export type AppScreen = "welcome" | "library";

const HUB_INTENT_KEY = "aol-media-hub-intent-v1";

export type HubIntent = {
  categoryId: HubCategoryId;
  title: string;
};

export function hasDeepLink(): boolean {
  const params = new URLSearchParams(window.location.search);
  return (
    params.has("track") ||
    params.has("album") ||
    params.get("catalog") === "1"
  );
}

export function readScreenFromHash(): AppScreen {
  const hash = window.location.hash.replace(/^#\/?/, "").split("?")[0] ?? "";
  if (hash === "library") return "library";
  return "welcome";
}

export function navigateToLibrary(category?: HubCategory): void {
  if (category && category.id !== "all") {
    const intent: HubIntent = {
      categoryId: category.id,
      title: category.title,
    };
    sessionStorage.setItem(HUB_INTENT_KEY, JSON.stringify(intent));
    const qs = buildLibrarySearch(category);
    window.location.hash = "#/library";
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${qs}#/library`,
    );
  } else {
    clearHubIntent();
    window.location.hash = "#/library";
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}#/library`,
    );
  }
}

export function navigateToWelcome(): void {
  clearHubIntent();
  const path = window.location.pathname;
  if (window.location.search) {
    window.history.replaceState(null, "", path);
  }
  window.location.hash = "#/";
}

export function readHubIntent(): HubIntent | null {
  try {
    const raw = sessionStorage.getItem(HUB_INTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HubIntent;
    if (!parsed?.categoryId || !parsed?.title) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearHubIntent(): void {
  sessionStorage.removeItem(HUB_INTENT_KEY);
}

export function getInitialScreen(): AppScreen {
  if (hasDeepLink()) return "library";
  return readScreenFromHash();
}

export function resolveHubCategoryFromUrl(): HubCategory | undefined {
  const params = new URLSearchParams(window.location.search);
  const kind = params.get("kind");
  if (kind === "text") return hubCategoryById("texts");
  const album = params.get("album");
  if (!album) return undefined;
  for (const cat of HUB_CATEGORIES) {
    if (cat.section && folderShareSlug(cat.section) === album) return cat;
  }
  return undefined;
}
