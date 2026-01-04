import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Shield,
  AlertCircle,
  CreditCard,
  Mail,
  Plus,
  X,
  Scale,
} from "lucide-react";
import "./LegalModal.scss";

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

function LegalModal({ isOpen, onClose, initialSection = null }) {
  const lastUpdated = "December 11, 2023";
  const bodyRef = useRef(null);

  // Scroll to section when modal opens with initialSection
  useEffect(() => {
    if (isOpen && initialSection && bodyRef.current) {
      // Small delay to ensure modal is rendered
      const timer = setTimeout(() => {
        const section = bodyRef.current.querySelector(`#${initialSection}`);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialSection]);

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
    <div
      className={`legal-overlay ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <div
        className={`legal-content ${isOpen ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header section */}
        <div className="legal-header-section">
          <div className="legal-header">
            <div className="legal-title">
              <Scale size={16} />
              <span>Legal</span>
            </div>
            <button className="legal-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          <div className="legal-subtitle">
            Terms, privacy, and policies for using Nimbus.
          </div>
          <div className="legal-meta">Updated {lastUpdated}</div>
        </div>

        {/* Scrollable body section */}
        <div className="legal-body" ref={bodyRef}>
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
    </div>
  );
}

export default LegalModal;
