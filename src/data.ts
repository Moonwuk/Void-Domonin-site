export const GAME = {
  name: 'Void Dominion',
  tagline: 'Космическая grand strategy в реальном времени',
  intro:
    'Массовый мультиплеер в духе Bytro Labs, но в сеттинге тёмного космоса. Мир идёт непрерывно и круглосуточно — заходи, отдавай приказы на часы вперёд и выходи. Не пошаговая: время — это ресурс.',
  repoUrl: 'https://github.com/Moonwuk/MoonGame',
  apkUrl:
    'https://github.com/Moonwuk/Nygame/releases/download/alpha/void-dominion-alpha.apk',
};

export interface Feature {
  icon: string;
  title: string;
  text: string;
}

export const FEATURES: Feature[] = [
  {
    icon: '🛰',
    title: 'Флоты и наземные дивизии',
    text: 'Строй флоты и собирай шаблоны наземных армий из пехоты и танков с превью характеристик. Двухфазный захват миров и дальнобойная артиллерия с дугами снарядов.',
  },
  {
    icon: '⛏',
    title: 'Экономика на 5 ресурсов',
    text: 'Добыча, постройки и логистика. Развивай миры, балансируй доход и питай военную машину — каждое решение стоит реального времени.',
  },
  {
    icon: '🔬',
    title: 'Технологии и герои',
    text: 'Дерево технологий, совет учёных и герои со способностями. Прокачивай командира между матчами по трём веткам мета-прогрессии.',
  },
  {
    icon: '🤝',
    title: 'Дипломатия и шпионаж',
    text: 'Мир, война, пакт и союз — с людьми и ботами. Веди разведку и контрразведку, заключай сделки на сессионной бирже.',
  },
  {
    icon: '🌐',
    title: 'Онлайн-матчи',
    text: 'Матчи до 10 живых игроков по позывным. Durable-мир на Postgres переживает рестарт сервера, а пустые кресла держит серверный ИИ.',
  },
  {
    icon: '🛡',
    title: '«Хранитель»',
    text: 'Уходишь спать? Делегируй своё место ИИ на время — оборона держится, экономика работает, мир не ждёт.',
  },
];

export interface Faction {
  name: string;
  color: string;
  passive: string;
}

export const FACTIONS: Faction[] = [
  { name: 'Azure Compact', color: '#35d6e6', passive: '+12% экономика' },
  { name: 'Crimson Hegemony', color: '#ff5a4d', passive: '+10% урон' },
  { name: 'Amber Concord', color: '#ffb43a', passive: '+15% скорость флотов' },
  { name: 'Violet Ascendancy', color: '#b48cff', passive: '+5% / +5% универсал' },
];

export interface Principle {
  title: string;
  text: string;
}

export const PRINCIPLES: Principle[] = [
  {
    title: 'Data-driven ядро',
    text: 'Игровые объекты описаны в JSON — ядро лишь выполняет правила. Новая механика = новый модуль, а не переписывание логики.',
  },
  {
    title: 'Детерминизм',
    text: 'Ядро — чистая функция: одинаковый вход даёт одинаковый выход. Replay боёв, предпросмотр на клиенте и античит из коробки.',
  },
  {
    title: 'Server-authority',
    text: 'Клиент шлёт намерение — сервер решает. Туман войны это граница безопасности: невидимое физически не покидает сервер.',
  },
];

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: '10', label: 'живых игроков в матче' },
  { value: '24/7', label: 'мир в реальном времени' },
  { value: '26', label: 'модулей поверх ядра' },
  { value: 'RU / EN', label: 'локализация' },
];
