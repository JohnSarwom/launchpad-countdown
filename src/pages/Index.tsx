import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";


const DESTINATION_URL = "https://www.dplga.gov.pg/";
const DEFAULT_BACKDROP = "/assets/images/DPLGA_Backdrop_Banner_Page.png";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const PHOENIX_COLORS = [
  "#ffd977", "#f5d07b", "#cfa44a", "#ff8c42",
  "#ff6b35", "#e63946", "#ffb347", "#fff176",
];

const Index = () => {
  const [backgroundImage] = useState<string | null>(DEFAULT_BACKDROP);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showLaunch, setShowLaunch] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const particleIdRef = useRef(0);


  const spawnParticles = useCallback((count: number, intensity: number = 1) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x: 50 + (Math.random() - 0.5) * 60 * intensity,
        y: 50 + (Math.random() - 0.5) * 60 * intensity,
        size: Math.random() * 8 + 2,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 0.5,
        color: PHOENIX_COLORS[Math.floor(Math.random() * PHOENIX_COLORS.length)],
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 3000);
  }, []);

  useEffect(() => {
    if (!isCountingDown) return;

    if (countdown > 0) {
      setScreenShake(true);
      setFlashOpacity(0.3 + (5 - countdown) * 0.1);
      setTimeout(() => setScreenShake(false), 400);
      setTimeout(() => setFlashOpacity(0), 300);

      const particleCount = 15 + (5 - countdown) * 10;
      spawnParticles(particleCount, 0.5 + (5 - countdown) * 0.2);

      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setScreenShake(true);
      setFlashOpacity(0.8);
      spawnParticles(80, 1.5);
      setTimeout(() => setScreenShake(false), 600);
      setTimeout(() => setFlashOpacity(0), 500);

      setShowLaunch(true);
      setTimeout(() => {
        window.open(DESTINATION_URL, "_blank");
        resetCountdown();
      }, 1500);
    }
  }, [isCountingDown, countdown, spawnParticles]);

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(5);
    setShowLaunch(false);
    setParticles([]);
  };

  const resetCountdown = () => {
    setIsCountingDown(false);
    setCountdown(5);
    setShowLaunch(false);
    setParticles([]);
  };

  const shakeClass = screenShake ? "countdown-shake" : "";

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-black ${shakeClass}`}>
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-1000"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            transform: isCountingDown ? `scale(${1.05 + (5 - countdown) * 0.02})` : "scale(1)",
          }}
        />
      )}

      {/* Dark Overlay - intensifies with countdown */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: isCountingDown
            ? `radial-gradient(circle at center, rgba(0,0,0,${0.4 + (5 - countdown) * 0.08}) 0%, rgba(0,0,0,${0.7 + (5 - countdown) * 0.05}) 100%)`
            : "rgba(0,0,0,0.5)",
        }}
      />

      {/* Ambient Golden Dust (idle screen) */}
      {!isCountingDown && (
        <div className="absolute inset-0 pointer-events-none z-[6]">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={`dust-${i}`}
              className="golden-dust"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDuration: `${Math.random() * 6 + 4}s`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* Vignette */}
      <div className="countdown-vignette" />

      {/* Ambient golden pulse during countdown */}
      {isCountingDown && (
        <div
          className="absolute inset-0 pointer-events-none countdown-ambient-pulse"
          style={{
            background: "radial-gradient(circle at center, rgba(255,200,50,0.08) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Flash Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-200"
        style={{
          background: "radial-gradient(circle at center, rgba(255,215,100,0.9), rgba(255,140,50,0.4), transparent)",
          opacity: flashOpacity,
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="countdown-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Content */}
      <div
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4"
        style={{ perspective: "1200px" }}
      >
        {/* Main Content */}
        {!isCountingDown ? (
          <div className="text-center countdown-fade-in">
            <h1 className="mb-8 text-5xl font-black uppercase tracking-wider md:text-7xl countdown-title">
              Ready for Launch
            </h1>

            <Button
              onClick={startCountdown}
              size="lg"
              className="
                group relative h-20 px-14
                text-2xl font-black uppercase tracking-widest
                text-[#3b0a0a]
                bg-gradient-to-r from-[#f5d07b] via-[#ffd977] to-[#cfa44a]
                border-2 border-[#ffeb99]
                shadow-[0_0_25px_rgba(255,215,100,0.45),inset_0_0_10px_rgba(255,255,255,0.3)]
                transition-all duration-300
                hover:scale-110
                hover:shadow-[0_0_45px_rgba(255,215,120,0.8)]
                active:scale-95
                before:absolute before:inset-0 before:rounded-md
                before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent)]
                before:opacity-0 hover:before:opacity-100 before:transition-opacity
                countdown-button-glow
              "
            >
              <Rocket className="mr-3 h-8 w-8 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-15deg]" />
              Launch
            </Button>
          </div>
        ) : (
          <div className="text-center" style={{ perspective: "1200px" }}>
            {!showLaunch ? (
              <div key={countdown} className="countdown-number-3d">
                <span className="countdown-number-text">{countdown}</span>
                <div className="countdown-ring countdown-ring-1" />
                <div className="countdown-ring countdown-ring-2" />
                <div className="countdown-ring countdown-ring-3" />
                <div className="countdown-shockwave" />
              </div>
            ) : (
              <div className="countdown-launch-container">
                <span className="countdown-launch-text">LAUNCH!</span>
                <div className="countdown-launch-explosion" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
