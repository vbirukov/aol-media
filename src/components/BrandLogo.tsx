import { useSyncExternalStore } from "react";
import type { AppSkin } from "@vbonline/player";
import { isAolDarkSkin } from "../lib/aolTheme";

type Props = {
  className?: string;
  skin?: AppSkin;
};

const LOGO_LIGHT = "./brand/aol-logo.png";
const LOGO_DARK = "./brand/aol-logo-dark.png";

function subscribeTheme(onChange: () => void) {
  const root = document.documentElement;
  const observer = new MutationObserver(onChange);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ["data-skin", "data-theme"],
  });
  return () => observer.disconnect();
}

function readDocumentDark(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  return (
    root.getAttribute("data-skin") === "aol-dark" ||
    root.getAttribute("data-theme") === "dark"
  );
}

export function BrandLogo({ className, skin }: Props) {
  const docDark = useSyncExternalStore(subscribeTheme, readDocumentDark, () => false);
  const dark = skin !== undefined ? isAolDarkSkin(skin) : docDark;

  return (
    <img
      className={["aol-brand-mark", dark && "aol-brand-mark--dark", className]
        .filter(Boolean)
        .join(" ")}
      src={dark ? LOGO_DARK : LOGO_LIGHT}
      alt="Искусство Жизни"
      width={180}
      height={dark ? 72 : 48}
      decoding="async"
    />
  );
}
