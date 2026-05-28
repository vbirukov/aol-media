import type { MediaKind } from "@vbonline/player";
import { folderShareSlug } from "@vbonline/player/lib/shareOg";

export type HubCategoryId =
  | "meditations"
  | "talks"
  | "knowledge"
  | "texts"
  | "bhajans"
  | "mantras"
  | "all";

export type HubCategory = {
  id: HubCategoryId;
  title: string;
  subtitle: string;
  badge: string;
  accent: string;
  iconUrl?: string;
  section?: string;
  mediaKind?: MediaKind;
};

export const HUB_CATEGORIES: HubCategory[] = [
  {
    id: "talks",
    title: "Беседы",
    subtitle: "Лекции и разговоры о пути",
    badge: "Б",
    accent: "#2a3e4e",
    iconUrl: "./icons/sections/talks.png",
    section: "Беседы",
  },
  {
    id: "knowledge",
    title: "Серии знаний",
    subtitle: "Комментарии на священные писания",
    badge: "С",
    accent: "#ffc001",
    iconUrl: "./icons/sections/knowledge.png",
    section: "Серии знаний",
  },
  {
    id: "meditations",
    title: "Медитации",
    subtitle: "Практики и guided-сессии",
    badge: "М",
    accent: "#7b54bf",
    iconUrl: "./icons/sections/meditations.png",
    section: "Медитации",
    mediaKind: "audio",
  },
  {
    id: "texts",
    title: "Тексты",
    subtitle: "Писания, конспекты, статьи",
    badge: "Т",
    accent: "#acaba8",
    iconUrl: "./icons/sections/texts.png",
    mediaKind: "text",
  },
  {
    id: "bhajans",
    title: "Баджаны",
    subtitle: "Песнопения и мелодии",
    badge: "♪",
    accent: "#ff7b7c",
    iconUrl: "./icons/sections/bhajans.png",
    section: "Баджаны",
    mediaKind: "audio",
  },
  {
    id: "mantras",
    title: "Мантры",
    subtitle: "Произнесение и запись",
    badge: "ॐ",
    accent: "#35b3e1",
    iconUrl: "./icons/sections/mantras.png",
    section: "Мантры",
    mediaKind: "audio",
  },
];

export function hubCategoryById(id: HubCategoryId): HubCategory | undefined {
  return HUB_CATEGORIES.find((c) => c.id === id);
}

function categoryAlbumPath(section: string): string {
  return `/${section}/${section}`.replace(/\/+/g, "/");
}

export function buildLibrarySearch(category: HubCategory): string {
  const params = new URLSearchParams();
  if (category.section) {
    params.set("album", folderShareSlug(categoryAlbumPath(category.section)));
  }
  if (category.mediaKind && category.mediaKind !== "audio") {
    params.set("kind", category.mediaKind);
  } else if (category.id === "texts") {
    params.set("kind", "text");
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
