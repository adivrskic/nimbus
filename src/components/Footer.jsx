import React from "react";
import { useModal } from "../contexts/ModalContext";
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { openModal } = useModal();
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__links">
          <button
            className="footer__link"
            onClick={() => openModal("legal")}
          >
            Legal
          </button>
          <button
            className="footer__link"
            onClick={() => openModal("support")}
          >
            Support
          </button>
          <button
            className="footer__link"
            onClick={() => openModal("roadmap")}
          >
            Roadmap
          </button>
        </div>
        
        <div className="footer__cloud-container" role="button" tabindex="0" aria-label="Toggle theme">
          <div className="footer__cloud" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </div>
        </div>
        
        <div className="footer__copyright">
          © 2024 Nimbus. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;