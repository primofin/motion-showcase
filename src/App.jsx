import { useState } from 'react'
import {
  motion, AnimatePresence, Reorder, useScroll, useSpring, useTransform,
  useMotionValue, MotionConfig,
} from 'framer-motion'

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const CARDS = [
  { id: 1, emoji: '🧩', title: 'Design systems', text: 'Shared Lit-based components used across multiple frontend apps.' },
  { id: 2, emoji: '🎞️', title: 'Motion & UX', text: 'Purposeful animation that guides attention and explains state changes.' },
  { id: 3, emoji: '♿', title: 'Accessibility', text: 'Reduced-motion support, focus states and semantic markup.' },
  { id: 4, emoji: '⚡', title: 'Performance', text: 'Animating transform and opacity so everything stays on the GPU.' },
]

function Progress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return <motion.div className="progress" style={{ scaleX }} />
}

function Hero() {
  const words = 'Frontend that feels alive.'.split(' ')
  return (
    <header className="hero">
      <div className="blobs" aria-hidden>
        <motion.span className="blob b1" animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span className="blob b2" animate={{ x: [0, -50, 30, 0], y: [0, 30, -20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      </div>
      <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Vy · Frontend Developer</motion.p>
      <motion.h1 initial="hidden" animate="show" variants={stagger}>
        {words.map((w, i) => (
          <motion.span key={i} variants={fadeUp} transition={{ type: 'spring', damping: 18 }} className="word">{w}&nbsp;</motion.span>
        ))}
      </motion.h1>
      <motion.p className="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        A tiny playground of Framer Motion patterns: variants, gestures, layout animations, drag and scroll.
      </motion.p>
      <motion.a href="#cards" className="cta" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
        Explore ↓
      </motion.a>
    </header>
  )
}

function Section({ id, title, hint, children }) {
  return (
    <motion.section id={id} className="section" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
      <motion.h2 variants={fadeUp}>{title}</motion.h2>
      <motion.p className="hint" variants={fadeUp}>{hint}</motion.p>
      {children}
    </motion.section>
  )
}

function SharedLayoutCards() {
  const [sel, setSel] = useState(null)
  const card = CARDS.find((c) => c.id === sel)
  return (
    <>
      <div className="grid">
        {CARDS.map((c) => (
          <motion.button key={c.id} layoutId={`card-${c.id}`} className="card" variants={fadeUp}
            whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(124,92,255,.3)' }} whileTap={{ scale: 0.97 }}
            onClick={() => setSel(c.id)}>
            <motion.span layoutId={`e-${c.id}`} className="emoji">{c.emoji}</motion.span>
            <motion.h3 layoutId={`t-${c.id}`}>{c.title}</motion.h3>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {card && (
          <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.div layoutId={`card-${card.id}`} className="card open" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={card.title}>
              <motion.span layoutId={`e-${card.id}`} className="emoji big">{card.emoji}</motion.span>
              <motion.h3 layoutId={`t-${card.id}`}>{card.title}</motion.h3>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.25 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>{card.text}</motion.p>
              <button className="close" onClick={() => setSel(null)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function DragPlay() {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-150, 150], [-25, 25])
  const hue = useTransform(x, [-150, 150], [200, 330])
  const bg = useTransform(hue, (h) => `hsl(${h} 85% 60%)`)
  return (
    <motion.div className="dragArea" variants={fadeUp}>
      <motion.div className="dragBox" drag="x" dragConstraints={{ left: -150, right: 150 }} dragElastic={0.25}
        style={{ x, rotate, background: bg }} whileTap={{ scale: 1.1, cursor: 'grabbing' }}>
        drag me
      </motion.div>
    </motion.div>
  )
}

function Tasks() {
  const [items, setItems] = useState(['Map the BPMN flow', 'Interview stakeholders', 'Write user stories', 'Prototype UI'])
  return (
    <motion.div variants={fadeUp}>
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="list">
        {items.map((it) => (
          <Reorder.Item key={it} value={it} className="item" whileDrag={{ scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,.4)' }}>
            <span className="grip">⠿</span>{it}
            <button aria-label={`Remove ${it}`} onClick={() => setItems(items.filter((i) => i !== it))}>✕</button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <button className="reset" onClick={() => setItems(['Map the BPMN flow', 'Interview stakeholders', 'Write user stories', 'Prototype UI'])}>Reset</button>
    </motion.div>
  )
}

function Tabs() {
  const tabs = ['Variants', 'Gestures', 'Layout']
  const [active, setActive] = useState(tabs[0])
  const copy = {
    Variants: 'Orchestrate parent/child animations declaratively with stagger.',
    Gestures: 'whileHover, whileTap and drag give instant tactile feedback.',
    Layout: 'layout and layoutId animate between DOM states automatically.',
  }
  return (
    <motion.div variants={fadeUp}>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t} role="tab" aria-selected={t === active} className="tab" onClick={() => setActive(t)}>
            {t === active && <motion.span layoutId="pill" className="pill" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span className="tabLabel">{t}</span>
          </button>
        ))}
      </div>
      <div className="tabBody">
        <AnimatePresence mode="wait">
          <motion.p key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>{copy[active]}</motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Progress />
      <Hero />
      <main>
        <Section id="cards" title="Shared layout transitions" hint="Click a card: layoutId morphs it into a dialog.">
          <SharedLayoutCards />
        </Section>
        <Section title="Animated tabs" hint="A single pill glides between tabs, content cross-fades.">
          <Tabs />
        </Section>
        <Section title="Drag + motion values" hint="Rotation and colour derive from x via useTransform.">
          <DragPlay />
        </Section>
        <Section title="Reorderable list" hint="Drag to reorder, remove with ✕. Items animate on layout change.">
          <Tasks />
        </Section>
      </main>
      <footer>Built with React, Vite &amp; Framer Motion · respects prefers-reduced-motion</footer>
    </MotionConfig>
  )
}
