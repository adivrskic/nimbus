import { Cloudy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./Footer.scss";

function Footer({ onLegalClick, onRoadmapClick, onSupportClick }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <Cloudy size={64} className="footer__icon" strokeWidth={1.5} />
          <nav className="footer__links">
            {/* Show modal button on Home, regular link on other pages */}
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

            {/* Show modal button on Home, regular link on other pages */}
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

            {/* Show modal button on Home, regular link on other pages */}
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
