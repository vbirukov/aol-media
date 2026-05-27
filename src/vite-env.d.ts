/// <reference types="vite/client" />

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface ImportMetaEnv {
  readonly VITE_MEDIA_BASE?: string;
  readonly VITE_AUDIO_PROXY_BASE?: string;
  readonly VITE_SITE_ORIGIN?: string;
  readonly VITE_YM_COUNTER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
