import React, { useState, useEffect, useRef } from "react";

const getBtnStyle = (isActive: boolean): React.CSSProperties => ({
  flex: 1,
  padding: "8px 12px",
  borderRadius: 6,
  border: "1.5px solid",
  borderColor: isActive ? "var(--primary)" : "#cbd5e1",
  background: isActive ? "var(--primary)" : "#f8fafc",
  color: isActive ? "#ffffff" : "#1e293b",
  fontWeight: "bold",
  fontSize: "0.78rem",
  cursor: "pointer",
  transition: "all 0.2s ease"
});

interface LocalSimulationProps {
  topic: string;
}

export function LocalSimulation({ topic }: LocalSimulationProps) {
  // Determine which simulation to load based on the topic
  if (topic.includes("Gölge") || topic.includes("Işık") || topic.includes("Yayılması")) {
    return <LightAndShadowLab />;
  } else if (topic.includes("Tanecikli")) {
    return <ParticleModelSim />;
  } else if (topic.includes("Değişimi") || topic.includes("Isı")) {
    return <PhaseChangeSim />;
  } else if (topic.includes("Elektrik") || topic.includes("Ampul") || topic.includes("Devre")) {
    return <CircuitBuilderSim />;
  }

  return (
    <div style={{ padding: 25, textAlign: "center", background: "var(--card-bg)", borderRadius: 12 }}>
      <h3>🔬 İnteraktif Deney & Simülasyon</h3>
      <p>Bu konu için interaktif deney odası hazır.</p>
    </div>
  );
}

/* ==========================================================================
   1. LIGHT & SHADOW LAB
   ========================================================================== */
function LightAndShadowLab() {
  const [opacity, setOpacity] = useState(1); // 1 = Opak, 0.5 = Yarı Saydam, 0 = Saydam
  const [sourceDist, setSourceDist] = useState(50); // Cisim ile fener arası mesafe
  const [screenDist, setScreenDist] = useState(50); // Cisim ile perde arası mesafe
  const [sourceY, setSourceY] = useState(100); // Fenerin yukarı aşağı konumu

  // Calculate shadow size
  // Shadow Size = Cisim_Boyu * (Kaynak_Perde_Uzakligi / Kaynak_Cisim_Uzakligi)
  // Let source-to-object = sourceDist, object-to-screen = screenDist.
  // Total distance = sourceDist + screenDist.
  // Magnification factor = (sourceDist + screenDist) / sourceDist
  const baseSize = 40;
  const magnification = (sourceDist + screenDist) / Math.max(10, sourceDist);
  const shadowSize = baseSize * magnification;
  const shadowOpacity = opacity * (1 - (sourceDist / 150)); // dimmer shadow if light source is far

  return (
    <div style={simContainerStyle}>
      <h3 style={simTitleStyle}>🔦 Işık ve Gölge Laboratuvarı</h3>
      <p style={simDescStyle}>Işık kaynağının ve cismin konumunu değiştirerek tam gölgenin boyutunu ve netliğini inceleyin.</p>

      <div style={simWorkspaceStyle}>
        {/* SVG Simulation Field */}
        <div style={{ position: "relative", width: "100%", height: 240, background: "#111827", borderRadius: 8, overflow: "hidden" }}>
          {/* Light rays path */}
          {opacity > 0 && (
            <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
              <polygon
                points={`60,${sourceY} ${120 + sourceDist * 2},${sourceY - shadowSize/2} 550,${sourceY - shadowSize} 550,${sourceY + shadowSize} ${120 + sourceDist * 2},${sourceY + shadowSize/2}`}
                fill="rgba(251, 191, 36, 0.08)"
              />
              <polygon
                points={`60,${sourceY} ${120 + sourceDist * 2},${sourceY - 20} ${120 + sourceDist * 2},${sourceY + 20}`}
                fill="rgba(251, 191, 36, 0.15)"
              />
            </svg>
          )}

          {/* Light Source (Draggable representation via slider Y) */}
          <div style={{ position: "absolute", left: 30, top: sourceY - 15, transition: "top 0.1s ease" }}>
            <span style={{ fontSize: "2rem", filter: "drop-shadow(0 0 10px #f59e0b)" }}>🔦</span>
          </div>

          {/* Draggable/Positioned Object */}
          <div style={{
            position: "absolute",
            left: 120 + sourceDist * 2,
            top: sourceY - 20,
            width: 25,
            height: 40,
            background: opacity === 1 ? "#ef4444" : opacity === 0.5 ? "rgba(239, 68, 68, 0.5)" : "rgba(239, 68, 68, 0.15)",
            border: "2px solid #ef4444",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "0.6rem",
            fontWeight: "bold",
            transition: "left 0.1s ease, top 0.1s ease",
            boxShadow: opacity > 0 ? "0 0 10px rgba(239,68,68,0.5)" : "none"
          }}>
            {opacity === 1 ? "Opak" : opacity === 0.5 ? "Y.Saydam" : "Saydam"}
          </div>

          {/* Screen (Perde) */}
          <div style={{
            position: "absolute",
            right: 40,
            top: 20,
            bottom: 20,
            width: 8,
            background: "#e5e7eb",
            borderRadius: 4
          }} />

          {/* Shadow on the Screen */}
          {opacity > 0 && (
            <div style={{
              position: "absolute",
              right: 40,
              top: sourceY - shadowSize / 2,
              width: 8,
              height: shadowSize,
              background: `rgba(0, 0, 0, ${shadowOpacity})`,
              transition: "height 0.1s ease, top 0.1s ease",
              boxShadow: "0 0 8px rgba(0,0,0,0.8)"
            }} />
          )}
        </div>

        {/* Controls Layout */}
        <div style={controlsPaneStyle}>
          <div style={controlGroupStyle}>
            <label style={labelStyle}>Material Türü (Geçirgenlik):</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setOpacity(1)} style={getBtnStyle(opacity === 1)}>Opak (Tahta/Taş)</button>
              <button onClick={() => setOpacity(0.5)} style={getBtnStyle(opacity === 0.5)}>Yarı Saydam (Buzlu Cam)</button>
              <button onClick={() => setOpacity(0)} style={getBtnStyle(opacity === 0)}>Saydam (Cam)</button>
            </div>
          </div>

          <div style={sliderRowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Işık Kaynağı - Cisim Mesafesi: {sourceDist} cm</label>
              <input type="range" min="15" max="120" value={sourceDist} onChange={(e) => setSourceDist(Number(e.target.value))} style={sliderStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Cisim - Perde Mesafesi: {screenDist} cm</label>
              <input type="range" min="15" max="120" value={screenDist} onChange={(e) => setScreenDist(Number(e.target.value))} style={sliderStyle} />
            </div>
          </div>

          <div style={sliderRowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Işık Kaynağı Yüksekliği:</label>
              <input type="range" min="40" max="200" value={sourceY} onChange={(e) => setSourceY(Number(e.target.value))} style={sliderStyle} />
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
              <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 6, padding: "8px 12px", fontSize: "0.8rem", color: "#f59e0b" }}>
                📐 Gölge Boyu Katsayısı: <strong>{magnification.toFixed(1)}x</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. PARTICLE MODEL SIMULATOR
   ========================================================================== */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
}

function ParticleModelSim() {
  const [phase, setPhase] = useState<"solid" | "liquid" | "gas">("solid");
  const [temperature, setTemperature] = useState(25); // Celsius
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize and animate particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = canvas.width;
    const height = canvas.height;

    // Generate particles
    const cols = 8;
    const rows = 5;
    const particles: Particle[] = [];
    const radius = 8;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = width / 2 - 80 + c * 22;
        const y = height / 2 - 50 + r * 22;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          originalX: x,
          originalY: y
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw container box
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Draw heater/cooler indicator
      ctx.fillStyle = temperature > 80 ? "rgba(239, 68, 68, 0.15)" : temperature < 5 ? "rgba(59, 130, 246, 0.15)" : "transparent";
      ctx.fillRect(20, 20, width - 40, height - 40);

      // Calculate speed factor based on temperature
      const speedFactor = (temperature + 273) / 298; // Kelvin scale adjustment

      particles.forEach((p) => {
        if (phase === "solid") {
          // Vibrational movement around original lattice point
          const amplitude = 1.2 * speedFactor;
          p.x = p.originalX + (Math.random() - 0.5) * amplitude;
          p.y = p.originalY + (Math.random() - 0.5) * amplitude;
        } else if (phase === "liquid") {
          // Flowing movement, kept together loosely in the bottom half
          p.x += p.vx * 0.8 * speedFactor;
          p.y += p.vy * 0.8 * speedFactor;

          // Stay in bottom container area
          if (p.x < 30 + radius || p.x > width - 30 - radius) p.vx *= -1;
          if (p.y < height / 2 || p.y > height - 30 - radius) p.vy *= -1;

          // Clip to boundaries
          p.x = Math.max(30 + radius, Math.min(width - 30 - radius, p.x));
          p.y = Math.max(height / 2, Math.min(height - 30 - radius, p.y));
        } else {
          // Gas: Rapidly flying everywhere
          p.x += p.vx * 2.5 * speedFactor;
          p.y += p.vy * 2.5 * speedFactor;

          // Bounce off container walls
          if (p.x < 25 + radius || p.x > width - 25 - radius) p.vx *= -1;
          if (p.y < 25 + radius || p.y > height - 25 - radius) p.vy *= -1;

          // Clip to boundaries
          p.x = Math.max(25 + radius, Math.min(width - 25 - radius, p.x));
          p.y = Math.max(25 + radius, Math.min(height - 25 - radius, p.y));
        }

        // Draw particle (Sphere)
        const gradient = ctx.createRadialGradient(p.x - 2, p.y - 2, 1, p.x, p.y, radius);
        if (temperature > 80) {
          gradient.addColorStop(0, "#fca5a5");
          gradient.addColorStop(1, "#ef4444");
        } else if (temperature < 5) {
          gradient.addColorStop(0, "#93c5fd");
          gradient.addColorStop(1, "#3b82f6");
        } else {
          gradient.addColorStop(0, "#6ee7b7");
          gradient.addColorStop(1, "#10b981");
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Information Labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`Tanecik Hareketi: ${phase === "solid" ? "Yalnızca Titreşim" : phase === "liquid" ? "Titreşim + Öteleme" : "Titreşim + Öteleme + Dönme"}`, 30, 45);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase, temperature]);

  return (
    <div style={simContainerStyle}>
      <h3 style={simTitleStyle}>🧪 Maddenin Tanecikli Yapısı Simülasyonu</h3>
      <p style={simDescStyle}>Sıcaklığı değiştirerek katı, sıvı ve gaz maddelerin tanecik boşluklarını ve hareketlerini inceleyin.</p>

      <div style={simWorkspaceStyle}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <canvas ref={canvasRef} width={450} height={200} style={{ background: "#1e293b", borderRadius: 8, border: "2px solid var(--border-light)" }} />
        </div>

        <div style={controlsPaneStyle}>
          <div style={controlGroupStyle}>
            <label style={labelStyle}>Maddenin Hali:</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setPhase("solid"); setTemperature(-10); }} style={getBtnStyle(phase === "solid")}>🥶 Katı Fazı (-10 °C)</button>
              <button onClick={() => { setPhase("liquid"); setTemperature(25); }} style={getBtnStyle(phase === "liquid")}>💧 Sıvı Fazı (25 °C)</button>
              <button onClick={() => { setPhase("gas"); setTemperature(110); }} style={getBtnStyle(phase === "gas")}>🔥 Gaz Fazı (110 °C)</button>
            </div>
          </div>

          <div style={sliderRowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Sıcaklık Ayarı: <strong>{temperature} °C</strong></label>
              <input
                type="range"
                min="-30"
                max="150"
                value={temperature}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTemperature(val);
                  if (val < 0) setPhase("solid");
                  else if (val >= 0 && val <= 100) setPhase("liquid");
                  else setPhase("gas");
                }}
                style={sliderStyle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. PHASE CHANGE CHART SIMULATION
   ========================================================================== */
function PhaseChangeSim() {
  const [heatEnergy, setHeatEnergy] = useState(0); // 0 to 100
  const [temperature, setTemperature] = useState(-20);

  // Compute temperature based on added heat energy
  // Melting plateau: 20% to 40% energy remains at 0°C (Ice melting)
  // Boiling plateau: 70% to 90% energy remains at 100°C (Water boiling)
  useEffect(() => {
    let t = -20;
    if (heatEnergy <= 20) {
      t = -20 + (heatEnergy / 20) * 20; // Ice warming up to 0C
    } else if (heatEnergy > 20 && heatEnergy <= 45) {
      t = 0; // Melting ice
    } else if (heatEnergy > 45 && heatEnergy <= 70) {
      t = ((heatEnergy - 45) / 25) * 100; // Liquid water heating up to 100C
    } else if (heatEnergy > 70 && heatEnergy <= 90) {
      t = 100; // Boiling water
    } else {
      t = 100 + ((heatEnergy - 90) / 10) * 30; // Steam heating up above 100C
    }
    setTemperature(Math.round(t));
  }, [heatEnergy]);

  // Determine current state label
  const getStateLabel = () => {
    if (temperature < 0) return "🥶 Katı (Buz)";
    if (temperature === 0) return "🧊 Katı - Sıvı Karışımı (Erime Süreci)";
    if (temperature > 0 && temperature < 100) return "💧 Sıvı (Su)";
    if (temperature === 100) return "💨 Sıvı - Gaz Karışımı (Kaynama/Yoğuşma)";
    return "🔥 Gaz (Su Buharı)";
  };

  return (
    <div style={simContainerStyle}>
      <h3 style={simTitleStyle}>📈 Maddenin Hâl Değişim Grafiği</h3>
      <p style={simDescStyle}>Isı enerjisi ekleyerek saf bir maddenin sıcaklık değişim grafiğini ve hâl değişim basamaklarını inceleyin.</p>

      <div style={simWorkspaceStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
          {/* Visual Container */}
          <div style={{ background: "#0f172a", borderRadius: 8, padding: 15, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: temperature < 0 ? "#3b82f6" : temperature > 99 ? "#f59e0b" : "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              boxShadow: "0 0 20px rgba(255,255,255,0.1)"
            }}>
              {temperature < 0 ? "❄️" : temperature === 0 ? "🧊" : temperature > 0 && temperature < 100 ? "💧" : "💨"}
            </div>
            <strong style={{ color: "white", marginTop: 12, fontSize: "1.1rem" }}>Sıcaklık: {temperature} °C</strong>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 4 }}>{getStateLabel()}</span>
          </div>

          {/* Graph view using SVG */}
          <div style={{ background: "#0f172a", borderRadius: 8, padding: 10, position: "relative", height: 140 }}>
            <svg style={{ width: "100%", height: "100%" }}>
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="200" y2="20" stroke="rgba(255,255,255,0.07)" strokeDasharray="3" />
              <line x1="30" y1="60" x2="200" y2="60" stroke="rgba(255,255,255,0.07)" strokeDasharray="3" />
              <line x1="30" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.07)" strokeDasharray="3" />
              
              {/* Axes */}
              <line x1="30" y1="10" x2="30" y2="120" stroke="#475569" strokeWidth="2" />
              <line x1="30" y1="110" x2="200" y2="110" stroke="#475569" strokeWidth="2" />

              {/* Legend */}
              <text x="2" y="24" fill="#94a3b8" fontSize="8">100°C</text>
              <text x="12" y="64" fill="#94a3b8" fontSize="8">0°C</text>
              <text x="180" y="122" fill="#94a3b8" fontSize="8">Zaman</text>

              {/* Complete Line Plot path */}
              <path
                d="M 30,110 L 50,90 L 95,90 L 140,40 L 175,40 L 190,20"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />

              {/* Dynamic plot indicator ball */}
              <circle
                cx={30 + (heatEnergy / 100) * 160}
                cy={110 - (Math.min(100, Math.max(-20, temperature)) + 20) * (90 / 120)}
                r="5"
                fill="#f59e0b"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        <div style={controlsPaneStyle}>
          <div style={sliderRowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Sisteme Isı Enerjisi Ekle (Ocak Ayarı): <strong>{heatEnergy}%</strong></label>
              <input
                type="range"
                min="0"
                max="100"
                value={heatEnergy}
                onChange={(e) => setHeatEnergy(Number(e.target.value))}
                style={sliderStyle}
              />
            </div>
          </div>
          <div style={{ background: "rgba(59,130,246,0.06)", borderRadius: 6, padding: "8px 12px", border: "1.5px solid var(--border-light)", fontSize: "0.75rem", color: "#94a3b8" }}>
            💡 <strong>Erime (0°C)</strong> ve <strong>Kaynama (100°C)</strong> basamaklarında sisteme ısı verilmeye devam edildiği halde sıcaklığın neden <strong>sabit kaldığına</strong> dikkat edin (Enerji hal değişimi için harcanır).
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. CIRCUIT BUILDER SIMULATION
   ========================================================================== */
function CircuitBuilderSim() {
  const [bulbs, setBulbs] = useState(1); // Ampul sayısı: 1, 2, 3
  const [batteries, setBatteries] = useState(1); // Pil sayısı: 1, 2, 3
  const [isOpen, setIsOpen] = useState(false); // Anahtar açık mı kapalı mı
  const [viewMode, setViewMode] = useState<"real" | "symbol">("real");

  // Calculate current/brightness level
  // Brightness = batteries / bulbs (if circuit is closed)
  const brightness = isOpen ? (batteries / bulbs) : 0;

  return (
    <div style={simContainerStyle}>
      <h3 style={simTitleStyle}>🔌 Basit Elektrik Devresi Laboratuvarı</h3>
      <p style={simDescStyle}>Devredeki pil ve ampul sayısını değiştirerek ampulün parlaklığını ve şematik sembolleri inceleyin.</p>

      <div style={simWorkspaceStyle}>
        {/* Workspace Canvas (SVG based visualization) */}
        <div style={{ position: "relative", width: "100%", height: 220, background: "#111827", borderRadius: 8, overflow: "hidden", border: "1.5px solid var(--border-light)" }}>
          <svg style={{ width: "100%", height: "100%" }}>
            {/* Connecting Wires */}
            <path d="M 80,110 L 80,40 L 370,40 L 370,110" fill="none" stroke={isOpen ? "#fbbf24" : "#4b5563"} strokeWidth="4" />
            <path d="M 80,110 L 80,180 L 370,180 L 370,110" fill="none" stroke={isOpen ? "#fbbf24" : "#4b5563"} strokeWidth="4" />

            {/* Batteries rendering (Left wire) */}
            {viewMode === "real" ? (
              // Real batteries drawings
              <g transform="translate(40, 75)">
                {Array.from({ length: batteries }).map((_, i) => (
                  <g key={i} transform={`translate(0, ${i * 25})`}>
                    <rect x="25" y="0" width="30" height="18" fill="#f59e0b" rx="2" />
                    <rect x="55" y="4" width="4" height="10" fill="#374151" />
                    <rect x="27" y="4" width="8" height="10" fill="white" />
                    <text x="31" y="12" fill="#ef4444" fontSize="8" fontWeight="bold">+</text>
                  </g>
                ))}
              </g>
            ) : (
              // Schematic Battery Symbol
              <g transform="translate(65, 95)">
                {Array.from({ length: batteries }).map((_, i) => (
                  <g key={i} transform={`translate(0, ${i * 12})`}>
                    <line x1="0" y1="0" x2="30" y2="0" stroke="white" strokeWidth="3" />
                    <line x1="7" y1="6" x2="23" y2="6" stroke="white" strokeWidth="1.5" />
                  </g>
                ))}
              </g>
            )}

            {/* Switch (Anahtar) (Bottom wire) */}
            {viewMode === "real" ? (
              <g transform="translate(200, 165)">
                <rect x="0" y="5" width="40" height="8" fill="#374151" rx="2" />
                <circle cx="10" cy="9" r="4" fill="#9ca3af" />
                <circle cx="30" cy="9" r="4" fill="#9ca3af" />
                {/* Switch lever */}
                <line
                  x1="10"
                  y1="9"
                  x2={isOpen ? 30 : 25}
                  y2={isOpen ? 9 : -5}
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              // Schematic Switch Symbol
              <g transform="translate(200, 180)">
                <circle cx="0" cy="0" r="3" fill="white" />
                <circle cx="30" cy="0" r="3" fill="white" />
                <line
                  x1="0"
                  y1="0"
                  x2={isOpen ? 30 : 25}
                  y2={isOpen ? 0 : -10}
                  stroke="white"
                  strokeWidth="2.5"
                />
              </g>
            )}

            {/* Bulbs (Right wire) */}
            <g transform="translate(340, 75)">
              {Array.from({ length: bulbs }).map((_, i) => {
                const yOffset = i * 35;
                if (viewMode === "real") {
                  return (
                    <g key={i} transform={`translate(0, ${yOffset})`}>
                      {/* Socket */}
                      <rect x="15" y="16" width="30" height="12" fill="#9ca3af" rx="2" />
                      {/* Glass bulb */}
                      <circle cx="30" cy="10" r="14" fill={isOpen ? `rgba(253, 224, 71, ${0.3 + (brightness * 0.2)})` : "rgba(255,255,255,0.05)"} stroke={isOpen ? "#fbbf24" : "#9ca3af"} strokeWidth="2" />
                      {/* Filament */}
                      <path d="M 24,16 L 27,8 L 33,8 L 36,16" fill="none" stroke={isOpen ? "#ef4444" : "#4b5563"} strokeWidth="1.5" />
                      {/* Glow effect */}
                      {isOpen && (
                        <g>
                          <line x1="30" y1="-8" x2="30" y2="-15" stroke="#fbbf24" strokeWidth="2" />
                          <line x1="12" y1="10" x2="5" y2="10" stroke="#fbbf24" strokeWidth="2" />
                          <line x1="48" y1="10" x2="55" y2="10" stroke="#fbbf24" strokeWidth="2" />
                        </g>
                      )}
                    </g>
                  );
                } else {
                  // Schematic Symbol: circle with an X inside
                  return (
                    <g key={i} transform={`translate(15, ${yOffset})`}>
                      <circle cx="15" cy="15" r="12" fill="none" stroke="white" strokeWidth="2.5" />
                      <line x1="6.5" y1="6.5" x2="23.5" y2="23.5" stroke="white" strokeWidth="2" />
                      <line x1="23.5" y1="6.5" x2="6.5" y2="23.5" stroke="white" strokeWidth="2" />
                    </g>
                  );
                }
              })}
            </g>
          </svg>

          {/* Indicator on state */}
          <div style={{ position: "absolute", top: 15, left: 15, display: "flex", gap: "8px" }}>
            <span style={{
              background: isOpen ? "#10b981" : "#ef4444",
              width: 10,
              height: 10,
              borderRadius: "50%",
              display: "inline-block"
            }} />
            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Devre Durumu: <strong>{isOpen ? "Kapalı Devre (Akım Geçiyor)" : "Açık Devre (Akım Geçmiyor)"}</strong></span>
          </div>
        </div>

        {/* Controls Panel */}
        <div style={controlsPaneStyle}>
          <div style={sliderRowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Pil Sayısı (Güç):</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[1, 2, 3].map((num) => (
                  <button key={num} onClick={() => setBatteries(num)} style={getBtnStyle(batteries === num)}>{num} Pil</button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Ampul Sayısı (Direnç):</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[1, 2, 3].map((num) => (
                  <button key={num} onClick={() => setBulbs(num)} style={getBtnStyle(bulbs === num)}>{num} Ampul</button>
                ))}
              </div>
            </div>
          </div>

          <div style={sliderRowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Anahtar Durumu:</label>
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 6,
                  border: "none",
                  fontWeight: "bold",
                  color: "white",
                  cursor: "pointer",
                  background: isOpen ? "linear-gradient(135deg, #ef4444, #b91c1c)" : "linear-gradient(135deg, #10b981, #047857)"
                }}
              >
                {isOpen ? "🔌 Anahtarı AÇ (Devreyi Kes)" : "🔌 Anahtarı KAPAT (Lambayı Yak)"}
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Gösterim Şekli:</label>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setViewMode("real")} style={{ ...getBtnStyle(viewMode === "real"), width: "100%" }}>📸 Gerçekçi Görünüm</button>
                <button onClick={() => setViewMode("symbol")} style={{ ...getBtnStyle(viewMode === "symbol"), width: "100%" }}>📐 Şematik (Sembollerle)</button>
              </div>
            </div>
          </div>

          {/* Interactive readout */}
          {isOpen && (
            <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, padding: "8px 12px", fontSize: "0.8rem", color: "#fbbf24" }}>
              💡 <strong>Ampul Parlaklık Seviyesi:</strong> {brightness.toFixed(2)}x
              {brightness > 1.5 ? " (Çok Parlak)" : brightness === 1 ? " (Normal Parlak)" : " (Sönük / Az Parlak)"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   COMMON STYLES
   ========================================================================== */
const simContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  background: "var(--card-bg)",
  border: "1px solid var(--border-light)",
  borderRadius: 12,
  padding: 20,
  gap: 12,
  color: "var(--text-main)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
  backdropFilter: "blur(8px)"
};

const simTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "1.2rem",
  fontWeight: 700,
  background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const simDescStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.82rem",
  color: "var(--text-muted)",
  lineHeight: 1.4
};

const simWorkspaceStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 15
};

const controlsPaneStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  background: "var(--bg-light)",
  padding: 15,
  borderRadius: 8,
  border: "1px solid var(--border-light)"
};

const controlGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6
};

const sliderRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 15,
  flexWrap: "wrap"
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "var(--text-main)",
  marginBottom: 4,
  display: "block"
};

const sliderStyle: React.CSSProperties = {
  width: "100%",
  accentColor: "var(--primary)",
  cursor: "pointer"
};
