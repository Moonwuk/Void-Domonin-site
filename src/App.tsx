import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Reveal } from './components/Reveal';
import { GAME, FEATURES, FACTIONS, PRINCIPLES, STATS, UPCOMING } from './data';

const HeroScene = lazy(() =>
  import('./three/HeroScene').then((m) => ({ default: m.HeroScene })),
);

const asset = (path: string) => import.meta.env.BASE_URL + path;

function Nav() {
  return (
    <header className="nav">
      <a className="brand" href="#top">
        <img src={asset('brand/icon-small.png')} alt="" width={34} height={34} />
        <span>VOID<b>DOMINION</b></span>
      </a>
      <nav className="nav-links">
        <a href="#features">Возможности</a>
        <a href="#factions">Фракции</a>
        <a href="#fair">Честная игра</a>
        <a className="nav-cta" href={GAME.apkUrl}>Скачать</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-canvas">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>
      <div className="hero-inner">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Real-time · MMO · Стратегия
        </motion.p>
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          {GAME.name}
        </motion.h1>
        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
        >
          {GAME.intro}
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
        >
          <a className="btn btn-primary" href={GAME.apkUrl}>
            Скачать альфу (Android)
          </a>
          <span className="btn btn-ghost btn-soon">
            В браузере <em>скоро</em>
          </span>
        </motion.div>
        <motion.p
          className="hero-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.36 }}
        >
          {GAME.apkNote}
        </motion.p>
      </div>
      <div className="scroll-hint" aria-hidden>
        <span />
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats">
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="stat">
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </Reveal>
      ))}
    </section>
  );
}

function Features() {
  return (
    <section className="section" id="features">
      <Reveal className="section-head">
        <p className="kicker">Что внутри</p>
        <h2>Империя, которая живёт без тебя</h2>
        <p className="section-sub">
          Экономика, армии, наука и интриги в одном непрерывном мире. Пока ты офлайн, приказы
          выполняются, флоты летят, а рудники копают.
        </p>
      </Reveal>
      <div className="feature-grid">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.08} className="card">
            <div className="card-icon" aria-hidden>{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Factions() {
  return (
    <section className="section" id="factions">
      <Reveal className="section-head">
        <p className="kicker">Дома космоса</p>
        <h2>Выбери свою фракцию</h2>
        <p className="section-sub">
          Четыре дома, каждый со своим бонусом. В матче до десяти командиров делят одну карту —
          союзники и соперники одновременно.
        </p>
      </Reveal>
      <div className="faction-grid">
        {FACTIONS.map((f, i) => (
          <Reveal key={f.name} delay={i * 0.07} className="faction">
            <span className="faction-orb" style={{ ['--fc' as string]: f.color }} />
            <div>
              <h3>{f.name}</h3>
              <p style={{ color: f.color }}>{f.passive}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FairPlay() {
  return (
    <section className="section" id="fair">
      <Reveal className="section-head">
        <p className="kicker">Правила одни для всех</p>
        <h2>Честная игра</h2>
      </Reveal>
      <div className="principle-grid">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08} className="principle">
            <div className="principle-num">{String(i + 1).padStart(2, '0')}</div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta">
      <Reveal className="cta-inner">
        <h2>Мир уже идёт. Займи своё место.</h2>
        <p>
          Играбельная альфа доступна на Android: скирмиш против ИИ или онлайн-матч с друзьями.
          Дальше — больше.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={GAME.apkUrl}>Скачать APK</a>
        </div>
        <p className="hero-note">{GAME.apkNote}</p>
        <div className="soon-grid">
          {UPCOMING.map((u) => {
            const inner = (
              <>
                <span className="soon-icon" aria-hidden>{u.icon}</span>
                <span className="soon-badge">Скоро</span>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
              </>
            );
            return u.href ? (
              <a key={u.title} className="soon" href={u.href}>{inner}</a>
            ) : (
              <div key={u.title} className="soon">{inner}</div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src={asset('brand/icon-small.png')} alt="" width={26} height={26} />
        <span>VOID DOMINION</span>
      </div>
      <p>© 2026 Void Dominion · Играбельная альфа для Android</p>
      <span className="footer-soon">Скоро: браузерная версия · форум · магазин</span>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Factions />
        <FairPlay />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
