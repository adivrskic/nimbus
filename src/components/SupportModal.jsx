import { useState } from "react";
import { Download, HelpCircle, Plus, X, Mail } from "lucide-react";

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
    <div className="support-overlay" onClick={onClose}>
      <div className="support-content" onClick={(e) => e.stopPropagation()}>
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

      <style jsx>{`
        .support-overlay {
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

        .support-content {
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

        .support-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }

        .support-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.125rem;
          font-weight: 700;
          color: #2b2b2b;
        }

        .support-close {
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

        .support-close:hover {
          background: rgba(0, 0, 0, 0.08);
          color: #2b2b2b;
        }

        .support-subtitle {
          font-size: 0.875rem;
          color: #666;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .support-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 0;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
        }

        .support-section:first-of-type {
          border-top: none;
          padding-top: 0;
        }

        .support-section__header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .support-section__title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #2b2b2b;
          margin: 0;
        }

        .support-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .support-step {
          display: flex;
          gap: 12px;
        }

        .support-step__number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 50%;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #2b2b2b;
          flex-shrink: 0;
        }

        .support-step__content {
          flex: 1;
        }

        .support-step__title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2b2b2b;
          margin: 0 0 4px 0;
        }

        .support-step__description {
          font-size: 0.8125rem;
          line-height: 1.5;
          color: #666;
          margin: 0;
        }

        .support-accordion {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .support-accordion__item {
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 8px;
          overflow: hidden;
        }

        .support-accordion__trigger {
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

        .support-accordion__trigger:hover {
          background: rgba(0, 0, 0, 0.04);
        }

        .support-accordion__title {
          flex: 1;
        }

        .support-accordion__icon {
          transition: transform 0.2s ease;
        }

        .support-accordion__trigger[aria-expanded="true"]
          .support-accordion__icon {
          transform: rotate(45deg);
        }

        .support-accordion__content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .support-accordion__content[aria-hidden="false"] {
          max-height: 200px;
        }

        .support-accordion__body {
          padding: 12px;
          font-size: 0.8125rem;
          line-height: 1.6;
          color: #666;
          background: white;
        }

        .support-contact {
          padding: 16px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 10px;
          margin-top: 8px;
          text-align: center;
        }

        .support-contact__title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2b2b2b;
          margin: 0 0 8px 0;
        }

        .support-contact__text {
          font-size: 0.8125rem;
          line-height: 1.5;
          color: #666;
          margin: 0;
        }

        .support-contact__link {
          color: #2b2b2b;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .support-contact__link:hover {
          color: #10b981;
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
          .support-content {
            width: 95%;
            max-height: 85vh;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default SupportModal;
