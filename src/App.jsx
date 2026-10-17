import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Sprout, ArrowUpRight, ArrowDown, Menu, X, Droplets, Waves, Thermometer,
  Sun, Wind, Activity, BrainCircuit, Radio, Cpu, ShieldCheck, Gauge,
  ChevronDown, CheckCircle2, Zap, Leaf, CircleHelp, RotateCcw, Orbit, ScanLine, Sparkles
} from "lucide-react";

const ASSET = "/assets/";
const crops = [
  // Seasonal water needs (mm/season) are indicative FAO ranges where published;
  // crop coefficients are representative mid-season planning values.
  { name: "Rice", kc: 1.15, min: 450, max: 700, note: "Paddy water management also depends on seepage, percolation and field preparation.", icon: "🌾", source: "FAO indicative seasonal range" },
  { name: "Wheat", kc: 1.15, min: 450, max: 650, note: "Prioritise moisture near flowering and grain filling.", icon: "🌱", source: "FAO barley/oats/wheat range" },
  { name: "Tomato", kc: 1.15, min: 400, max: 800, note: "Avoid large moisture swings around flowering and fruiting.", icon: "🍅", source: "FAO indicative seasonal range" },
  { name: "Maize", kc: 1.15, min: 500, max: 800, note: "Water demand is especially important around tasselling and silking.", icon: "🌽", source: "FAO indicative seasonal range" },
  { name: "Cotton", kc: 1.15, min: 700, max: 1300, note: "Use soil readings and local weather to avoid over-irrigation.", icon: "🌿", source: "FAO indicative seasonal range" },
  { name: "Sugarcane", kc: 1.20, min: 1500, max: 2500, note: "Long growing duration makes local climate and variety important.", icon: "🎋", source: "FAO indicative seasonal range" },
  { name: "Banana", kc: 1.10, min: 1200, max: 2200, note: "High water demand; keep root-zone moisture steady.", icon: "🍌", source: "FAO indicative seasonal range" },
  { name: "Potato", kc: 1.15, min: 500, max: 700, note: "Avoid water stress during tuber initiation and bulking.", icon: "🥔", source: "FAO indicative seasonal range" },
  { name: "Onion", kc: 1.05, min: 350, max: 550, note: "Shallow roots benefit from careful, frequent moisture checks.", icon: "🧅", source: "FAO indicative seasonal range" },
  { name: "Cabbage", kc: 1.05, min: 350, max: 500, note: "Maintain consistent moisture during head formation.", icon: "🥬", source: "FAO indicative seasonal range" },
  { name: "Carrot", kc: 1.05, min: 350, max: 550, note: "Even soil moisture supports root development and quality.", icon: "🥕", source: "FAO grouped crop coefficient; seasonal range indicative" },
  { name: "Citrus", kc: 0.70, min: 900, max: 1200, note: "Demand varies by tree age, canopy, season and local climate.", icon: "🍊", source: "FAO indicative seasonal range" },
  { name: "Melon", kc: 1.00, min: 400, max: 600, note: "Pay attention to fruit set and fruit enlargement.", icon: "🍈", source: "FAO indicative seasonal range" },
  { name: "Peanut", kc: 1.05, min: 500, max: 700, note: "Avoid moisture stress during pegging and pod filling.", icon: "🥜", source: "FAO indicative seasonal range" },
  { name: "Pea", kc: 1.15, min: 350, max: 500, note: "Water needs rise during flowering and pod development.", icon: "🫛", source: "FAO indicative seasonal range" },
  { name: "Pepper", kc: 1.05, min: 600, max: 900, note: "Steady moisture supports flowering and fruit quality.", icon: "🫑", source: "FAO indicative seasonal range" },
  { name: "Sorghum", kc: 1.10, min: 450, max: 650, note: "More drought tolerant than many crops, but establishment matters.", icon: "🌾", source: "FAO sorghum/millet range" },
  { name: "Millet", kc: 1.10, min: 450, max: 650, note: "A relatively drought-tolerant cereal; avoid unnecessary watering.", icon: "🌾", source: "FAO sorghum/millet range" },
  { name: "Soybean", kc: 1.10, min: 450, max: 700, note: "Flowering and pod filling are sensitive periods for water stress.", icon: "🫘", source: "FAO indicative seasonal range" },
  { name: "Sugarbeet", kc: 1.15, min: 550, max: 750, note: "Maintain adequate moisture during canopy and root growth.", icon: "🌱", source: "FAO indicative seasonal range" },
  { name: "Sunflower", kc: 1.15, min: 600, max: 1000, note: "Monitor moisture through flowering and seed filling.", icon: "🌻", source: "FAO indicative seasonal range" },
  { name: "Alfalfa", kc: 0.95, min: 800, max: 1600, note: "Water use varies with cutting frequency and regrowth.", icon: "🌿", source: "FAO indicative seasonal range" },
  { name: "Barley", kc: 1.15, min: 450, max: 650, note: "Plan around establishment, stem extension and grain filling.", icon: "🌾", source: "FAO grouped cereal range" },
  { name: "Oats", kc: 1.15, min: 450, max: 650, note: "Season length and climate strongly affect total demand.", icon: "🌾", source: "FAO grouped cereal range" },
  { name: "Lentil", kc: 1.10, min: 300, max: 500, note: "Avoid excess irrigation; focus on flowering and pod set.", icon: "🫘", source: "FAO pulse coefficient; seasonal range indicative" },
  { name: "Chickpea", kc: 1.00, min: 300, max: 500, note: "Generally moderate water demand; avoid waterlogging.", icon: "🫘", source: "Indicative planning range; local guidance recommended" },
  { name: "Green gram", kc: 1.05, min: 300, max: 450, note: "Critical moisture periods include flowering and pod formation.", icon: "🫘", source: "Indicative planning range; local guidance recommended" },
  { name: "Black gram", kc: 1.05, min: 300, max: 450, note: "Adjust irrigation to rainfall, soil texture and crop stage.", icon: "🫘", source: "Indicative planning range; local guidance recommended" },
  { name: "Pigeon pea", kc: 1.00, min: 500, max: 800, note: "Deep roots help later in the season, once established.", icon: "🌿", source: "Indicative planning range; local guidance recommended" },
  { name: "Mustard", kc: 1.00, min: 300, max: 500, note: "Flowering and pod development are useful stages to monitor.", icon: "🌼", source: "Indicative planning range; local guidance recommended" },
  { name: "Rapeseed", kc: 1.00, min: 350, max: 550, note: "Water demand changes with canopy growth and seed formation.", icon: "🌼", source: "FAO-56 crop coefficient approach; seasonal range indicative" },
  { name: "Canola", kc: 1.00, min: 350, max: 550, note: "Use local crop calendars to interpret seasonal totals.", icon: "🌼", source: "FAO-56 crop coefficient approach; seasonal range indicative" },
  { name: "Sesame", kc: 1.10, min: 300, max: 500, note: "Sensitive to waterlogging; irrigate based on soil conditions.", icon: "🌱", source: "FAO-56 crop coefficient approach; seasonal range indicative" },
  { name: "Safflower", kc: 1.00, min: 400, max: 600, note: "Relatively resilient once established; monitor during flowering.", icon: "🌼", source: "FAO-56 crop coefficient approach; seasonal range indicative" },
  { name: "Flax", kc: 1.10, min: 400, max: 600, note: "Avoid stress during rapid growth and flowering.", icon: "🌿", source: "FAO grouped crop coefficient; seasonal range indicative" },
  { name: "Spinach", kc: 1.00, min: 250, max: 400, note: "Shallow roots and fast growth favour regular moisture checks.", icon: "🥬", source: "FAO grouped crop coefficient; seasonal range indicative" },
  { name: "Lettuce", kc: 1.00, min: 250, max: 400, note: "Keep the root zone evenly moist without saturating the soil.", icon: "🥬", source: "FAO grouped crop coefficient; seasonal range indicative" },
  { name: "Cucumber", kc: 0.90, min: 400, max: 700, note: "Demand increases as the vine canopy expands and fruits develop.", icon: "🥒", source: "FAO grouped crop coefficient; seasonal range indicative" },
  { name: "Pumpkin", kc: 1.00, min: 400, max: 700, note: "Check moisture through flowering and fruit enlargement.", icon: "🎃", source: "FAO grouped crop coefficient; seasonal range indicative" },
  { name: "Eggplant", kc: 1.15, min: 450, max: 800, note: "Consistent moisture helps flowering and fruit development.", icon: "🍆", source: "FAO grouped crop coefficient; seasonal range indicative" },
  { name: "Cauliflower", kc: 1.05, min: 350, max: 550, note: "Avoid moisture stress while the curd is developing.", icon: "🥦", source: "FAO grouped crop coefficient; seasonal range indicative" },
  { name: "Broccoli", kc: 1.05, min: 350, max: 550, note: "Maintain steady soil moisture during head formation.", icon: "🥦", source: "FAO grouped crop coefficient; seasonal range indicative" },
  { name: "Garlic", kc: 1.00, min: 350, max: 550, note: "Reduce irrigation near maturity according to local practice.", icon: "🧄", source: "FAO grouped allium coefficient; seasonal range indicative" },
  { name: "Sweet corn", kc: 1.15, min: 500, max: 800, note: "Water stress around silking can affect ear development.", icon: "🌽", source: "FAO indicative maize range" },
  { name: "Groundnut", kc: 1.05, min: 500, max: 700, note: "Keep moisture adequate during pegging and pod filling.", icon: "🥜", source: "FAO indicative peanut range" },
  { name: "Grapes", kc: 0.85, min: 500, max: 800, note: "Irrigation strategy depends on variety, training and wine/table use.", icon: "🍇", source: "FAO-56 perennial crop approach; seasonal range indicative" },
  { name: "Olive", kc: 0.70, min: 450, max: 800, note: "Drought tolerance is notable, but commercial yields depend on timing.", icon: "🫒", source: "FAO-56 perennial crop approach; seasonal range indicative" },
  { name: "Coffee", kc: 0.90, min: 900, max: 1500, note: "Needs vary widely with shade, rainfall, elevation and cultivar.", icon: "☕", source: "FAO special-crop guidance; seasonal range indicative" },
  { name: "Tea", kc: 1.00, min: 900, max: 1600, note: "Use regional guidance because climate and pruning cycles matter.", icon: "🍃", source: "FAO special-crop guidance; seasonal range indicative" },
  { name: "Mango", kc: 0.85, min: 700, max: 1200, note: "Water management changes with tree age and flowering strategy.", icon: "🥭", source: "Indicative perennial-crop range; local guidance recommended" },
];
const steps = [
  { n: "01", title: "Sense the soil", desc: "A capacitive soil-moisture sensor measures conditions near the root zone. Optional temperature and humidity sensors add context.", icon: Droplets, tag: "ESP32 + SENSORS" },
  { n: "02", title: "Transmit the readings", desc: "An ESP32 collects sensor data. LoRa can relay readings from remote plots to a gateway when Wi-Fi is unavailable.", icon: Radio, tag: "WIRELESS TELEMETRY" },
  { n: "03", title: "Estimate crop demand", desc: "FAO-56 crop-water methods estimate evapotranspiration from weather inputs and crop growth stage.", icon: Sun, tag: "FAO-56 + WEATHER" },
  { n: "04", title: "Recommend, then act", desc: "A Random Forest model can supplement the rules with patterns learned from labelled historical data. Safety rules remain in control.", icon: BrainCircuit, tag: "DECISION ENGINE" },
];
function Reveal({ children, className = "", delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: .68, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moisture, setMoisture] = useState(31);
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(54);
  const [crop, setCrop] = useState(() => { try { return localStorage.getItem("verdant-selected-crop") || "Rice"; } catch { return "Rice"; } });
  const [cropQuery, setCropQuery] = useState("");
  const [savedCrop, setSavedCrop] = useState(() => { try { return JSON.parse(localStorage.getItem("verdant-crop-history") || "[]"); } catch { return []; } });
  const [typedText, setTypedText] = useState("");
  const [activeZone, setActiveZone] = useState(1);
  const [faqOpen, setFaqOpen] = useState(0);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name: "", email: "", crop: "Rice", message: "" });
  const { scrollYProgress } = useScroll();
  const cropData = crops.find(c => c.name === crop) || crops[0];
  const matchedCrop = cropQuery.trim() ? (crops.find(c => c.name.toLowerCase() === cropQuery.trim().toLowerCase()) || crops.find(c => c.name.toLowerCase().includes(cropQuery.trim().toLowerCase()))) : null;
  useEffect(() => { try { localStorage.setItem("verdant-selected-crop", crop); } catch {} }, [crop]);
  useEffect(() => { try { if (!localStorage.getItem("verdant-crop-library")) localStorage.setItem("verdant-crop-library", JSON.stringify(crops)); } catch {} }, []);
  useEffect(() => {
    const phrase = "Let the soil speak. Water with purpose.";
    let i = 0; setTypedText("");
    const timer = setInterval(() => { i += 1; setTypedText(phrase.slice(0, i)); if (i >= phrase.length) clearInterval(timer); }, 58);
    return () => clearInterval(timer);
  }, []);
  const saveCropProfile = (item) => {
    const record = { name: item.name, kc: item.kc, min: item.min, max: item.max, source: item.source, savedAt: new Date().toISOString() };
    const next = [record, ...savedCrop.filter(x => x.name !== item.name)].slice(0, 50);
    setSavedCrop(next);
    try { localStorage.setItem("verdant-crop-history", JSON.stringify(next)); } catch {}
    setCrop(item.name); setToast(`${item.name} crop profile saved on this device.`);
  };
  const recommendation = useMemo(() => {
    if (moisture < 25) return { state: "Irrigation recommended", tone: "urgent", reason: "Soil moisture is below the illustrative root-zone threshold. Check the sensor and irrigate if field conditions agree.", amount: "HIGH PRIORITY" };
    if (moisture < 40) return { state: "Plan irrigation soon", tone: "watch", reason: "Moisture is trending low for this demo profile. Consider crop stage, recent rain and the next reading.", amount: "MONITOR CLOSELY" };
    return { state: "No irrigation needed yet", tone: "good", reason: "Moisture is above the demo threshold. Recheck after weather changes and keep monitoring the root zone.", amount: "HOLD & MONITOR" };
  }, [moisture]);
  const resetDemo = () => { setMoisture(31); setTemperature(28); setHumidity(54); setCrop("Rice"); };
  const submitForm = e => {
    e.preventDefault();
    const request = { ...form, createdAt: new Date().toISOString(), source: "Verdant Irrigation demo" };
    try {
      const existing = JSON.parse(localStorage.getItem("verdant-irrigation-requests") || "[]");
      localStorage.setItem("verdant-irrigation-requests", JSON.stringify([...existing, request]));
      setToast("Your demo request is saved in this browser.");
      setForm({ name: "", email: "", crop: "Rice", message: "" });
    } catch { setToast("Your browser could not save this request. Please email the project team directly."); }
  };
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  return <div className="site-shell">
    <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
    <header className="topbar">
      <a className="brand" href="#home" onClick={() => setMenuOpen(false)}><span className="brand-icon"><Sprout size={20}/></span><span>VERDANT<span className="brand-period">.</span><small>SMART IRRIGATION SYSTEM</small></span></a>
      <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
        <a href="#system" onClick={() => setMenuOpen(false)}>How it works</a>
        <a href="#technology" onClick={() => setMenuOpen(false)}>Technology</a>
        <a href="#dashboard" onClick={() => setMenuOpen(false)}>Live demo</a>
        <a href="#impact" onClick={() => setMenuOpen(false)}>Objectives</a>
      </nav>
      <a className="nav-button" href="#dashboard">Explore dashboard <ArrowUpRight size={15}/></a>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster={ASSET + "hero-farm.jpg"} aria-label="Aerial view of agricultural fields">
          <source src="https://videos.pexels.com/video-files/15365299/15365299-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-photo" />
        <div className="hero-shade" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .12 }}>
            <div className="eyebrow eyebrow-light"><span className="live-dot"/> IoT · CROP WATER INTELLIGENCE · 2026</div>
            <h1>Water when<br/>the <em>crop needs it.</em></h1><p className="typewriter-line"><span>{typedText}</span><i aria-hidden="true">|</i></p>
            <p className="hero-lede">A smarter irrigation workflow combining soil sensing, wireless monitoring and explainable recommendations—built to make every drop count.</p>
            <div className="hero-actions"><a className="button button-lime" href="#dashboard">Try the live demo <ArrowDown size={16}/></a><a className="text-button" href="#system">Explore the system <ArrowUpRight size={16}/></a></div>
          </motion.div>
          <motion.div className="hero-console" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .4 }}>
            <div className="console-top"><span><span className="live-dot"/> FIELD SNAPSHOT</span><span className="console-id">ZONE / 01</span></div>
            <div className="console-main"><div className="moisture-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="49"/><circle className="ring-value" cx="60" cy="60" r="49" strokeDasharray="308" strokeDashoffset="212"/></svg><div><strong>31<small>%</small></strong><span>SOIL MOISTURE</span></div></div><div className="console-status"><span className="status-pill status-watch">● MONITOR</span><h3>Moisture is trending low</h3><p>Illustrative sensor reading. Connect hardware to display real field data.</p></div></div>
            <div className="console-metrics"><div><Thermometer/><span>Air temperature</span><strong>28°C</strong></div><div><Waves/><span>Relative humidity</span><strong>54%</strong></div><div><Activity/><span>System status</span><strong className="online">Demo online</strong></div></div>
          </motion.div>
        </div>
        <motion.div className="hero-float-chip chip-sensor" initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} transition={{delay:.9,duration:.7}}><span className="chip-icon"><Waves size={15}/></span><span><small>ROOT ZONE</small><strong>Moisture sensing</strong></span><span className="chip-live"><i/> LIVE DEMO</span></motion.div>
        <motion.div className="hero-float-chip chip-ai" animate={{y:[0,-8,0],rotate:[0,1,0]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}><span className="chip-icon"><Orbit size={16}/></span><span><small>DECISION ENGINE</small><strong>Sensor + crop context</strong></span><Sparkles size={15} className="chip-spark"/></motion.div>
        <div className="hero-scan-line" aria-hidden="true" />
        <div className="hero-foot"><span>01 / PRECISION WATER MANAGEMENT</span><span>MONITOR → ANALYSE → DECIDE</span><a href="#system" aria-label="Scroll to system"><ArrowDown size={17}/></a></div>
      </section>

      <section className="intro section-pad stack-panel" id="system">
        <Reveal className="intro-heading"><p className="eyebrow">THE CHALLENGE</p><h2>Fixed schedules can't<br/>read <em>changing fields.</em></h2></Reveal>
        <Reveal className="intro-body" delay={.1}><p>Traditional irrigation often depends on a calendar or a farmer's visual observation. But soil moisture, crop stage and weather change every day. Water can be wasted—or crops can miss it when they need it most.</p><p className="intro-emphasis"><Sprout size={18}/> Our approach turns field readings into a timely, explainable irrigation recommendation.</p></Reveal>
      </section>

      <section className="field-story section-pad stack-panel" aria-label="Precision agriculture in the field">
        <Reveal className="field-story-head"><div><p className="eyebrow">FROM ROOTS TO REAL-TIME INSIGHT</p><h2>Technology that<br/><em>gets its hands dirty.</em></h2></div><p>Healthy crops begin below the surface. Verdant connects what is happening in the root zone with clear, timely decisions above ground.</p></Reveal>
        <div className="story-gallery">
          <motion.article className="story-tile story-tile-large" initial={{opacity:0,y:45,rotate:-1.5}} whileInView={{opacity:1,y:0,rotate:0}} viewport={{once:true,amount:.2}} transition={{duration:.8,ease:[.22,1,.36,1]}} whileHover={{y:-9,rotate:.3}}>
            <img src={ASSET + "precision-crops.jpg"} alt="Rows of healthy crops growing across a precision-managed field" loading="lazy"/><div className="story-overlay"><span className="story-index">FIELD NOTE / 01</span><h3>Every field tells<br/>a different story.</h3><p>Crop-aware monitoring, plot by plot.</p></div><span className="story-corner"><ArrowUpRight size={20}/></span>
          </motion.article>
          <motion.article className="story-tile story-tile-tall" initial={{opacity:0,y:45}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.8,delay:.12,ease:[.22,1,.36,1]}} whileHover={{y:-9}}>
            <img src={ASSET + "soil-roots.jpg"} alt="Plant roots in rich soil showing the root zone where moisture matters" loading="lazy"/><div className="story-overlay"><span className="story-index">FIELD NOTE / 02</span><h3>Look beneath<br/>the surface.</h3><p>Root-zone moisture is a signal worth listening to.</p></div><span className="story-corner"><Droplets size={20}/></span>
          </motion.article>
          <motion.article className="story-tile story-tile-wide" initial={{opacity:0,y:45}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.8,delay:.22,ease:[.22,1,.36,1]}} whileHover={{y:-9}}>
            <img src={ASSET + "tractor-field.jpg"} alt="Agricultural field operations supported by precision farming" loading="lazy"/><div className="story-overlay"><span className="story-index">FIELD NOTE / 03</span><h3>From observation<br/>to action.</h3><p>Practical recommendations for real farming workflows.</p></div><span className="story-corner"><Activity size={20}/></span>
          </motion.article>
        </div>
        <div className="ticker-band" aria-label="System capabilities"><div className="ticker-track">{Array.from({length:2},(_,i)=><span className="ticker-set" key={i}><b>SOIL MOISTURE</b><i>✳</i><b>ESP32 + LORA</b><i>✳</i><b>FAO-56</b><i>✳</i><b>RANDOM FOREST</b><i>✳</i><b>CROP-AWARE DECISIONS</b><i>✳</i></span>)}</div></div>
      </section>

      <section className="dashboard-section section-pad stack-panel" id="dashboard">
        <Reveal className="section-title-row"><div><p className="eyebrow eyebrow-light">INTERACTIVE PROJECT DEMO</p><h2>Your field.<br/><em>Your next decision.</em></h2></div><div className="demo-label"><span className="live-dot"/> SIMULATED SENSOR DATA <span className="demo-badge">NOT HARDWARE CONNECTED</span></div></Reveal>
        <div className="dashboard-grid">
          <div className="control-panel">
            <div className="panel-heading"><div><span className="panel-kicker">FIELD CONTROLS</span><h3>Sensor simulator</h3></div><button className="icon-button" onClick={resetDemo} aria-label="Reset sensor simulator"><RotateCcw size={16}/></button></div>
            <label className="field-label" htmlFor="crop-select">Crop type</label>
            <select id="crop-select" className="crop-select" value={crop} onChange={e => setCrop(e.target.value)}>{crops.map(c => <option key={c.name}>{c.name}</option>)}</select>
            <div className="slider-control"><div className="slider-label"><label htmlFor="moisture">Soil moisture</label><strong>{moisture}<small>%</small></strong></div><input id="moisture" type="range" min="5" max="80" value={moisture} onChange={e => setMoisture(Number(e.target.value))} style={{ "--range": `${((moisture - 5) / 75) * 100}%` }}/><div className="range-ends"><span>Very dry</span><span>Moist</span></div></div>
            <div className="slider-control"><div className="slider-label"><label htmlFor="temperature">Air temperature</label><strong>{temperature}<small>°C</small></strong></div><input id="temperature" type="range" min="10" max="45" value={temperature} onChange={e => setTemperature(Number(e.target.value))} style={{ "--range": `${((temperature - 10) / 35) * 100}%` }}/><div className="range-ends"><span>10°C</span><span>45°C</span></div></div>
            <div className="slider-control"><div className="slider-label"><label htmlFor="humidity">Relative humidity</label><strong>{humidity}<small>%</small></strong></div><input id="humidity" type="range" min="15" max="95" value={humidity} onChange={e => setHumidity(Number(e.target.value))} style={{ "--range": `${((humidity - 15) / 80) * 100}%` }}/><div className="range-ends"><span>15%</span><span>95%</span></div></div>
            <p className="sim-note"><CircleHelp size={14}/> Adjust the values to see the recommendation update instantly. These are simulated inputs, not live sensor readings.</p>
          </div>
          <div className="readings-panel">
            <div className="panel-heading"><div><span className="panel-kicker">ZONE 01 / ROOT ZONE</span><h3>Current conditions</h3></div><span className="read-time">JUST NOW</span></div>
            <div className="reading-cards">
              <div className="reading-card moisture-card"><span className="reading-icon"><Droplets size={17}/></span><span className="reading-name">Soil moisture</span><strong>{moisture}<small>%</small></strong><div className="meter"><span style={{width:`${moisture}%`}}/></div><small className="reading-foot">{moisture < 25 ? "Below demo threshold" : moisture < 40 ? "Approaching threshold" : "Above demo threshold"}</small></div>
              <div className="reading-card"><span className="reading-icon"><Thermometer size={17}/></span><span className="reading-name">Temperature</span><strong>{temperature}<small>°C</small></strong><div className="mini-chart temp-chart"><i/><i/><i/><i/><i/><i/><i/><i/></div><small className="reading-foot">Simulated ambient air</small></div>
              <div className="reading-card"><span className="reading-icon"><Waves size={17}/></span><span className="reading-name">Humidity</span><strong>{humidity}<small>%</small></strong><div className="meter"><span style={{width:`${humidity}%`}}/></div><small className="reading-foot">Relative humidity</small></div>
            </div>
            <AnimatePresence mode="wait"><motion.div key={recommendation.state} className={`recommendation recommendation-${recommendation.tone}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.24}}>
              <div className="recommend-icon">{recommendation.tone === "good" ? <CheckCircle2/> : <Droplets/>}</div><div className="recommend-copy"><span className="panel-kicker">SYSTEM RECOMMENDATION</span><h3>{recommendation.state}</h3><p>{recommendation.reason}</p></div><span className="priority">{recommendation.amount}</span>
            </motion.div></AnimatePresence>
            <div className="decision-foot"><span><ShieldCheck size={15}/> Safety rules remain in control</span><span>Crop profile: {crop} · Kc {cropData.kc.toFixed(2)}</span></div>
          </div>
        </div>
      </section>

      <section className="crop-lab section-pad stack-panel" id="crop-library">
        <Reveal className="crop-lab-heading"><p className="eyebrow">THE CROP WATER LIBRARY / 50 PROFILES</p><h2>Every crop has a rhythm.<br/><em>Find its water story.</em></h2><p>Search a crop to see an indicative seasonal crop-water range, a representative mid-season coefficient (Kc), and practical guidance. Save profiles locally for quick access.</p></Reveal>
        <div className="crop-lab-grid">
          <motion.div className="crop-search-panel" initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <label htmlFor="crop-search">Crop name</label><div className="crop-search-wrap"><Sprout size={18}/><input id="crop-search" value={cropQuery} onChange={e=>setCropQuery(e.target.value)} placeholder="Try rice, wheat, tomato…" list="crop-name-options"/><datalist id="crop-name-options">{crops.map(c=><option key={c.name} value={c.name}/>)}</datalist></div>
            <div className="crop-suggestions">{["Rice","Wheat","Maize","Tomato","Sugarcane"].map(n=><button key={n} onClick={()=>setCropQuery(n)}>{n}</button>)}</div>
            {matchedCrop ? <motion.div key={matchedCrop.name} className="crop-result" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.35}}><div className="crop-result-top"><span className="crop-emoji">{matchedCrop.icon}</span><span className="panel-kicker">CROP PROFILE FOUND</span><span className="crop-count">50 / 50</span></div><h3>{matchedCrop.name}</h3><p>{matchedCrop.note}</p><div className="crop-water-number"><strong>{matchedCrop.min.toLocaleString()}–{matchedCrop.max.toLocaleString()}</strong><span>mm per growing season</span></div><div className="crop-range-bar"><i style={{left:`${Math.min(85,matchedCrop.min/30)}%`,width:`${Math.max(10,Math.min(75,(matchedCrop.max-matchedCrop.min)/22))}%`}}/></div><div className="crop-facts"><div><span>Representative Kc</span><strong>{matchedCrop.kc.toFixed(2)}</strong></div><div><span>Crop-water method</span><strong>ETc = Kc × ETo</strong></div></div><p className="crop-source">Data note: {matchedCrop.source}. Seasonal ranges are indicative, not a fixed irrigation dose; actual demand changes with climate, growth duration, soil, rainfall and crop stage.</p><button className="button button-lime crop-save" onClick={()=>saveCropProfile(matchedCrop)}><CheckCircle2 size={16}/> Save profile locally</button></motion.div> : <div className="crop-empty"><Sprout size={25}/><strong>No exact crop match yet</strong><p>Try a crop name from the 50-profile library.</p></div>}
          </motion.div>
          <div className="crop-library-panel"><div className="crop-library-top"><div><span className="panel-kicker">EXPLORE THE LIBRARY</span><h3>50 crop profiles</h3></div><span className="library-badge"><Leaf size={14}/> FAO-guided</span></div><div className="crop-library-list">{crops.map((item,i)=><motion.button key={item.name} className={`crop-library-row ${matchedCrop?.name===item.name?"crop-row-active":""}`} onClick={()=>setCropQuery(item.name)} initial={{opacity:0,x:14}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:Math.min(i*.012,.3)}}><span className="crop-row-emoji">{item.icon}</span><span className="crop-row-name">{item.name}<small>Kc {item.kc.toFixed(2)}</small></span><strong>{item.min}–{item.max}<small>mm/season</small></strong><ArrowUpRight size={15}/></motion.button>)}</div><p className="crop-source">Representative FAO crop-water guidance is used where available. Other values are clearly marked as indicative planning ranges and should be checked against local agronomy data.</p></div>
        </div>
        <div className="saved-crops"><div><span className="panel-kicker">THIS DEVICE</span><h3>Saved crop profiles <small>{savedCrop.length}/50</small></h3></div>{savedCrop.length ? <div className="saved-crop-chips">{savedCrop.map(item=><button key={item.name} onClick={()=>{setCrop(item.name);setCropQuery(item.name);}}>{item.name} <span>Kc {Number(item.kc).toFixed(2)}</span></button>)}</div> : <p>No saved profiles yet. Search a crop and choose “Save profile locally”.</p>}</div>
        <p className="crop-citation">Reference: <a href="https://www.fao.org/4/X0490E/x0490e0b.htm" target="_blank" rel="noreferrer">FAO-56 crop evapotranspiration and crop coefficients</a> · <a href="https://www.fao.org/4/S2022E/s2022e07.htm" target="_blank" rel="noreferrer">FAO crop water needs and indicative seasonal ranges</a>.</p>
      </section>

      <section className="process section-pad stack-panel" id="technology">
        <Reveal className="process-heading"><p className="eyebrow">THE SYSTEM ARCHITECTURE</p><h2>From soil signal<br/>to <em>smarter action.</em></h2><p>Five connected stages make the workflow understandable, testable and scalable across multiple plots.</p></Reveal>
        <div className="process-list">{steps.map((step, i) => { const Icon = step.icon; return <Reveal key={step.n} delay={i * .06} className="process-item"><div className="process-number">{step.n}</div><div className="process-icon"><Icon size={21}/></div><div className="process-copy"><span>{step.tag}</span><h3>{step.title}</h3><p>{step.desc}</p></div><ArrowUpRight className="process-arrow" size={19}/></Reveal>; })}<Reveal className="process-item process-last"><div className="process-number">05</div><div className="process-icon"><Gauge size={21}/></div><div className="process-copy"><span>DASHBOARD / OPTIONAL ACTUATION</span><h3>Display or control</h3><p>Show current conditions, recommendations and trends. If pump hardware is installed, a properly rated relay/driver and fail-safe interlocks can enable control.</p></div><ArrowUpRight className="process-arrow" size={19}/></Reveal></div>
      </section>

      <section className="science-section stack-panel">
        <div className="science-image"><img src={ASSET + "soil-roots.jpg"} alt="Healthy roots in soil"/><div className="image-caption">ROOT-ZONE MONITORING <span>FIG. 01</span></div></div>
        <div className="science-copy"><Reveal><p className="eyebrow eyebrow-light">WHY THIS APPROACH</p><h2>Three strengths.<br/><em>One decision.</em></h2><div className="science-point"><span>01</span><div><h3>IoT monitoring</h3><p>Real-world measurements replace guesswork and support remote observation.</p></div></div><div className="science-point"><span>02</span><div><h3>FAO-56 water estimates</h3><p>A scientific basis for estimating crop evapotranspiration from weather and crop-stage data.</p></div></div><div className="science-point"><span>03</span><div><h3>Machine learning support</h3><p>A Random Forest model may learn patterns from historical, labelled data—alongside transparent thresholds and safety checks.</p></div></div></Reveal></div>
      </section>

      <section className="zones-section section-pad stack-panel">
        <Reveal className="zones-heading"><div><p className="eyebrow">MULTI-ZONE READY</p><h2>Every plot has<br/><em>its own story.</em></h2></div><p>Compare zones at a glance. Select a plot to inspect its sample status—ideal for demonstrating how the concept could scale across a farm.</p></Reveal>
        <div className="zone-layout"><div className="field-map" role="group" aria-label="Select a field zone">{[0,1,2,3].map((n)=><button key={n} className={`field-zone field-zone-${n+1} ${activeZone===n+1?"zone-selected":""}`} onClick={()=>setActiveZone(n+1)} aria-pressed={activeZone===n+1}><span>ZONE 0{n+1}</span><strong>{["Healthy","Monitor","Needs water","Healthy"][n]}</strong><span className="zone-moisture">{[48,31,19,56][n]}% moisture</span></button>)}</div><div className="zone-details"><span className="panel-kicker">SELECTED FIELD / ZONE 0{activeZone}</span><h3>{["North plot","Central plot","East plot","South plot"][activeZone-1]}</h3><div className="zone-detail-moisture"><strong>{[48,31,19,56][activeZone-1]}<small>%</small></strong><span>Sample soil moisture</span></div><div className="zone-detail-line"><span>Sample status</span><strong className={activeZone===3?"text-dry":activeZone===2?"text-watch":"text-good"}>{["Healthy","Monitor","Needs water","Healthy"][activeZone-1]}</strong></div><div className="zone-detail-line"><span>Next action</span><strong>{["Continue monitoring","Recheck soon","Verify sensor, then irrigate if appropriate","Continue monitoring"][activeZone-1]}</strong></div><p className="sim-note">Illustrative zone data for the prototype. Not a live map or a measured field result.</p></div></div>
      </section>

      <section className="objectives section-pad stack-panel" id="impact">
        <Reveal className="objectives-intro"><p className="eyebrow eyebrow-light">PROJECT OBJECTIVES</p><h2>Better timing.<br/><em>Less avoidable waste.</em></h2><p>The goal is a practical decision-support system—not a black box that waters without oversight.</p><a href="#contact" className="button button-lime">Discuss the project <ArrowUpRight size={16}/></a></Reveal>
        <div className="objective-list"><Reveal><div className="objective"><span>01</span><div><h3>Reduce unnecessary watering</h3><p>Use soil and weather context to avoid irrigation when it is not needed.</p></div><Droplets/></div></Reveal><Reveal delay={.07}><div className="objective"><span>02</span><div><h3>Monitor remotely</h3><p>Make readings available across plots without requiring constant manual checks.</p></div><Radio/></div></Reveal><Reveal delay={.14}><div className="objective"><span>03</span><div><h3>Make crop-aware recommendations</h3><p>Consider crop type, growth stage and estimated water demand.</p></div><Leaf/></div></Reveal><Reveal delay={.21}><div className="objective"><span>04</span><div><h3>Scale responsibly</h3><p>Separate sensing, decision logic, dashboard and optional pump control.</p></div><Cpu/></div></Reveal></div>
      </section>

      <section className="faq-section section-pad stack-panel">
        <Reveal className="faq-intro"><p className="eyebrow">PROJECT CLARITY</p><h2>Built on evidence.<br/><em>Clear about limits.</em></h2></Reveal>
        <div className="faq-list">{[
          ["Is this connected to real sensors?", "Not in this frontend demo. The dashboard uses adjustable simulated values. Connect your ESP32/API or gateway to display real measurements."],
          ["What does FAO-56 contribute?", "FAO-56 provides methods for estimating reference evapotranspiration and crop evapotranspiration using weather and crop coefficients. Accurate estimates require suitable inputs."],
          ["Is the Random Forest model trained?", "This prototype does not claim to include a trained model. A real model needs a documented dataset, labels, validation metrics and an inference endpoint or browser-side model."],
          ["Can it automatically switch on a pump?", "Only when compatible hardware and safe control circuitry are implemented. This website does not operate a physical pump. Hardware should include manual override, dry-run protection and fail-safe limits."]
        ].map(([q,a],i)=><div className={`faq-item ${faqOpen===i?"faq-active":""}`} key={q}><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)} aria-expanded={faqOpen===i}><span>{q}</span><ChevronDown size={18}/></button><AnimatePresence initial={false}>{faqOpen===i&&<motion.div className="faq-answer" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}><p>{a}</p></motion.div>}</AnimatePresence></div>)}</div>
      </section>

      <section className="contact-section" id="contact"><div className="contact-orb orb-one"/><div className="contact-orb orb-two"/><div className="contact-inner"><Reveal className="contact-copy"><p className="eyebrow eyebrow-light">LET'S GROW WITH INTENTION</p><h2>Make every drop<br/><em>count.</em></h2><p>Explore a more responsive way to monitor soil and plan irrigation.</p><div className="contact-foot"><span><Sprout size={16}/> VERDANT / PROJECT PROTOTYPE</span><span>MONITOR WITH PURPOSE</span></div></Reveal><Reveal className="contact-form-wrap" delay={.12}><form className="contact-form" onSubmit={submitForm}><div className="form-heading"><span className="panel-kicker">GET IN TOUCH</span><h3>Project enquiry</h3><p>Complete this form to save a local demo request.</p></div><label>Your name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter your name"/></label><label>Email address<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>Primary crop<select value={form.crop} onChange={e=>setForm({...form,crop:e.target.value})}>{crops.map(c=><option key={c.name}>{c.name}</option>)}</select></label><label>What would you like to explore? <textarea rows="3" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Sensors, dashboard, model, deployment…"/></label><button className="button button-dark" type="submit">Save enquiry <ArrowUpRight size={16}/></button><p className="form-disclaimer">Prototype note: this form stores the enquiry in this browser only. It does not send an email or contact a server.</p></form></Reveal></div></section>
    </main>
    <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-icon"><Sprout size={19}/></span><span>VERDANT<span className="brand-period">.</span><small>SMART IRRIGATION SYSTEM</small></span></a><p>IoT + FAO-56 + ML · PRECISION IRRIGATION</p><a href="#home">Back to top ↑</a></footer>
    <AnimatePresence>{toast&&<motion.div className="toast" role="status" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}}><CheckCircle2 size={18}/>{toast}<button onClick={()=>setToast("")} aria-label="Dismiss notification"><X size={15}/></button></motion.div>}</AnimatePresence>
  </div>;
}
export default App;
