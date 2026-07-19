import { motion } from 'framer-motion';
import { HeroScene } from './three/HeroScene';
import { Reveal } from './components/Reveal';
import { GAME, FEATURES, FACTIONS, PRINCIPLES, STATS } from './data';

const asset = (path: string) => import.meta.env.BASE_URL + path;

function Nav() {
  return (
    <header className="nav">
      <a className="brand" href="#top">
        <img src={asset('brand/icon.png')} alt="" width={34} height={34} />
        <span>VOID<b>DOMINION</b></span>
      </a>
      <nav className="nav-links">
        <a href="#features">Возможности</a>
        <a href="#factions">Фракции</a>
        <a href="#tech">Технология</a>
        <a className="nav-cta" href={GAME.apkUrl}>Играть</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-canvas">
        <HeroScene />
      </div>
      <div className="hero-inner">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Real-time · MMO · Grand Strategy
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
          <a className="btn btn-ghost" href={GAME.repoUrl} target="_blank" rel="noreferrer">
            Исходный код на GitHub
          </a>
        </motion.div>
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
          Экономика, армии, наука и интриги в одном непрерывном мире. Каждая система работает
          на настоящем детерминированном ядре — том же, что и на сервере.
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
          Четыре лор-дома, каждый с пассивным бонусом. В сетевом матче до десяти командиров
          делят одну карту — союзники и соперники одновременно.
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

function Tech() {
  return (
    <section className="section" id="tech">
      <Reveal className="section-head">
        <p className="kicker">Под капотом</p>
        <h2>Инженерия, а не магия</h2>
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
          Играбельная альфа для Android — тот же single-file прототип, что и в браузере.
          Скирмиш против ИИ или онлайн-матч по позывным.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={GAME.apkUrl}>Скачать APK</a>
          <a className="btn btn-ghost" href={GAME.repoUrl} target="_blank" rel="noreferrer">
            Документация и код
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src={asset('brand/icon.png')} alt="" width={26} height={26} />
        <span>VOID DOMINION</span>
      </div>
      <p>Оригинальная игра · код, контент и механики. Вдохновлено жанром, но не копия.</p>
      <a href={GAME.repoUrl} target="_blank" rel="noreferrer">GitHub →</a>
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
        <Tech />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
