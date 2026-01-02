import { useState } from "react";
import { Download, HelpCircle, Plus, X } from "lucide-react";
import "./SupportModal.scss";

function SupportAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="support-accordion">
      {items.map((item, index) => (
        <div key={index} className="support-accordion__item">
          <button
            className="support-accordion__trigger"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span className="support-accordion__title">{item.question}</span>
            <Plus className="support-accordion__icon" size={14} />
          </button>
          <div
            className="support-accordion__content"
            aria-hidden={openIndex !== index}
          >
            <div className="support-accordion__body">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportModal({ isOpen, onClose }) {
  const steps = [
    {
      number: 1,
      title: "Extract Files",
      content: "Unzip the downloaded folder to access index.html and images/.",
    },
    {
      number: 2,
      title: "View Locally",
      content: "Open index.html in your browser to see your site.",
    },
    {
      number: 3,
      title: "Add Your Images",
      content:
        "Place your images in the images/ folder. Check README.txt for sizes.",
    },
    {
      number: 4,
      title: "Deploy Online",
      content: "Upload to Netlify, Vercel, or any hosting service.",
    },
  ];

  const faqItems = [
    {
      question: "Can I use these commercially?",
      answer: "Yes, for both personal and commercial projects.",
    },
    {
      question: "Do I need coding skills?",
      answer: "No, but basic HTML helps for custom changes.",
    },
    {
      question: "How do I change the theme?",
      answer:
        "In the HTML tag, change class='dark' to class='light' or 'auto'.",
    },
    {
      question: "Can I add more pages?",
      answer: "Multi-page support is coming soon. Check our roadmap.",
    },
    {
      question: "Where can I get help?",
      answer: "Email support@nimbus.com for assistance.",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className={`support-overlay ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <div
        className={`support-content ${isOpen ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header section */}
        <div className="support-header-section">
          <div className="support-header">
            <div className="support-title">
              <HelpCircle size={16} />
              <span>Support</span>
            </div>
            <button className="support-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          <div className="support-subtitle">
            How to use your downloaded files and get help.
          </div>
        </div>

        {/* Scrollable body section */}
        <div className="support-body">
          <div className="support-section">
            <div className="support-section__header">
              <Download size={14} />
              <h3 className="support-section__title">Getting Started</h3>
            </div>
            <div className="support-steps">
              {steps.map((step) => (
                <div key={step.number} className="support-step">
                  <div className="support-step__number">{step.number}</div>
                  <div className="support-step__content">
                    <h4 className="support-step__title">{step.title}</h4>
                    <p className="support-step__description">{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="support-section">
            <div className="support-section__header">
              <HelpCircle size={14} />
              <h3 className="support-section__title">FAQ</h3>
            </div>
            <SupportAccordion items={faqItems} />
          </div>

          <div className="support-contact">
            <h4 className="support-contact__title">Need more help?</h4>
            <p className="support-contact__text">
              Email{" "}
              <a
                href="mailto:support@nimbus.com"
                className="support-contact__link"
              >
                support@nimbus.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportModal;
