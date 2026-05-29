import {
  setPlayerConfig,
  type ThemeMeta,
} from "@vbonline/player";

const AOL_THEME: ThemeMeta[] = [
  {
    id: "rastaman-light",
    label: "Искусство Жизни",
    shortLabel: "Свет",
    description: "Светлая тема — брендбук artofliving.ru",
    mark: "☀",
    dataTheme: "rastaman-light",
    themeColor: "#ffffff",
  },
  {
    id: "aol-dark",
    label: "Искусство Жизни",
    shortLabel: "Тьма",
    description: "Тёмная тема — сизо-синий и оранжевый акцент",
    mark: "☽",
    dataTheme: "dark",
    themeColor: "#152028",
  },
];

setPlayerConfig({
  appName: "aol-media",
  storage: {
    user: "aol-media-user-state-v1",
    catalogRefresh: "aol-media-catalog-refresh-v1",
    catalogCache: "aol-media-catalog-cache-v1",
    skin: "aol-media-skin-v1",
    appearance: "aol-media-appearance-v1",
    heroCollapsed: "aol-media-hero-collapsed-v1",
    splashSeen: "aol-media-splash-seen-v1",
  },
  catalog: {
    publicDiskKey: "https://disk.yandex.ru/d/XXXXXXXX",
    apiRoot: "https://cloud-api.yandex.net/v1/disk/public/resources",
  },
  features: {
    offline: true,
    pwa: true,
    share: true,
    video: true,
    text: true,
  },
  getFallbackCatalog: () => ({
    sourceTitle: "Искусство Жизни",
    sections: [],
    folders: [],
    tracks: [],
    loaded: false,
  }),
  themeOptions: AOL_THEME,
  catalogNavigation: {
    mode: "hierarchical",
    catalogRoot: "sections",
    sectionView: "folder-cards",
  },
});
