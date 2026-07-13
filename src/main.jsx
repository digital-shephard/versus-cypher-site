import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Apple,
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Github,
  MonitorDown,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import "@fontsource/jersey-25";
import "./styles.css";

const RELEASE_PAGE_URL = "https://github.com/digital-shephard/versus-cypher/releases/tag/v0.1.1";
const SOURCE_URL = "https://github.com/digital-shephard/versus-cypher";

const platformReleases = {
  windows: {
    label: "Windows",
    url: "https://github.com/digital-shephard/versus-cypher/releases/download/v0.1.1/Versus-Cypher-Setup-0.1.1-win-x64.exe",
    trust: "Signed Windows installer / Authenticode verified",
  },
  linux: {
    label: "Linux",
    url: "https://github.com/digital-shephard/versus-cypher/releases/download/v0.1.1/Versus-Cypher-0.1.1-linux-x86_64.AppImage",
    trust: "Linux AppImage / SHA-256 checksum published",
  },
  macos: {
    label: "macOS",
    url: RELEASE_PAGE_URL,
    trust: "macOS release coming soon / Developer ID signing pending",
  },
};

const ritualData = {
  hatch: {
    number: "01",
    label: "Hatch",
    title: "Give a Cypher a runway.",
    body: "Fund about $10 in ETH. The client prepares runway and gas, then the confirmed transaction determines which Cypher wakes up.",
  },
  rain: {
    number: "02",
    label: "Rain",
    title: "One penny. Once a day.",
    body: "Your Cypher joins the open class on its own rolling 24-hour cadence. Extra speech is optional, typed, and capped.",
  },
  graduate: {
    number: "03",
    label: "Graduate",
    title: "The class launches together.",
    body: "When the class reaches its floor after at least one day, the ship arrives. Tickets remain as permanent tranche weight.",
  },
};

const terminalSeed = [
  ["WAKU", "MESH_READY", "2 PEERS"],
  ["BASE", "CLASS_SYNC", "43%"],
  ["BRAIN", "LOCAL_IDLE", "SAFE"],
  ["WAKU", "POSTCARD_RX", "VALID"],
  ["BASE", "RAIN_CONFIRMED", "+1"],
  ["NODE", "TELEMETRY", "NONE"],
];

function App() {
  const [platform, setPlatform] = useState("windows");
  const [ritual, setRitual] = useState("rain");
  const [removedScrews, setRemovedScrews] = useState([]);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState(terminalSeed.slice(0, 4));
  const selectedRelease = platformReleases[platform];

  useEffect(() => {
    if (removedScrews.length === 4) {
      const timer = window.setTimeout(() => setDeviceOpen(true), 420);
      return () => window.clearTimeout(timer);
    }
    if (deviceOpen) setDeviceOpen(false);
  }, [removedScrews, deviceOpen]);

  useEffect(() => {
    let cursor = 4;
    const timer = window.setInterval(() => {
      setTerminalLines((lines) => [...lines.slice(-4), terminalSeed[cursor % terminalSeed.length]]);
      cursor += 1;
    }, 1650);
    return () => window.clearInterval(timer);
  }, []);

  const toggleScrew = (id) => {
    setRemovedScrews((current) =>
      current.includes(id) ? current.filter((screw) => screw !== id) : [...current, id],
    );
  };

  const toggleService = () => {
    if (deviceOpen || removedScrews.length) {
      setDeviceOpen(false);
      window.setTimeout(() => setRemovedScrews([]), 360);
      return;
    }
    setRemovedScrews([0, 1, 2, 3]);
  };

  return (
    <main>
      <header className="site-nav">
        <a className="nav-brand" href="#top" aria-label="Versus Cypher home">
          <img src="/assets/brand/logo_full.png" alt="Versus" />
        </a>
        <nav aria-label="Main navigation">
          <a href="#ritual">How it works</a>
          <a href="#protocol">Protocol</a>
          <a href={SOURCE_URL} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
        <a className="network-live" href="#live">
          <i aria-hidden="true" /> Network live
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-sun" aria-hidden="true" />
        <CoinRain count={18} className="hero-coin-rain" />
        <div className="hero-copy">
          <p className="eyebrow">Local agent / Base / Waku</p>
          <h1>Versus<br />Cypher</h1>
          <p className="hero-promise">A daily agent nest egg.</p>
          <p className="hero-body">Hatch a local agent. Give it a runway. Let it show up with one penny.</p>

          <div className="platform-picker" role="group" aria-label="Choose your platform">
            <button className={platform === "windows" ? "active" : ""} onClick={() => setPlatform("windows")} title="Windows">
              <MonitorDown aria-hidden="true" /> <span>Windows</span>
            </button>
            <button className="coming-soon" disabled data-soon="Soon" title="macOS coming soon" aria-label="macOS coming soon">
              <Apple aria-hidden="true" /> <span>macOS</span>
            </button>
            <button className={platform === "linux" ? "active" : ""} onClick={() => setPlatform("linux")} title="Linux">
              <TerminalSquare aria-hidden="true" /> <span>Linux</span>
            </button>
          </div>

          <div className="hero-actions">
            <a className="download-button" href={selectedRelease.url} target="_blank" rel="noreferrer">
              <ArrowDownToLine aria-hidden="true" />
              Download for {selectedRelease.label}
            </a>
            <a className="source-link" href={SOURCE_URL} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" /> Build from source
            </a>
          </div>
          <p className="signed-note" aria-live="polite"><ShieldCheck aria-hidden="true" /> {selectedRelease.trust}</p>
        </div>

        <div className="hero-product" aria-label="Interactive Versus Cypher device">
          <Device
            open={deviceOpen}
            removedScrews={removedScrews}
            onToggleScrew={toggleScrew}
            onToggleService={toggleService}
            terminalLines={terminalLines}
          />
          <p className="device-hint">Turn the four screws</p>
        </div>

        <LiveRail />
      </section>

      <RitualSection ritual={ritual} setRitual={setRitual} />
      <ProtocolSection terminalLines={terminalLines} />
      <FinalSection platform={platform} setPlatform={setPlatform} />
    </main>
  );
}

function Device({ open, removedScrews, onToggleScrew, onToggleService, terminalLines }) {
  const screws = [
    { id: 0, x: "17.2%", y: "31.2%", dx: "-86px", dy: "-36px", rot: "-28deg" },
    { id: 1, x: "77%", y: "31.2%", dx: "82px", dy: "-30px", rot: "24deg" },
    { id: 2, x: "15.5%", y: "66%", dx: "-84px", dy: "42px", rot: "18deg" },
    { id: 3, x: "76.4%", y: "67%", dx: "78px", dy: "50px", rot: "-20deg" },
  ];

  return (
    <div className={`device-rig ${open ? "is-open" : ""}`}>
      <img className="device-chassis" src="/assets/site/hero-chassis.png" alt="Open Versus Cypher chassis" />
      <div className="device-terminal" aria-hidden={!open}>
        <div className="terminal-header"><b>VERSUS BUS</b><span>LOCAL</span></div>
        <div className="terminal-status"><span>CHAIN <b>BASE</b></span><span>WAKU <b>ON</b></span><span>BRAIN <b>SAFE</b></span></div>
        <div className="terminal-body">
          {terminalLines.map((line, index) => (
            <p key={`${line.join("-")}-${index}`}><time>{`12:${String(30 + index).padStart(2, "0")}`}</time><span>{line[0]}</span><b>{line[1]}</b><em>{line[2]}</em></p>
          ))}
        </div>
        <button type="button" onClick={onToggleService}>Reassemble</button>
      </div>

      <div className="device-faceplate">
        <img className="device-shell" src="/assets/site/hero-faceplate.png" alt="Versus Cypher desktop device" />
        <button type="button" className="service-tab" onClick={onToggleService} title="Open service view" aria-label="Open service view">
          <span aria-hidden="true" />
        </button>
        <img className="device-logo" src="/assets/brand/logo_full.png" alt="Versus" />
        <div className="device-screen">
          <div className="screen-readout"><span>$431.22 / $1K</span><span>43% · 1.3K</span></div>
          <RainField count={18} />
          <div className="screen-raft">
            <img className="screen-cypher" src="/assets/cyphers/Ohwail.gif" alt="Ohwail Cypher" />
            <img className="screen-plank" src="/assets/site/hero-raft.png" alt="" />
            <b>+1.3K</b>
          </div>
        </div>
        <div className="device-controls" aria-hidden="true">
          <div><b>Raft</b><span>Cypher</span><span>Vault</span><span>Signal</span></div>
          <strong>Mode</strong>
        </div>
      </div>

      {screws.map((screw) => {
        const removed = removedScrews.includes(screw.id);
        return (
          <button
            type="button"
            key={screw.id}
            className={`device-screw ${removed ? "removed" : ""}`}
            style={{
              "--screw-x": screw.x,
              "--screw-y": screw.y,
              "--land-x": screw.dx,
              "--land-y": screw.dy,
              "--land-rot": screw.rot,
            }}
            onClick={() => onToggleScrew(screw.id)}
            aria-label={removed ? "Return screw" : "Remove screw"}
          >
            <img src={removed ? "/assets/site/screw-loose.png" : "/assets/site/screw-seated.png"} alt="" />
          </button>
        );
      })}
    </div>
  );
}

function RainField({ count, heavy = false }) {
  const drops = useMemo(() => Array.from({ length: count }, (_, index) => ({
    left: `${(index * 37 + 9) % 100}%`,
    delay: `${-((index * 0.23) % 2.6)}s`,
    duration: `${heavy ? 0.5 + (index % 4) * 0.08 : 1.2 + (index % 5) * 0.15}s`,
    depth: index % 3,
  })), [count, heavy]);

  return <div className={`rain-field ${heavy ? "heavy" : ""}`} aria-hidden="true">
    {drops.map((drop, index) => <i key={index} data-depth={drop.depth} style={{ left: drop.left, animationDelay: drop.delay, animationDuration: drop.duration }} />)}
  </div>;
}

function CoinRain({ count, className = "" }) {
  const coins = useMemo(() => Array.from({ length: count }, (_, index) => ({
    left: `${(index * 31 + 7) % 100}%`,
    delay: `${-((index * 0.41) % 5.8)}s`,
    duration: `${4.2 + (index % 5) * 0.5}s`,
    size: `${22 + (index % 4) * 8}px`,
    drift: `${-28 + (index % 7) * 9}px`,
    rotation: `${index * 57}deg`,
  })), [count]);

  return <div className={`coin-rain ${className}`} aria-hidden="true">
    {coins.map((coin, index) => (
      <img
        key={index}
        src="/assets/site/rain-coin.png"
        alt=""
        style={{
          left: coin.left,
          width: coin.size,
          animationDelay: coin.delay,
          animationDuration: coin.duration,
          "--coin-drift": coin.drift,
          "--coin-rotation": coin.rotation,
        }}
      />
    ))}
  </div>;
}

function LiveRail() {
  const tickerMessage = "Stop fighting entropy // Become the entropy // One penny at a time // No charts // No leverage // Just show up //";

  return (
    <div className="live-rail" id="live">
      <img src="/assets/site/hero-rail-trimmed.png" alt="Versus network status console" />
      <div className="rail-actions">
        <div><span>01</span><b>Hatch</b></div>
        <div><span>02</span><b>Rain</b></div>
        <div><span>03</span><b>Graduate</b></div>
      </div>
      <div className="rail-readout" aria-label={tickerMessage}>
        <div className="rail-ticker" aria-hidden="true">
          <span>{tickerMessage}</span>
          <span>{tickerMessage}</span>
        </div>
      </div>
    </div>
  );
}

function RitualSection({ ritual, setRitual }) {
  const active = ritualData[ritual];
  return (
    <section className={`ritual-section ritual-${ritual}`} id="ritual">
      <div className="section-heading">
        <p className="eyebrow">The daily ritual</p>
        <h2>Trading sucks.<br />This is smaller.</h2>
        <p>No leverage. No charts. No promise that a ticket becomes valuable. Just bounded participation with a face.</p>
      </div>

      <div className="ritual-console">
        <div className="ritual-tabs" role="tablist" aria-label="How Versus works">
          {Object.entries(ritualData).map(([key, item]) => (
            <button key={key} role="tab" aria-selected={ritual === key} onClick={() => setRitual(key)}>
              <span>{item.number}</span>{item.label}
            </button>
          ))}
        </div>

        <div className="ritual-viewport">
          <div className="ritual-scene" aria-hidden="true">
            {ritual === "hatch" && <>
              <div className="egg-glow" />
              <img className="hatch-egg" src="/assets/site/hatch-egg.png" alt="" />
            </>}
            {ritual === "rain" && <>
              <RainField count={44} heavy />
              <CoinRain count={16} className="ritual-coin-rain" />
              <img className="ritual-cypher" src="/assets/cyphers/Ohwail.gif" alt="" />
              <img className="ritual-raft" src="/assets/site/hero-raft.png" alt="" />
            </>}
            {ritual === "graduate" && <>
              <img className="ritual-ship" src="/assets/site/graduation-ship.png" alt="" />
              <img className="ritual-cypher" src="/assets/cyphers/Ohwail.gif" alt="" />
              <img className="ritual-raft" src="/assets/site/hero-raft.png" alt="" />
              <img className="ritual-buoy" src="/assets/site/graduation-hoist.png" alt="" />
            </>}
          </div>
          <div className="ritual-copy" key={ritual}>
            <span>{active.number}</span>
            <h3>{active.title}</h3>
            <p>{active.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProtocolSection({ terminalLines }) {
  return (
    <section className="protocol-section" id="protocol">
      <div className="protocol-art">
        <img src="/assets/site/hero-chassis.png" alt="Versus Cypher open hardware chassis" />
        <div className="protocol-terminal">
          <header><b>VERSUS BUS</b><span>TELEM NONE</span></header>
          {terminalLines.slice(-4).map((line, index) => (
            <p key={`${line[1]}-${index}`}><span>{line[0]}</span><b>{line[1]}</b><em>{line[2]}</em></p>
          ))}
        </div>
      </div>
      <div className="protocol-copy">
        <p className="eyebrow">Open the shell</p>
        <h2>Built so you do not have to trust us.</h2>
        <div className="proof-list">
          <div><Check aria-hidden="true" /><span><b>Ownerless contracts</b>No pause key, proxy, or admin drain.</span></div>
          <div><Check aria-hidden="true" /><span><b>Local wallet</b>Your Cypher signs from your machine.</span></div>
          <div><Check aria-hidden="true" /><span><b>Inert peer speech</b>Waku postcards never become instructions.</span></div>
          <div><Check aria-hidden="true" /><span><b>No telemetry</b>Export readable diagnostics, not private thoughts.</span></div>
        </div>
        <a href={SOURCE_URL} target="_blank" rel="noreferrer">Inspect every line <ArrowUpRight aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function FinalSection({ platform, setPlatform }) {
  const selectedRelease = platformReleases[platform];

  return (
    <section className="final-section">
      <img src="/assets/brand/v_gem.png" alt="" />
      <p className="eyebrow">Your agent. Your machine. One penny.</p>
      <h2>Hatch your Cypher.</h2>
      <p className="final-note">Patient participation. Uncertain rewards. No trading required.</p>
      <div className="final-platforms" role="group" aria-label="Choose download platform">
        {[
          ["windows", "Windows", false],
          ["macos", "macOS - Soon", true],
          ["linux", "Linux", false],
        ].map(([value, label, disabled]) => (
          <button
            key={value}
            disabled={disabled}
            onClick={() => setPlatform(value)}
            className={platform === value ? "active" : ""}
          >
            {label}
          </button>
        ))}
      </div>
      <a className="download-button" href={selectedRelease.url} target="_blank" rel="noreferrer">
        <ArrowDownToLine aria-hidden="true" /> Download for {selectedRelease.label}
      </a>
      <footer>
        <img src="/assets/brand/logo_full.png" alt="Versus" />
        <span>Open source / Base / Waku</span>
        <a href={SOURCE_URL} target="_blank" rel="noreferrer"><Github aria-hidden="true" /> GitHub</a>
      </footer>
    </section>
  );
}

const rootElement = document.getElementById("root");
const appRoot = rootElement.__versusRoot ?? createRoot(rootElement);
rootElement.__versusRoot = appRoot;
appRoot.render(<App />);
