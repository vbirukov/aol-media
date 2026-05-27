# Искусство Жизни — медиатека (PWA)

Vite + React PWA для доступа к контенту Искусства Жизни: беседы, лекции о писаниях, медитации и практики.

Движок воспроизведения: [`@vbonline/player`](https://www.npmjs.com/package/@vbonline/player).

## Быстрый старт

```bash
npm install
cp .env.example .env
# задай VITE_MEDIA_BASE или VITE_AUDIO_PROXY_BASE + ключ Диска в src/player/setup.ts
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Интеграция плеера

См. [INTEGRATION.md](./INTEGRATION.md) и [AGENT.md](./AGENT.md).

Ключевые файлы:

- `src/player/setup.ts` — `setPlayerConfig()` с уникальными storage keys
- `src/App.tsx` — `<PlayerApp>` + слоты header/hero
- `src/styles/player.css` — стили UI движка (в npm-пакете CSS нет)
- `public/sw.js` — service worker для PWA

## Embed

Отдельная страница для встраивания одного трека: `embed.html` → `src/embed-main.tsx`.

## Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `VITE_MEDIA_BASE` | CDN с `catalog.json` и медиафайлами |
| `VITE_AUDIO_PROXY_BASE` | Прокси для Yandex Disk (если нет CDN) |
| `VITE_SITE_ORIGIN` | Canonical URL для Open Graph |
| `VITE_YM_COUNTER_ID` | Яндекс.Метрика |
