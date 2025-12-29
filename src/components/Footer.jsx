import { Cloudy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Footer.scss";

const CLOUDS_CONFIG = [
  { top: 6, left: 8, size: 82, opacity: 0.04, rotate: -12 },
  { top: 10, left: 39, size: 86, opacity: 0.07, rotate: 6 },
  { top: 18, left: 78, size: 98, opacity: 0.08, rotate: -4 },
  { top: 10, left: 68, size: 88, opacity: 0.05, rotate: 8 },
  { top: 8, left: 16, size: 104, opacity: 0.07, rotate: 10 },
  { top: 26, left: 25, size: 97, opacity: 0.05, rotate: -15 },
  { top: 30, left: 60, size: 100, opacity: 0.07, rotate: -7 },
  { top: 34, left: 88, size: 82, opacity: 0.05, rotate: 9 },
  { top: 35, left: 2, size: 96, opacity: 0.06, rotate: -12 },
  { top: 42, left: 35, size: 88, opacity: 0.04, rotate: 8 },
  { top: 46, left: 72, size: 80, opacity: 0.06, rotate: -6 },
  { top: 14, left: 94, size: 93, opacity: 0.08, rotate: 11 },
  { top: 56, left: 14, size: 78, opacity: 0.06, rotate: -10 },
  { top: 58, left: 42, size: 92, opacity: 0.07, rotate: 4 },
  { top: 64, left: 82, size: 92, opacity: 0.06, rotate: -8 },
  { top: 68, left: 28, size: 80, opacity: 0.07, rotate: 10 },
  { top: 72, left: 6, size: 75, opacity: 0.07, rotate: -4 },
  { top: 74, left: 58, size: 85, opacity: 0.05, rotate: 8 },
  { top: 78, left: 90, size: 98, opacity: 0.06, rotate: -8 },
  { top: 82, left: 18, size: 96, opacity: 0.05, rotate: 6 },
  { top: 85, left: 37, size: 97, opacity: 0.06, rotate: -6 },
  { top: 76, left: 70, size: 76, opacity: 0.07, rotate: 8 },
  { top: -9, left: 55, size: 90, opacity: 0.05, rotate: -5 },
  { top: 2, left: -2, size: 94, opacity: 0.06, rotate: 7 },
  { top: 0, left: 31, size: 84, opacity: 0.05, rotate: -9 },
  { top: 72, left: -3, size: 88, opacity: 0.07, rotate: 12 },
  { top: 56, left: 96, size: 86, opacity: 0.06, rotate: -6 },
  { top: -4, left: 85, size: 92, opacity: 0.05, rotate: 5 },
];
function Footer({ onLegalClick, onRoadmapClick, onSupportClick }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isHovered, setIsHovered] = useState(false);
  return (
    <footer className="footer">
      {/* Background clouds */}
      <div className={`footer__clouds ${isHovered ? "is-visible" : ""}`}>
        {CLOUDS_CONFIG.map((cloud, index) => (
          <Cloudy
            key={index}
            className="footer__cloud"
            strokeWidth={1.2}
            style={{
              top: `${cloud.top}%`,
              left: `${cloud.left}%`,
              width: cloud.size,
              height: cloud.size,
              opacity: cloud.opacity,
              transform: `rotate(${cloud.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="container">
        <div className="footer__content">
          <Cloudy
            size={64}
            className="footer__icon"
            strokeWidth={1.5}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />

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
