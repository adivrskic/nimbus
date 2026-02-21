import { Cloudy, Zap, Palette, Download, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useModals } from "../contexts/ModalContext";
import "./Footer.scss";

const EMOJIS = [
  "🌽",
  "🍇",
  "🍌",
  "🍒",
  "🍕",
  "🍷",
  "🍭",
  "💖",
  "💩",
  "🐷",
  "🐸",
  "🐳",
  "🎃",
  "🎾",
  "🌈",
  "🍦",
  "💁",
  "🔥",
  "😁",
  "😱",
  "🌴",
  "👏",
  "💃",
  "🎉",
  "✨",
  "🌟",
  "🦄",
  "🎈",
  "🎨",
  "🚀",
];

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { openLegal, openRoadmap, openSupport } = useModals();
  const [isRaining, setIsRaining] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [drops, setDrops] = useState([]);
  const intervalRef = useRef(null);
  const dropIdRef = useRef(0);

  const getRandomEmoji = () =>
    EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  const startRain = () => {
    if (isRaining) return;

    setIsRaining(true);
    const newEmoji = getRandomEmoji();
    setCurrentEmoji(newEmoji);

    createDrops(newEmoji);

    intervalRef.current = setInterval(() => {
      createDrops(newEmoji);
    }, 150);
  };

  const createDrops = (emoji) => {
    const newDrops = [];
    const ranges = [
      { start: 5, width: 20 },
      { start: 5, width: 20 },
      { start: 10, width: 20 },
      { start: -12, width: 20 },
      { start: 10, width: 20 },
      { start: -12, width: 20 },
      { start: 10, width: 20 },
    ];

    ranges.forEach((range, i) => {
      dropIdRef.current += 1;
      const x = range.start + Math.random() * range.width;
      const duration = 1 + Math.random() * 0.2;
      const delay = i * 5 + Math.random() * 0.25;

      newDrops.push({
        id: dropIdRef.current,
        emoji,
        x,
        duration,
        delay,
      });
    });

    setDrops((prev) => [...prev, ...newDrops]);

    setTimeout(() => {
      setDrops((prev) =>
        prev.filter((d) => !newDrops.some((nd) => nd.id === d.id))
      );
    }, 1000);
  };

  const stopRain = () => {
    setIsRaining(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimeout(() => {
      if (!isRaining) {
        setCurrentEmoji("");
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => startRain();
  const handleMouseLeave = () => stopRain();

  const handleTouchStart = (e) => {
    e.preventDefault();
    if (isRaining) {
      stopRain();
    } else {
      startRain();
    }
  };

  return (
    <>
      {/* About section — what nimbus does */}
      <section className="about">
        <div className="container">
          <div className="about__content">
            <h2 className="about__heading">Describe it. Generate it.</h2>
            <p className="about__description">
              Nimbus websites turns your ideas into fully built websites in
              seconds. Just describe what you want in plain English, customize
              with 60+ design options, and get production-ready code — no
              templates, no drag-and-drop, no coding required.
            </p>

            <div className="about__features">
              <div className="about__feature">
                <div className="about__feature-icon">
                  <Zap size={18} />
                </div>
                <div className="about__feature-text">
                  <span className="about__feature-title">AI-Powered</span>
                  <span className="about__feature-desc">
                    Generates unique, custom websites from a text prompt
                  </span>
                </div>
              </div>

              <div className="about__feature">
                <div className="about__feature-icon">
                  <Palette size={18} />
                </div>
                <div className="about__feature-text">
                  <span className="about__feature-title">
                    Fully Customizable
                  </span>
                  <span className="about__feature-desc">
                    Style, layout, animations, typography — fine-tune everything
                  </span>
                </div>
              </div>

              <div className="about__feature">
                <div className="about__feature-icon">
                  <Download size={18} />
                </div>
                <div className="about__feature-text">
                  <span className="about__feature-title">Download & Own</span>
                  <span className="about__feature-desc">
                    Export clean HTML/CSS/JS — your code, no lock-in
                  </span>
                </div>
              </div>
            </div>

            <p className="about__pricing">
              Pay per generation with tokens — no subscriptions, no hidden fees.
              Start free with tokens on signup.
            </p>
          </div>
        </div>
      </section>

      {/* Existing footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__content">
            <div
              className="footer__cloud-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              role="button"
              tabIndex={0}
            >
              <Cloudy
                size={64}
                className="footer__icon"
                strokeWidth={1.5}
                style={{
                  transform: isRaining ? "translateY(-12px)" : "none",
                  transition: "transform 0.4s ease",
                }}
              />

              <div className="footer__emoji-rain">
                {drops.map((drop) => (
                  <span
                    key={drop.id}
                    className="footer__emoji-drop"
                    style={{
                      left: `${drop.x}px`,
                      animation: `emojiRain ${drop.duration}s ease-out ${drop.delay}s forwards`,
                      color: `hsl(${(Math.random() * 360) | 0}, 80%, 60%)`,
                    }}
                  >
                    {drop.emoji}
                  </span>
                ))}
              </div>

              <style>{`
                @keyframes emojiRain {
                  0% {
                    opacity: 0.5;
                    transform: translate3d(0, 0, 0) scale(0.5);
                  }
                  90% {
                    opacity: 1;
                  }
                  100% {
                    opacity: 0;
                    transform: translate3d(0, 200px, 0) scale(1);
                  }
                }
              `}</style>
            </div>

            <nav className="footer__links">
              {isHomePage ? (
                <button
                  className="footer__link footer__link--btn"
                  onClick={openRoadmap}
                >
                  Roadmap
                </button>
              ) : (
                <Link to="/roadmap" className="footer__link">
                  Roadmap
                </Link>
              )}

              {isHomePage ? (
                <button
                  className="footer__link footer__link--btn"
                  onClick={openSupport}
                >
                  Support
                </button>
              ) : (
                <Link to="/support" className="footer__link">
                  Support
                </Link>
              )}

              {isHomePage ? (
                <button
                  className="footer__link footer__link--btn"
                  onClick={() => openLegal()}
                >
                  Terms & Legal
                </button>
              ) : (
                <Link to="/legal" className="footer__link">
                  Terms & Legal
                </Link>
              )}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
