import { Cloudy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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

function Footer({ onLegalClick, onRoadmapClick, onSupportClick }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
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

    // Create initial drops
    createDrops(newEmoji);

    // Continue creating drops while hovering
    intervalRef.current = setInterval(() => {
      createDrops(newEmoji);
    }, 150);
  };

  const createDrops = (emoji) => {
    const newDrops = [];
    const ranges = [
      { start: 0, width: 20 },
      { start: 0, width: 20 },
      { start: 10, width: 20 },
      { start: -10, width: 20 },
      { start: 10, width: 20 },
      { start: -10, width: 20 },
      { start: 10, width: 20 },
    ];

    ranges.forEach((range, i) => {
      dropIdRef.current += 1;
      const x = range.start + Math.random() * range.width;
      const duration = 1 + Math.random() * 0.1;
      const delay = i * 5 + Math.random() * 0.2;

      newDrops.push({
        id: dropIdRef.current,
        emoji,
        x,
        duration,
        delay,
      });
    });

    setDrops((prev) => [...prev, ...newDrops]);

    // Auto-remove drops after animation
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

    // Clear emoji after delay
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
                transform: isRaining ? "translateY(-8px)" : "none",
                transition: "transform 0.3s ease",
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

            {/* Add this to your CSS */}
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
                onClick={onRoadmapClick}
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
                onClick={onSupportClick}
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
                onClick={onLegalClick}
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
  );
}

export default Footer;
