import { Cloudy } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <Cloudy size={64} className="footer__icon" strokeWidth={1.5} />
          <nav className="footer__links">
            <Link to="/roadmap" className="footer__link">Roadmap</Link>
            <Link to="/support" className="footer__link">Support</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;