# Void Dominion — сайт-визитка

Премиальный лендинг для игры [**Void Dominion**](https://github.com/Moonwuk/MoonGame) —
real-time космической grand strategy с массовым мультиплеером. Тёмный космос,
интерактивная 3D-сцена во весь экран и holo-UI в стиле игры.

**Live:** https://moonwuk.github.io/Void-Domonin-site/

## Стек

- **Vite** + **TypeScript** (без фреймворка — статический HTML + один модуль сцены)
- **three.js** (бандлится из npm, без CDN): процедурная планета на GLSL-шейдере
  (fbm-шум, огни городов, атмосфера-fresnel), туманности, орбитальные кольца с флотами,
  далёкое солнце, звёздное поле на 8000 точек
- **postprocessing**: `UnrealBloomPass` + ACES tone mapping
- Шрифты Orbitron / Inter / JetBrains Mono, палитра cyan/purple тёмного космоса

## Возможности

- Full-screen 3D hero со scroll-driven камерой и mouse-параллаксом
- Glitch-заголовок, loader, reveal-on-scroll, живые счётчики в статах
- Секции: об игре, 12 модулей-механик, принципы архитектуры, статус разработки, CTA
- **Адаптив** + мобильное меню-бургер
- **`prefers-reduced-motion`**: отключает autorotate/анимации, рендерит статичный кадр
- Пауза рендер-цикла в фоновой вкладке (экономия CPU/батареи)

## Разработка

```bash
npm install
npm run dev      # локальный dev-сервер
npm run build    # прод-сборка в dist/ (tsc + vite)
npm run preview  # предпросмотр сборки
npm run lint     # oxlint
```

Требуется Node >= 20 (проверено на 22).

## Деплой

GitHub Pages через `.github/workflows/deploy.yml`. Для project-site путь задаётся
`VITE_BASE=/<repo>/`. Pages включён в Settings (Source: GitHub Actions).

---

Оригинальная игра — код, контент и механики. Жанр взят как вдохновение, но это не копия.
