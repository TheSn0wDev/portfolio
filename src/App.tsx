import React, { useEffect, useMemo, useRef, useState } from "react";

type Panel = "about" | "projects" | "skills" | "contact" | null;
type Command = { id: Panel; title: string; hint?: string };

const COMMANDS: Command[] = [
  { id: "about", title: "About", hint: "Who I am" },
  { id: "projects", title: "Projects", hint: "GitHub highlights" },
  { id: "skills", title: "Skills", hint: "Stack & tools" },
  { id: "contact", title: "Contact", hint: "Email & socials" },
];

const PROJECTS = [
  {
    name: "Djise",
    link: "https://djise.app",
    tags: ["TypeScript", "Next.js", "App", "In development"],
  },
  {
    name: "CoHoMa III",
    link: "https://www.defense.gouv.fr/aid/actualites/cohoma-iii-ledition-consolidation",
    tags: ["C++", "Python", "Robotics", "Military", "Innovation"],
  },
  {
    name: "Vision4Rescue",
    link: "https://www.renault.fr/gamme-concept-cars/vision-4rescue.html",
    tags: ["C++", "Python", "Robotics", "Firefighters", "Innovation"],
  },
  {
    name: "AZEOO",
    link: "https://azeoo.com/",
    tags: ["WordPress", "App", "Sport"],
  },
  {
    name: "Ekalia",
    link: "https://ekalia.fr",
    tags: ["HTML", "CSS", "JS", "Front-end"],
  },
  {
    name: "Skytale",
    link: "https://skytale.fr/",
    tags: ["HTML", "CSS", "JS", "Front-end"],
  },
  {
    name: "Atlantique RP",
    link: "#",
    tags: ["Lua", "React", "Gaming", "Aborted"],
  },
  {
    name: "NextJS Boilerplate",
    link: "https://github.com/TheSn0wDev/nextjs-boiler-plate",
    tags: ["TypeScript", "Next.js", "Boilerplate"],
  },
  {
    name: "Luma Framework",
    link: "https://github.com/Luma-Framework/luma",
    tags: ["TypeScript", "Framework", "Gaming", "In development"],
  },
  {
    name: "Fulgur",
    link: "https://github.com/TheSn0wDev/fulgur",
    tags: ["C++", "Robotics", "In development"],
  },
  {
    name: "Next Citizens",
    link: "#",
    tags: ["Lua", "Gaming", "Framework", "Aborted"],
  },
  {
    name: "My RPG",
    link: "https://github.com/TheSn0wDev/my_rpg",
    tags: ["C", "Gaming"],
  },
  {
    name: "Facebook Marketplace Bot",
    link: "https://github.com/TheSn0wDev/facebook-marketplace-bot",
    tags: ["Python", "Backend"],
  },
  {
    name: "pass-gen",
    link: "https://github.com/TheSn0wDev/pass-gen",
    tags: ["Lua", "Utils"],
  },
];

export default function App() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Panel>(null);
  const [highlight, setHighlight] = useState(0);

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setHighlight(0);
      }
      if (open) {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "ArrowDown")
          setHighlight((h) => Math.min(h + 1, filtered.length - 1));
        if (e.key === "ArrowUp") setHighlight((h) => Math.max(h - 1, 0));
        if (e.key === "Enter") {
          const cmd = filtered[highlight];
          if (cmd) handleSelect(cmd.id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.hint && c.hint.toLowerCase().includes(q)) ||
        (typeof c.id === "string" && c.id.includes(q))
    );
  }, [query]);

  function handleSelect(id: Panel) {
    setActive(id);
    setOpen(false);
  }

  return (
    <div className="wrap">
      <AuroraBackground />

      <header className="hero">
        <h1 className="title">
          {"<"}TheSn0wDev{"/>"}
        </h1>
        <p className="subtitle">
          <span className="type">Developer • Entrepreneur</span>
        </p>
        <button
          className="kbtn"
          onClick={() => setOpen(true)}
          aria-label="Open command palette"
        >
          ⌘K / Ctrl+K
        </button>
      </header>

      <main className="grid">
        {!active && <HintCard onOpen={() => setOpen(true)} />}
        {active === "about" && <AboutCard />}
        {active === "projects" && <ProjectsCard />}
        {active === "skills" && <SkillsCard />}
        {active === "contact" && <ContactCard />}
      </main>

      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="palette" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              placeholder="Type to search…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlight(0);
              }}
            />
            <ul>
              {filtered.map((c, i) => (
                <li
                  key={c.id ?? i}
                  className={i === highlight ? "active" : ""}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => handleSelect(c.id)}
                >
                  <span>{c.title}</span>
                  {c.hint && <em>{c.hint}</em>}
                </li>
              ))}
              {filtered.length === 0 && <li className="empty">No results</li>}
            </ul>
            <div className="tips">
              ↑↓ to navigate • Enter to open • Esc to close
            </div>
          </div>
        </div>
      )}

      <footer className="foot">
        © {new Date().getFullYear()} · Made with React + Vite · Hosted on GitHub
        Pages
      </footer>
    </div>
  );
}

function AuroraBackground() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const prefersReduced = (() => {
      try {
        return (
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
      } catch {
        return false;
      }
    })();
    if (prefersReduced) return;

    const blobs = Array.from(root.querySelectorAll<HTMLElement>(".blob"));
    if (blobs.length === 0) return;

    type State = { x: number; y: number; s: number; r: number };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const rand = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const ranges = blobs.map((_, i) => ({
      dx: i % 2 === 0 ? 12 : 16,
      dy: i % 2 === 0 ? 8 : 10,
      sMin: 0.98,
      sMax: 1.08,
      r: 4,
      minDur: 2200,
      maxDur: 5200,
    }));

    const newTarget = (i: number): State => ({
      x: rand(-ranges[i].dx, ranges[i].dx),
      y: rand(-ranges[i].dy, ranges[i].dy),
      s: rand(ranges[i].sMin, ranges[i].sMax),
      r: rand(-ranges[i].r, ranges[i].r),
    });
    const newDuration = (i: number) => rand(ranges[i].minDur, ranges[i].maxDur);

    const from: State[] = blobs.map(() => ({ x: 0, y: 0, s: 1, r: 0 }));
    const to: State[] = blobs.map((_, i) => newTarget(i));
    const start: number[] = blobs.map(() => performance.now() + rand(0, 800));
    const duration: number[] = blobs.map((_, i) => newDuration(i));

    let raf = 0 as number;

    const apply = (i: number, st: State) => {
      const b = blobs[i];
      b.style.transform = `translate(${st.x}%, ${st.y}%) scale(${st.s}) rotate(${st.r}deg)`;
    };

    const tick = (now: number) => {
      for (let i = 0; i < blobs.length; i++) {
        const t = Math.min(1, (now - start[i]) / duration[i]);
        const e = easeInOut(Math.max(0, t));
        apply(i, {
          x: lerp(from[i].x, to[i].x, e),
          y: lerp(from[i].y, to[i].y, e),
          s: lerp(from[i].s, to[i].s, e),
          r: lerp(from[i].r, to[i].r, e),
        });

        if (t >= 1) {
          from[i] = to[i];
          to[i] = newTarget(i);
          duration[i] = newDuration(i);
          start[i] = now;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="aurora" aria-hidden="true">
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <span className="blob b4" />
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card">
      <div className="card-head">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <h2>{title}</h2>
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}

function HintCard({ onOpen }: { onOpen: () => void }) {
  return (
    <Card title="Welcome 👋">
      <p>Open the command palette to browse my portfolio.</p>
      <p>
        <button className="primary" onClick={onOpen}>
          Open ⌘K
        </button>
      </p>
    </Card>
  );
}

function AboutCard() {
  return (
    <Card title="About">
      <p>
        Full‑stack builder who ships fast, clean, and fun‑to‑use stuff. React/
        TypeScript up front; APIs, data, and glue on the back. I care about
        snappy UX, tidy DX, and sensible architecture.
      </p>
      <ul>
        <li>Based in France 🇫🇷</li>
        <li>Domains I vibe with: SaaS 💼, Fintech 💳, Defense 🛡️</li>
        <li>
          Stack highlights: TypeScript, Next.js, Go, Python, C++/Qt, Prisma,
          MySQL, PostgreSQL
        </li>
        <li>Availability: evenings & weekends (full‑time weekdays booked)</li>
      </ul>
      <p>Got a side project, MVP, or spike you want to explore? Let’s jam.</p>
    </Card>
  );
}

function ProjectsCard() {
  return (
    <Card title="Projects">
      <ul className="list">
        {PROJECTS.map((p) => (
          <li key={p.name}>
            <a href={p.link} target="_blank" rel="noreferrer">
              {p.name}
            </a>
            <span className="tags">{p.tags.join(" · ")}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SkillsCard() {
  return (
    <Card title="Skills">
      <div className="pillz">
        {[
          "⚛️ React",
          "▲ Next.js",
          "🟦 TypeScript",
          "🟩 Node.js",
          "🐹 Go",
          "🐍 Python",
          "🧩 C++ / Qt",
          "🧭 Prisma",
          "🐘 PostgreSQL",
          "🐬 MySQL",
          "⚙️ CI/CD",
          "🧪 Testing",
        ].map((s) => (
          <span key={s} className="pill">
            {s}
          </span>
        ))}
      </div>
    </Card>
  );
}

function ContactCard() {
  return (
    <Card title="Contact">
      <div className="contact-links">
        <a className="linkbtn" href="mailto:clement.ozor@protonmail.com">
          ✉️ <span>Email</span>
        </a>
        <a
          className="linkbtn"
          href="https://github.com/TheSn0wDev"
          target="_blank"
          rel="noreferrer"
        >
          🐙 <span>GitHub</span>
        </a>
        <a
          className="linkbtn"
          href="https://www.linkedin.com/in/clement-ozor"
          target="_blank"
          rel="noreferrer"
        >
          💼 <span>LinkedIn</span>
        </a>
      </div>
    </Card>
  );
}
