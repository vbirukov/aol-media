import type { AppSkin } from "@vbonline/player";

const SKIN_KEY = "aol-media-skin-v1";
const APPEARANCE_KEY = "aol-media-appearance-v1";

export const AOL_SKIN_LIGHT = "rastaman-light" as const satisfies AppSkin;
export const AOL_SKIN_DARK = "aol-dark" as const satisfies AppSkin;

export function isAolDarkSkin(skin: AppSkin): boolean {
  return skin === AOL_SKIN_DARK;
}

export function readStoredAolSkin(): AppSkin {
  try {
    const stored = localStorage.getItem(SKIN_KEY);
    if (stored === AOL_SKIN_LIGHT || stored === AOL_SKIN_DARK) return stored;
  } catch {
    /* private mode */
  }
  try {
    if (localStorage.getItem(APPEARANCE_KEY) === "dark") {
      return AOL_SKIN_DARK;
    }
  } catch {
    /* private mode */
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return AOL_SKIN_DARK;
  }
  return AOL_SKIN_LIGHT;
}

export function applyAolDocumentTheme(skin: AppSkin): void {
  const root = document.documentElement;
  root.setAttribute("data-skin", skin);
  root.setAttribute(
    "data-theme",
    isAolDarkSkin(skin) ? "dark" : "rastaman-light",
  );
  const themeColor = isAolDarkSkin(skin) ? "#152028" : "#ffffff";
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((el) => el.setAttribute("content", themeColor));
  const statusBar = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]',
  );
  statusBar?.setAttribute(
    "content",
    isAolDarkSkin(skin) ? "black-translucent" : "default",
  );
}

export function persistAolSkin(skin: AppSkin): void {
  try {
    localStorage.setItem(SKIN_KEY, skin);
    localStorage.setItem(
      APPEARANCE_KEY,
      isAolDarkSkin(skin) ? "dark" : "light",
    );
  } catch {
    /* quota */
  }
}

export function toggleAolSkin(skin: AppSkin): AppSkin {
  return isAolDarkSkin(skin) ? AOL_SKIN_LIGHT : AOL_SKIN_DARK;
}
