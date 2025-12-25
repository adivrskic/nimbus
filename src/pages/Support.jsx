import { useState } from "react";
import { Download, FileText, HelpCircle, Plus } from "lucide-react";
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
            <span className="accordion__title">{item.question}</span>
            <Plus className="accordion__icon" />
          </button>
          <div className="accordion__content" aria-hidden={openIndex !== index}>
            <div className="accordion__body">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Support() {
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

  return (
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1 className="page-header__title">Support</h1>
          <p className="page-header__subtitle">
            How to use your downloaded files and get help.
          </p>
        </header>

        <div className="page-content">
          <section className="content-section">
            <div className="content-section__header">
              <Download size={18} />
              <h2 className="content-section__title">Getting Started</h2>
            </div>
            <div className="guide-steps">
              {steps.map((step) => (
                <div key={step.number} className="guide-step">
                  <div className="guide-step__number">{step.number}</div>
                  <div className="guide-step__content">
                    <h3>{step.title}</h3>
                    <p>{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="content-section">
            <div className="content-section__header">
              <HelpCircle size={18} />
              <h2 className="content-section__title">FAQ</h2>
            </div>
            <Accordion items={faqItems} />
          </section>

          <div className="contact-block">
            <h3 className="contact-block__title">Need more help?</h3>
            <p className="contact-block__text">
              Email <a href="mailto:support@nimbus.com">support@nimbus.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
