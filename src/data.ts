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

export interface Principle {
  title: string;
  text: string;
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
  nav: { features: string; factions: string; fair: string; download: string };
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
  fair: { head: SectionHead; items: Principle[] };
  cta: { h2: string; text: string; download: string };
  upcoming: UpcomingLink[];
  footer: { copyright: string; soon: string };
}

export const CONTENT: Record<Locale, SiteContent> = {
  ru: {
    meta: {
      title: 'Void Dominion — космическая стратегия в реальном времени',
      description:
        'Void Dominion — космическая стратегия в реальном времени. Мир живёт круглосуточно: строй флоты, развивай экономику, заключай союзы и захватывай миры, даже когда ты офлайн. Играбельная альфа на Android.',
    },
    nav: { features: 'Возможности', factions: 'Фракции', fair: 'Честная игра', download: 'Скачать' },
    hero: {
      eyebrow: 'Real-time · MMO · Стратегия',
      intro:
        'Мир Void Dominion не останавливается, когда ты выходишь. Отдай флотам приказы на часы вперёд, займись своими делами — империя продолжит строить, воевать и торговать. Возвращайся и пожинай плоды.',
      download: 'Скачать альфу (Android)',
      browser: 'В браузере',
      apkNote: 'Файл .apk — при установке разреши «неизвестные источники»',
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
        h2: 'Империя, которая живёт без тебя',
        sub: 'Экономика, армии, наука и интриги в одном непрерывном мире. Пока ты офлайн, приказы выполняются, флоты летят, а рудники копают.',
      },
      items: [
        {
          icon: '🛰',
          title: 'Флоты и наземные армии',
          text: 'Собирай флоты и высаживай десант из пехоты и танков. Захватывай миры в два этапа — сначала орбита, потом поверхность — под прикрытием дальнобойной артиллерии.',
        },
        {
          icon: '⛏',
          title: 'Экономика на 5 ресурсов',
          text: 'Развивай добычу, строй и налаживай логистику между мирами. Всё происходит в реальном времени, поэтому побеждает тот, кто планирует наперёд.',
        },
        {
          icon: '🔬',
          title: 'Технологии и герои',
          text: 'Открывай дерево технологий, собирай совет учёных и веди в бой героев со способностями. Между матчами прокачивай командира по трём веткам.',
        },
        {
          icon: '🤝',
          title: 'Дипломатия и шпионаж',
          text: 'Мир, война, пакт и союз — с живыми игроками и ИИ. Засылай разведчиков, лови чужих шпионов и заключай сделки на бирже.',
        },
        {
          icon: '🌐',
          title: 'Онлайн-матчи',
          text: 'До 10 живых командиров на одной карте. Прогресс хранится на сервере и не теряется, а опустевшие троны подхватывает ИИ.',
        },
        {
          icon: '🛡',
          title: '«Хранитель»',
          text: 'Уходишь спать? Передай империю Хранителю — ИИ подержит оборону и экономику, пока тебя нет. Мир не ждёт, но и не бросает.',
        },
      ],
    },
    factions: {
      head: {
        kicker: 'Дома космоса',
        h2: 'Выбери свою фракцию',
        sub: 'Четыре дома, каждый со своим бонусом. В матче до десяти командиров делят одну карту — союзники и соперники одновременно.',
      },
      items: [
        { name: 'Azure Compact', color: '#35d6e6', passive: '+12% экономика' },
        { name: 'Crimson Hegemony', color: '#ff5a4d', passive: '+10% урон' },
        { name: 'Amber Concord', color: '#ffb43a', passive: '+15% скорость флотов' },
        { name: 'Violet Ascendancy', color: '#b48cff', passive: '+5% экономика и +5% урон' },
      ],
    },
    fair: {
      head: { kicker: 'Правила одни для всех', h2: 'Честная игра' },
      items: [
        {
          title: 'Никакого читерства',
          text: 'Все ходы просчитывает сервер. Противник физически не может подсмотреть, что скрыто туманом войны, или подделать приказ.',
        },
        {
          title: 'Реплеи сражений',
          text: 'Каждый бой можно пересмотреть и разобрать по ходам — результат всегда честный и всегда сходится.',
        },
        {
          title: 'Прогресс не теряется',
          text: 'Мир живёт на сервере круглосуточно. Твоя империя на месте, даже если ты не заходил неделю.',
        },
      ],
    },
    cta: {
      h2: 'Мир уже идёт. Займи своё место.',
      text: 'Играбельная альфа доступна на Android: скирмиш против ИИ или онлайн-матч с друзьями. Дальше — больше.',
      download: 'Скачать APK',
    },
    upcoming: [
      { icon: '🌐', title: 'Браузерная версия', text: 'Играй без установки — прямо на этой странице.' },
      { icon: '💬', title: 'Форум', text: 'Находи союзников, обсуждай тактики, договаривайся о пактах.' },
      { icon: '🛒', title: 'Магазин', text: 'Всё для твоей империи — ближе к релизу.' },
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
    nav: { features: 'Features', factions: 'Factions', fair: 'Fair play', download: 'Download' },
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
    fair: {
      head: { kicker: 'Same rules for everyone', h2: 'Fair play' },
      items: [
        {
          title: 'No cheating',
          text: "Every move is computed on the server. Your opponent physically can't peek behind the fog of war or forge an order.",
        },
        {
          title: 'Battle replays',
          text: 'Every battle can be rewatched and analyzed move by move — the result is always fair and always adds up.',
        },
        {
          title: 'Progress never lost',
          text: 'The world lives on the server around the clock. Your empire is right where you left it, even after a week away.',
        },
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
        'Void Dominion 是一款实时太空战略游戏。世界全天候运转：建造舰队、发展经济、缔结同盟、征服星球——即使你不在线。Android 试玩版现已推出。',
    },
    nav: { features: '特色', factions: '阵营', fair: '公平竞技', download: '下载' },
    hero: {
      eyebrow: '实时 · MMO · 战略',
      intro:
        'Void Dominion 的世界不会因你下线而停止。提前给舰队下达数小时的指令，去忙自己的事——帝国会继续建造、作战和贸易。回来时坐享成果。',
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
        sub: '经济、军队、科技与阴谋，汇聚在一个永不停歇的世界。你离线时，指令照常执行，舰队继续飞行，矿场持续开采。',
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
          text: '要去睡觉了？把帝国交给守护者——AI 会在你离开时守住防线和经济。世界不会等待，但也不会抛弃你。',
        },
      ],
    },
    factions: {
      head: {
        kicker: '太空豪门',
        h2: '选择你的阵营',
        sub: '四大家族，各有专属加成。最多十名指挥官共享一张地图——既是盟友，也是对手。',
      },
      items: [
        { name: 'Azure Compact', color: '#35d6e6', passive: '+12% 经济' },
        { name: 'Crimson Hegemony', color: '#ff5a4d', passive: '+10% 伤害' },
        { name: 'Amber Concord', color: '#ffb43a', passive: '+15% 舰队速度' },
        { name: 'Violet Ascendancy', color: '#b48cff', passive: '+5% 经济与 +5% 伤害' },
      ],
    },
    fair: {
      head: { kicker: '规则对所有人一致', h2: '公平竞技' },
      items: [
        {
          title: '杜绝作弊',
          text: '所有行动均由服务器计算。对手不可能窥探战争迷雾，也无法伪造指令。',
        },
        {
          title: '战斗回放',
          text: '每场战斗都可以回放并逐步复盘——结果始终公正、始终一致。',
        },
        {
          title: '进度永不丢失',
          text: '世界在服务器上全天候运转。哪怕一周没上线，你的帝国依然原地待命。',
        },
      ],
    },
    cta: {
      h2: '世界已经开始运转。占据你的位置。',
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
