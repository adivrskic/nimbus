import { useState } from "react";
import {
  FileText,
  Shield,
  AlertCircle,
  CreditCard,
  Mail,
  Plus,
} from "lucide-react";
import "./SecondaryPages.scss";

function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion__item">
          <button
            className="accordion__trigger"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span className="accordion__title">{item.title}</span>
            <Plus className="accordion__icon" />
          </button>
          <div className="accordion__content" aria-hidden={openIndex !== index}>
            <div className="accordion__body">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Legal() {
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

  return (
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1 className="page-header__title">Legal</h1>
          <p className="page-header__subtitle">
            Terms, privacy, and policies for using Nimbus.
          </p>
          <p className="page-header__meta">Updated {lastUpdated}</p>
        </header>

        <nav className="jump-nav">
          <a href="#terms" className="jump-nav__link">
            <FileText size={14} />
            Terms
          </a>
          <a href="#privacy" className="jump-nav__link">
            <Shield size={14} />
            Privacy
          </a>
          <a href="#copyright" className="jump-nav__link">
            <AlertCircle size={14} />
            Copyright
          </a>
          <a href="#refund" className="jump-nav__link">
            <CreditCard size={14} />
            Refunds
          </a>
        </nav>

        <div className="page-content">
          <section id="terms" className="content-section">
            <div className="content-section__header">
              <FileText size={18} />
              <h2 className="content-section__title">Terms of Service</h2>
            </div>
            <Accordion items={termsItems} />
          </section>

          <section id="privacy" className="content-section">
            <div className="content-section__header">
              <Shield size={18} />
              <h2 className="content-section__title">Privacy Policy</h2>
            </div>
            <Accordion items={privacyItems} />
          </section>

          <section id="contact" className="content-section">
            <div className="content-section__header">
              <Mail size={18} />
              <h2 className="content-section__title">Contact</h2>
            </div>
            <div className="content-section__body">
              <p>For legal notices:</p>
              <a href="mailto:legal@nimbus.com" className="email-link">
                <Mail size={14} />
                legal@nimbus.com
              </a>

              <div className="notice" style={{ marginTop: "1.5rem" }}>
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

export default Legal;
