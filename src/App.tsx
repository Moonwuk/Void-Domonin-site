import { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Reveal } from './components/Reveal';
import { GAME, CONTENT, type Locale, type SiteContent } from './data';
import { LOCALES, LOCALE_LABEL, detectLocale, persistLocale, applyLocaleToDocument } from './i18n';

const HeroScene = lazy(() =>
  import('./three/HeroScene').then((m) => ({ default: m.HeroScene })),
);

const asset = (path: string) => import.meta.env.BASE_URL + path;

function Nav({ t, locale, onLocale }: { t: SiteContent; locale: Locale; onLocale: () => void }) {
  return (
    <header className="nav">
      <a className="brand" href="#top">
        <img src={asset('brand/icon-small.png')} alt="" width={34} height={34} />
        <span>VOID<b>DOMINION</b></span>
      </a>
      <nav className="nav-links">
        <a href="#features">{t.nav.features}</a>
        <a href="#factions">{t.nav.factions}</a>
        <a href="#fair">{t.nav.fair}</a>
        <button className="lang-btn" type="button" onClick={onLocale} aria-label="Language">
          {LOCALE_LABEL[locale]}
        </button>
        <a className="nav-cta" href={GAME.apkUrl}>{t.nav.download}</a>
      </nav>
    </header>
  );
}

function Hero({ t }: { t: SiteContent }) {
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
          {t.hero.eyebrow}
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
          {t.hero.intro}
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
        >
          <a className="btn btn-primary" href={GAME.apkUrl}>
            {t.hero.download}
          </a>
          <span className="btn btn-ghost btn-soon">
            {t.hero.browser} <em>{t.soonBadge}</em>
          </span>
        </motion.div>
        <motion.p
          className="hero-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.36 }}
        >
          {t.hero.apkNote}
        </motion.p>
      </div>
      <div className="scroll-hint" aria-hidden>
        <span />
      </div>
    </section>
  );
}

function Stats({ t }: { t: SiteContent }) {
  return (
    <section className="stats">
      {t.stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="stat">
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </Reveal>
      ))}
    </section>
  );
}

function SectionHeader({ head }: { head: SiteContent['features']['head'] }) {
  return (
    <Reveal className="section-head">
      <p className="kicker">{head.kicker}</p>
      <h2>{head.h2}</h2>
      {head.sub && <p className="section-sub">{head.sub}</p>}
    </Reveal>
  );
}

function Features({ t }: { t: SiteContent }) {
  return (
    <section className="section" id="features">
      <SectionHeader head={t.features.head} />
      <div className="feature-grid">
        {t.features.items.map((f, i) => (
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

function Factions({ t }: { t: SiteContent }) {
  return (
    <section className="section" id="factions">
      <SectionHeader head={t.factions.head} />
      <div className="faction-grid">
        {t.factions.items.map((f, i) => (
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

function FairPlay({ t }: { t: SiteContent }) {
  return (
    <section className="section" id="fair">
      <SectionHeader head={t.fair.head} />
      <div className="principle-grid">
        {t.fair.items.map((p, i) => (
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

function CTA({ t }: { t: SiteContent }) {
  return (
    <section className="cta">
      <Reveal className="cta-inner">
        <h2>{t.cta.h2}</h2>
        <p>{t.cta.text}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={GAME.apkUrl}>{t.cta.download}</a>
        </div>
        <p className="hero-note">{t.hero.apkNote}</p>
        <div className="soon-grid">
          {t.upcoming.map((u) => {
            const inner = (
              <>
                <span className="soon-icon" aria-hidden>{u.icon}</span>
                <span className="soon-badge">{t.soonBadge}</span>
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

function Footer({ t }: { t: SiteContent }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src={asset('brand/icon-small.png')} alt="" width={26} height={26} />
        <span>VOID DOMINION</span>
      </div>
      <p>{t.footer.copyright}</p>
      <span className="footer-soon">{t.footer.soon}</span>
    </footer>
  );
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(detectLocale);
  const t = CONTENT[locale];

  useEffect(() => {
    applyLocaleToDocument(locale);
  }, [locale]);

  const cycleLocale = () => {
    const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length];
    persistLocale(next);
    setLocale(next);
  };

  return (
    <>
      <Nav t={t} locale={locale} onLocale={cycleLocale} />
      <main>
        <Hero t={t} />
        <Stats t={t} />
        <Features t={t} />
        <Factions t={t} />
        <FairPlay t={t} />
        <CTA t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
