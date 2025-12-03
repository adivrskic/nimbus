// pages/Support.jsx
import { useState } from "react";
import { Download, FileText, HelpCircle, Plus, ArrowUp } from "lucide-react";
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
  const downloadSteps = [
    {
      number: 1,
      title: "Extract the ZIP File",
      content: (
        <>
          After downloading, extract the ZIP file to a folder on your computer.
          You'll find an <code>index.html</code> file and an{" "}
          <code>images/</code> folder.
        </>
      ),
    },
    {
      number: 2,
      title: "View Locally",
      content: (
        <>
          Double-click the <code>index.html</code> file to open it in your web
          browser. Your website is now visible and ready to use.
        </>
      ),
    },
    {
      number: 3,
      title: "Add Your Images",
      content: (
        <>
          Place your images in the <code>images/</code> folder. Check the{" "}
          <code>README.txt</code> file inside for specific image names and
          dimensions.
        </>
      ),
    },
    {
      number: 4,
      title: "Deploy Online",
      content: (
        <>
          Upload all files to your web hosting service, or use free platforms:
          <ul>
            <li>
              <strong>Netlify:</strong> Drag and drop to{" "}
              <a
                href="https://netlify.com/drop"
                target="_blank"
                rel="noopener noreferrer"
              >
                netlify.com/drop
              </a>
            </li>
            <li>
              <strong>Vercel:</strong> Deploy with the Vercel CLI or GitHub
              integration
            </li>
            <li>
              <strong>GitHub Pages:</strong> Push to a repository and enable
              Pages
            </li>
          </ul>
        </>
      ),
    },
  ];

  const editingSteps = [
    {
      number: 1,
      title: "Open in a Text Editor",
      content: (
        <>
          Use any code editor like VS Code, Sublime Text, or even Notepad to
          open <code>index.html</code>.
        </>
      ),
    },
    {
      number: 2,
      title: "Find Content to Edit",
      content: (
        <>
          Look for sections marked with <code>data-editable</code> attributes.
          These are the parts you customized and can easily change.
        </>
      ),
    },
    {
      number: 3,
      title: "Customize Colors",
      content: (
        <>
          Find the <code>:root</code> section in the <code>&lt;style&gt;</code>{" "}
          tag and modify the <code>--accent</code> color value to change your
          theme.
        </>
      ),
    },
    {
      number: 4,
      title: "Save and Refresh",
      content:
        "Save your changes and refresh your browser to see the updates instantly.",
    },
  ];

  const faqItems = [
    {
      question: "Can I use these templates commercially?",
      answer:
        "Yes! All templates are yours to use for personal or commercial projects.",
    },
    {
      question: "Do I need coding knowledge?",
      answer:
        "No coding required! However, basic HTML knowledge helps if you want to make custom changes.",
    },
    {
      question: "How do I change the theme (light/dark)?",
      answer: (
        <>
          In the <code>&lt;html&gt;</code> tag, change <code>class="dark"</code>{" "}
          to <code>class="light"</code> or <code>class="auto"</code> for
          system-based theme.
        </>
      ),
    },
    {
      question: "Can I add more pages?",
      answer: (
        <>
          Currently, templates are single-page. Multi-page support is coming
          soon! Check our <a href="/roadmap">roadmap</a> for updates.
        </>
      ),
    },
    {
      question: "Where can I get help?",
      answer: (
        <>
          Email us at <a href="mailto:support@nimbus.com">support@nimbus.com</a>{" "}
          and we'll respond within 24 hours.
        </>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <header className="page-header">
          <h1 className="page-header__title">Support</h1>
          <p className="page-header__subtitle">
            Everything you need to get started with your downloaded files.
          </p>
        </header>

        {/* Main Content */}
        <div className="page-content">
          {/* Using Downloaded Files */}
          <section className="content-section">
            <div className="content-section__header">
              <Download size={20} />
              <h2 className="content-section__title">
                Using Your Downloaded Files
              </h2>
            </div>
            <div className="guide-steps">
              {downloadSteps.map((step) => (
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

          {/* Editing Your Website */}
          <section className="content-section">
            <div className="content-section__header">
              <FileText size={20} />
              <h2 className="content-section__title">Editing Your Website</h2>
            </div>
            <div className="guide-steps">
              {editingSteps.map((step) => (
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

          {/* FAQ */}
          <section className="content-section">
            <div className="content-section__header">
              <HelpCircle size={20} />
              <h2 className="content-section__title">Common Questions</h2>
            </div>
            <Accordion items={faqItems} />
          </section>

          {/* Contact */}
          <div className="contact-block">
            <h3 className="contact-block__title">Still need help?</h3>
            <p className="contact-block__text">
              Reach out to us at{" "}
              <a href="mailto:support@nimbus.com">support@nimbus.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
