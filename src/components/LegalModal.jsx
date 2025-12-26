import { useState } from "react";
import {
  FileText,
  Shield,
  AlertCircle,
  CreditCard,
  Mail,
  Plus,
  X,
} from "lucide-react";

function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="legal-accordion">
      {items.map((item, index) => (
        <div key={index} className="legal-accordion__item">
          <button
            className="legal-accordion__trigger"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span className="legal-accordion__title">{item.title}</span>
            <Plus className="legal-accordion__icon" size={14} />
          </button>
          <div
            className="legal-accordion__content"
            aria-hidden={openIndex !== index}
          >
            <div className="legal-accordion__body">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LegalModal({ isOpen, onClose }) {
  const lastUpdated = "December 11, 2023";

  const termsItems = [
    {
      title: "Acceptance of Terms",
      content: "By using Nimbus, you agree to be bound by these Terms.",
    },
    {
      title: "Service Description",
      content: "Nimbus provides website customization and deployment services.",
    },
    {
      title: "User Accounts",
      content: "You are responsible for your account and its security.",
    },
    {
      title: "Intellectual Property",
      content:
        "You retain rights to your content. Our templates are licensed for your use.",
    },
    {
      title: "Payment",
      content: "$5 per site per month. Billing is monthly and non-refundable.",
    },
    {
      title: "Deployment",
      content: "We deploy to platforms like Vercel. You manage domains.",
    },
    {
      title: "Termination",
      content: "We may suspend accounts for violations or non-payment.",
    },
  ];

  const privacyItems = [
    {
      title: "Data Collection",
      content:
        "We collect account info, usage data, and payment info via Stripe.",
    },
    {
      title: "Data Usage",
      content: "To provide service, process payments, and improve.",
    },
    {
      title: "Data Security",
      content: "Industry-standard encryption and security measures.",
    },
    {
      title: "Your Rights",
      content: "Access, correct, delete, or export your data.",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="legal-overlay" onClick={onClose}>
      <div className="legal-content" onClick={(e) => e.stopPropagation()}>
        <div className="legal-header">
          <div className="legal-title">Legal</div>
          <button className="legal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="legal-subtitle">
          Terms, privacy, and policies for using Nimbus.
        </div>
        <div className="legal-meta">Updated {lastUpdated}</div>

        <nav className="legal-nav">
          <a href="#terms" className="legal-nav__link">
            <FileText size={12} />
            Terms
          </a>
          <a href="#privacy" className="legal-nav__link">
            <Shield size={12} />
            Privacy
          </a>
          <a href="#copyright" className="legal-nav__link">
            <AlertCircle size={12} />
            Copyright
          </a>
          <a href="#refund" className="legal-nav__link">
            <CreditCard size={12} />
            Refunds
          </a>
        </nav>

        <div className="legal-body">
          <section id="terms" className="legal-section">
            <div className="legal-section__header">
              <FileText size={14} />
              <h3 className="legal-section__title">Terms of Service</h3>
            </div>
            <Accordion items={termsItems} />
          </section>

          <section id="privacy" className="legal-section">
            <div className="legal-section__header">
              <Shield size={14} />
              <h3 className="legal-section__title">Privacy Policy</h3>
            </div>
            <Accordion items={privacyItems} />
          </section>

          <section id="copyright" className="legal-section">
            <div className="legal-section__header">
              <AlertCircle size={14} />
              <h3 className="legal-section__title">Copyright & DMCA</h3>
            </div>
            <div className="legal-section__body">
              <p>
                All content and templates are © {new Date().getFullYear()}{" "}
                Nimbus or their respective owners.
              </p>
              <p>
                For DMCA takedown requests, please contact{" "}
                <a href="mailto:legal@nimbus.com">legal@nimbus.com</a>.
              </p>
            </div>
          </section>

          <section id="refund" className="legal-section">
            <div className="legal-section__header">
              <CreditCard size={14} />
              <h3 className="legal-section__title">Refund Policy</h3>
            </div>
            <div className="legal-section__body">
              <p>
                Monthly subscriptions are non-refundable. You can cancel at any
                time before the next billing cycle.
              </p>
              <p>
                Annual plans may be refunded within 14 days of purchase if no
                deployment has been made.
              </p>
            </div>
          </section>

          <section id="contact" className="legal-section">
            <div className="legal-section__header">
              <Mail size={14} />
              <h3 className="legal-section__title">Contact</h3>
            </div>
            <div className="legal-section__body">
              <p>For legal notices:</p>
              <a href="mailto:legal@nimbus.com" className="legal-email">
                <Mail size={12} />
                legal@nimbus.com
              </a>

              <div className="legal-notice">
                <strong>Note:</strong> This is informational, not legal advice.
                Consult an attorney for specific needs.
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Add this CSS to your Home.scss */}
      <style jsx>{`
        .legal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          opacity: 0;
          animation: fadeIn 0.2s ease forwards;
        }

        .legal-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 90%;
          max-width: 480px;
          max-height: 80vh;
          padding: 24px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          opacity: 0;
          transform: translateY(8px);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          overflow-y: auto;
        }

        .legal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }

        .legal-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2b2b2b;
        }

        .legal-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(0, 0, 0, 0.04);
          border: none;
          border-radius: 50%;
          color: #666;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .legal-close:hover {
          background: rgba(0, 0, 0, 0.08);
          color: #2b2b2b;
        }

        .legal-subtitle {
          font-size: 0.875rem;
          color: #666;
          line-height: 1.5;
        }

        .legal-meta {
          font-size: 0.75rem;
          color: #b3b3b3;
          margin-top: -4px;
        }

        .legal-nav {
          display: flex;
          gap: 8px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          overflow-x: auto;
        }

        .legal-nav__link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #666;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .legal-nav__link:hover {
          background: rgba(0, 0, 0, 0.04);
          color: #2b2b2b;
        }

        .legal-body {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-top: 4px;
        }

        .legal-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .legal-section__header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .legal-section__title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #2b2b2b;
          margin: 0;
        }

        .legal-section__body {
          font-size: 0.8125rem;
          line-height: 1.6;
          color: #666;
        }

        .legal-section__body p {
          margin: 0 0 8px;
        }

        .legal-accordion {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .legal-accordion__item {
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 8px;
          overflow: hidden;
        }

        .legal-accordion__trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px;
          background: rgba(0, 0, 0, 0.02);
          border: none;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #2b2b2b;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .legal-accordion__trigger:hover {
          background: rgba(0, 0, 0, 0.04);
        }

        .legal-accordion__title {
          flex: 1;
        }

        .legal-accordion__icon {
          transition: transform 0.2s ease;
        }

        .legal-accordion__trigger[aria-expanded="true"] .legal-accordion__icon {
          transform: rotate(45deg);
        }

        .legal-accordion__content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .legal-accordion__content[aria-hidden="false"] {
          max-height: 200px;
        }

        .legal-accordion__body {
          padding: 12px;
          font-size: 0.8125rem;
          line-height: 1.6;
          color: #666;
          background: white;
        }

        .legal-email {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 6px;
          font-size: 0.8125rem;
          color: #2b2b2b;
          text-decoration: none;
          margin-top: 8px;
          transition: all 0.15s ease;
        }

        .legal-email:hover {
          background: rgba(0, 0, 0, 0.04);
        }

        .legal-notice {
          padding: 10px;
          background: rgba(245, 158, 11, 0.05);
          border-radius: 6px;
          font-size: 0.75rem;
          color: #b45309;
          margin-top: 12px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .legal-content {
            width: 95%;
            max-height: 85vh;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default LegalModal;
