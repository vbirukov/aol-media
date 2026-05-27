import {
  getThemeOptions,
  type AppSkin,
} from "@vbonline/player";

const THEME_MARKS: Record<AppSkin, string> = {
  rastaman: "☽",
  "rastaman-light": "☀",
  jaipur: "◆",
  "moon-dub": "◎",
};

type Props = {
  skin: AppSkin;
  onSkinChange: (skin: AppSkin) => void;
};

export function ThemeSwitcher({ skin, onSkinChange }: Props) {
  const options = getThemeOptions();

  return (
    <div className="theme-switcher" role="group" aria-label="Тема оформления">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={
            skin === opt.id
              ? "theme-switcher__btn is-active"
              : "theme-switcher__btn"
          }
          onClick={() => onSkinChange(opt.id)}
          aria-pressed={skin === opt.id}
          title={`${opt.label} — ${opt.description}`}
        >
          <span className="theme-switcher__mark" aria-hidden>
            {THEME_MARKS[opt.id]}
          </span>
          <span className="theme-switcher__label">{opt.shortLabel}</span>
        </button>
      ))}
    </div>
  );
}
