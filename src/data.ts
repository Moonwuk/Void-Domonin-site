export type Locale = 'ru' | 'en' | 'zh';

export const GAME = {
  name: 'Void Dominion',
  apkUrl:
    'https://github.com/Moonwuk/Nygame/releases/download/alpha/void-dominion-alpha.apk',
};

export interface Feature {
  icon: string;
  title: string;
  text: string;
}

export interface Faction {
  name: string;
  color: string;
  passive: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface UpcomingLink {
  icon: string;
  title: string;
  text: string;
  /** Появится URL — блок автоматически станет ссылкой. */
  href?: string;
}

export interface SectionHead {
  kicker: string;
  h2: string;
  sub?: string;
}

export interface SiteContent {
  meta: { title: string; description: string };
  nav: { features: string; factions: string; play: string };
  hero: {
    eyebrow: string;
    intro: string;
    download: string;
    browser: string;
    apkNote: string;
  };
  soonBadge: string;
  stats: Stat[];
  features: { head: SectionHead; items: Feature[] };
  factions: { head: SectionHead; items: Faction[] };
  cta: { h2: string; text: string; download: string };
  upcoming: UpcomingLink[];
  footer: { copyright: string; soon: string };
}

export const CONTENT: Record<Locale, SiteContent> = {
  ru: {
    meta: {
      title: 'Void Dominion — космическая стратегия в реальном времени',
      description:
        'Void Dominion — космическая стратегия в реальном времени. Мир живёт круглосуточно: стройте флоты, развивайте экономику, заключайте союзы и захватывайте миры, даже когда вы офлайн. Играбельная альфа на Android.',
    },
    nav: { features: 'Возможности', factions: 'Фракции', play: 'Играть' },
    hero: {
      eyebrow: 'Real-time · MMO · Стратегия',
      intro:
        'Мир Void Dominion не останавливается, когда вы выходите. Отдайте флотам приказы на часы вперёд, займитесь своими делами — империя продолжит строить, воевать и торговать. Возвращайтесь и пожинайте плоды.',
      download: 'Скачать альфу (Android)',
      browser: 'В браузере',
      apkNote: 'Файл .apk — при установке разрешите «неизвестные источники»',
    },
    soonBadge: 'Скоро',
    stats: [
      { value: '10', label: 'живых игроков в матче' },
      { value: '24/7', label: 'мир не останавливается' },
      { value: '5', label: 'ресурсов в экономике' },
      { value: '4', label: 'фракции на выбор' },
    ],
    features: {
      head: {
        kicker: 'Что внутри',
        h2: 'Империя, которая живёт без вас',
        sub: 'Экономика, армии, наука и интриги в одном непрерывном мире. Пока вы офлайн, приказы выполняются, флоты летят, а рудники копают.',
      },
      items: [
        {
          icon: '🛰',
          title: 'Флоты и наземные армии',
          text: 'Собирайте флоты и высаживайте десант из пехоты и танков. Захватывайте миры в два этапа — сначала орбита, потом поверхность — под прикрытием дальнобойной артиллерии.',
        },
        {
          icon: '⛏',
          title: 'Экономика на 5 ресурсов',
          text: 'Развивайте добычу, стройте и налаживайте логистику между мирами. Всё происходит в реальном времени, поэтому побеждает тот, кто планирует наперёд.',
        },
        {
          icon: '🔬',
          title: 'Технологии и герои',
          text: 'Открывайте дерево технологий, собирайте совет учёных и ведите в бой героев со способностями. Между матчами прокачивайте командира по трём веткам.',
        },
        {
          icon: '🤝',
          title: 'Дипломатия и шпионаж',
          text: 'Мир, война, пакт и союз — с живыми игроками и ИИ. Засылайте разведчиков, ловите чужих шпионов и заключайте сделки на бирже.',
        },
        {
          icon: '🌐',
          title: 'Онлайн-матчи',
          text: 'До 10 живых командиров на одной карте. Прогресс хранится на сервере и не теряется, а опустевшие троны подхватывает ИИ.',
        },
        {
          icon: '🛡',
          title: '«Хранитель»',
          text: 'Уходите спать? Передайте империю Хранителю — ИИ подержит оборону и экономику, пока вас нет. Мир не ждёт, но и не бросает.',
        },
      ],
    },
    factions: {
      head: {
        kicker: 'Дома космоса',
        h2: 'Выберите свою фракцию',
        sub: 'Четыре дома, каждый со своим бонусом. В матче до десяти командиров делят одну карту — союзники и соперники одновременно.',
      },
      items: [
        { name: 'Azure Compact', color: '#35d6e6', passive: '+12% экономика' },
        { name: 'Crimson Hegemony', color: '#ff5a4d', passive: '+10% урон' },
        { name: 'Amber Concord', color: '#ffb43a', passive: '+15% скорость флотов' },
        { name: 'Violet Ascendancy', color: '#b48cff', passive: '+5% экономика и +5% урон' },
      ],
    },
    cta: {
      h2: 'Мир уже идёт. Займите своё место.',
      text: 'Играбельная альфа доступна на Android: скирмиш против ИИ или онлайн-матч с друзьями. Дальше — больше.',
      download: 'Скачать APK',
    },
    upcoming: [
      { icon: '🌐', title: 'Браузерная версия', text: 'Играйте без установки — прямо на этой странице.' },
      { icon: '💬', title: 'Форум', text: 'Находите союзников, обсуждайте тактики, договаривайтесь о пактах.' },
      { icon: '🛒', title: 'Магазин', text: 'Всё для вашей империи — ближе к релизу.' },
    ],
    footer: {
      copyright: '© 2026 Void Dominion · Играбельная альфа для Android',
      soon: 'Скоро: браузерная версия · форум · магазин',
    },
  },

  en: {
    meta: {
      title: 'Void Dominion — real-time space strategy',
      description:
        'Void Dominion is a real-time space strategy game. The world runs 24/7: build fleets, grow your economy, forge alliances and conquer worlds — even while you are offline. Playable alpha on Android.',
    },
    nav: { features: 'Features', factions: 'Factions', play: 'Play' },
    hero: {
      eyebrow: 'Real-time · MMO · Strategy',
      intro:
        "The world of Void Dominion doesn't stop when you log off. Queue orders for your fleets hours ahead, go about your day — your empire keeps building, fighting and trading. Come back and reap the rewards.",
      download: 'Download alpha (Android)',
      browser: 'In browser',
      apkNote: 'APK file — allow “unknown sources” when installing',
    },
    soonBadge: 'Soon',
    stats: [
      { value: '10', label: 'live players per match' },
      { value: '24/7', label: 'the world never stops' },
      { value: '5', label: 'resources to manage' },
      { value: '4', label: 'factions to choose from' },
    ],
    features: {
      head: {
        kicker: "What's inside",
        h2: 'An empire that lives without you',
        sub: "Economy, armies, science and intrigue in one continuous world. While you're offline, orders are carried out, fleets keep flying and mines keep digging.",
      },
      items: [
        {
          icon: '🛰',
          title: 'Fleets and ground armies',
          text: 'Assemble fleets and land troops of infantry and tanks. Capture worlds in two stages — orbit first, then the surface — under cover of long-range artillery.',
        },
        {
          icon: '⛏',
          title: 'A 5-resource economy',
          text: 'Expand mining, develop your worlds and run logistics between them. Everything happens in real time, so the player who plans ahead wins.',
        },
        {
          icon: '🔬',
          title: 'Tech and heroes',
          text: 'Unlock the tech tree, assemble a council of scientists and lead heroes with abilities. Between matches, level up your commander across three branches.',
        },
        {
          icon: '🤝',
          title: 'Diplomacy and espionage',
          text: 'Peace, war, pacts and alliances — with live players and AI. Send out spies, catch enemy agents and strike deals on the exchange.',
        },
        {
          icon: '🌐',
          title: 'Online matches',
          text: 'Up to 10 live commanders on one map. Progress is stored on the server and never lost, and abandoned thrones are picked up by AI.',
        },
        {
          icon: '🛡',
          title: 'The Warden',
          text: "Going to sleep? Hand your empire to the Warden — AI holds your defense and economy while you're away. The world doesn't wait, but it doesn't abandon you either.",
        },
      ],
    },
    factions: {
      head: {
        kicker: 'Houses of space',
        h2: 'Choose your faction',
        sub: 'Four houses, each with its own bonus. Up to ten commanders share one map — allies and rivals at the same time.',
      },
      items: [
        { name: 'Azure Compact', color: '#35d6e6', passive: '+12% economy' },
        { name: 'Crimson Hegemony', color: '#ff5a4d', passive: '+10% damage' },
        { name: 'Amber Concord', color: '#ffb43a', passive: '+15% fleet speed' },
        { name: 'Violet Ascendancy', color: '#b48cff', passive: '+5% economy and +5% damage' },
      ],
    },
    cta: {
      h2: 'The world is already turning. Claim your place.',
      text: 'The playable alpha is out on Android: skirmish against AI or play online with friends. More to come.',
      download: 'Download APK',
    },
    upcoming: [
      { icon: '🌐', title: 'Browser version', text: 'Play without installing — right on this page.' },
      { icon: '💬', title: 'Forum', text: 'Find allies, discuss tactics, negotiate pacts.' },
      { icon: '🛒', title: 'Shop', text: 'Everything for your empire — closer to release.' },
    ],
    footer: {
      copyright: '© 2026 Void Dominion · Playable alpha for Android',
      soon: 'Coming soon: browser version · forum · shop',
    },
  },

  zh: {
    meta: {
      title: 'Void Dominion — 实时太空战略游戏',
      description:
        'Void Dominion 是一款实时太空战略游戏。世界全天候运转：建造舰队、发展经济、缔结同盟、征服星球——即使您不在线。Android 试玩版现已推出。',
    },
    nav: { features: '特色', factions: '阵营', play: '开始游戏' },
    hero: {
      eyebrow: '实时 · MMO · 战略',
      intro:
        'Void Dominion 的世界不会因您下线而停止。提前给舰队下达数小时的指令，去忙自己的事——帝国会继续建造、作战和贸易。回来时坐享成果。',
      download: '下载测试版（Android）',
      browser: '网页版',
      apkNote: 'APK 文件——安装时请允许「未知来源」',
    },
    soonBadge: '即将推出',
    stats: [
      { value: '10', label: '每场实时玩家' },
      { value: '24/7', label: '世界永不停歇' },
      { value: '5', label: '种经济资源' },
      { value: '4', label: '个可选阵营' },
    ],
    features: {
      head: {
        kicker: '游戏内容',
        h2: '一个离开你也在运转的帝国',
        sub: '经济、军队、科技与阴谋，汇聚在一个永不停歇的世界。您离线时，指令照常执行，舰队继续飞行，矿场持续开采。',
      },
      items: [
        {
          icon: '🛰',
          title: '舰队与地面部队',
          text: '组建舰队，投放步兵和坦克。分两个阶段夺取星球——先控制轨道，再攻占地表，远程火炮为你提供掩护。',
        },
        {
          icon: '⛏',
          title: '五种资源的经济',
          text: '扩大开采、建设星球、打通星际物流。一切都实时进行，善于提前规划者获胜。',
        },
        {
          icon: '🔬',
          title: '科技与英雄',
          text: '解锁科技树，组建科学家委员会，率领拥有技能的英雄。在比赛之间沿三条分支培养你的指挥官。',
        },
        {
          icon: '🤝',
          title: '外交与谍报',
          text: '和平、战争、条约与同盟——与真人玩家和 AI 周旋。派出间谍、抓捕敌探、在交易所达成交易。',
        },
        {
          icon: '🌐',
          title: '在线对战',
          text: '同一张地图最多 10 名真人指挥官。进度保存在服务器上永不丢失，空出的王座由 AI 接管。',
        },
        {
          icon: '🛡',
          title: '「守护者」',
          text: '要去睡觉了？把帝国交给守护者——AI 会在您离开时守住防线和经济。世界不会等待，但也不会抛弃您。',
        },
      ],
    },
    factions: {
      head: {
        kicker: '太空豪门',
        h2: '选择您的阵营',
        sub: '四大家族，各有专属加成。最多十名指挥官共享一张地图——既是盟友，也是对手。',
      },
      items: [
        { name: 'Azure Compact', color: '#35d6e6', passive: '+12% 经济' },
        { name: 'Crimson Hegemony', color: '#ff5a4d', passive: '+10% 伤害' },
        { name: 'Amber Concord', color: '#ffb43a', passive: '+15% 舰队速度' },
        { name: 'Violet Ascendancy', color: '#b48cff', passive: '+5% 经济与 +5% 伤害' },
      ],
    },
    cta: {
      h2: '世界已经开始运转。占据您的位置。',
      text: 'Android 试玩版现已推出：与 AI 遭遇战，或与好友在线对战。更多内容即将到来。',
      download: '下载 APK',
    },
    upcoming: [
      { icon: '🌐', title: '网页版', text: '无需安装，在本页面直接游玩。' },
      { icon: '💬', title: '论坛', text: '寻找盟友、探讨战术、商定条约。' },
      { icon: '🛒', title: '商店', text: '帝国所需的一切——临近正式发布时推出。' },
    ],
    footer: {
      copyright: '© 2026 Void Dominion · Android 试玩版',
      soon: '即将推出：网页版 · 论坛 · 商店',
    },
  },
};
