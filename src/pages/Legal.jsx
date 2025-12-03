// pages/Legal.jsx
import { useState } from "react";
import {
  FileText,
  Shield,
  AlertCircle,
  CreditCard,
  Mail,
  Plus,
  ArrowUp,
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
      content:
        "By accessing or using Nimbus, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.",
    },
    {
      title: "Description of Service",
      content: (
        <>
          Nimbus provides website template customization and deployment services
          including customizable website templates, visual editing tools, site
          deployment services, and downloadable HTML/CSS files.
        </>
      ),
    },
    {
      title: "User Accounts",
      content: (
        <>
          To access certain features, you must create an account. You agree to
          provide accurate, current, and complete information, maintain security
          of your account credentials, notify us immediately of any unauthorized
          access, and be responsible for all activities under your account.
        </>
      ),
    },
    {
      title: "License and Intellectual Property",
      content: (
        <>
          <strong>User Content:</strong> You retain all rights to content you
          upload, customize, or create using our Service.
          <br />
          <br />
          <strong>Nimbus Templates:</strong> We grant you a non-exclusive,
          worldwide, royalty-free license to use templates for personal and
          commercial projects. You may modify templates for your specific needs.
          You may not resell, redistribute, or sublicense our templates as-is.
          Attribution is appreciated but not required.
          <br />
          <br />
          <strong>Restrictions:</strong> You may not reverse engineer,
          decompile, or disassemble our software, use templates for illegal
          purposes, remove copyright notices, or claim templates as your
          original work.
        </>
      ),
    },
    {
      title: "Payment and Billing",
      content: (
        <>
          Pricing is $5 per site per month. Billing occurs monthly in advance.
          Payment is non-refundable except as required by law. We may change
          pricing with 30 days' notice.
        </>
      ),
    },
    {
      title: "Site Deployment and Hosting",
      content: (
        <>
          We deploy sites to Vercel or similar platforms. You're responsible for
          domain registration and DNS configuration. We reserve the right to
          remove sites that violate our policies. Backups are your
          responsibility.
        </>
      ),
    },
    {
      title: "Acceptable Use",
      content: (
        <>
          You agree not to use the Service for illegal activities, hate speech,
          harassment or discrimination, malware or viruses, spamming or
          phishing, copyright infringement, or adult content without appropriate
          warnings.
        </>
      ),
    },
    {
      title: "Termination",
      content: (
        <>
          We may suspend or terminate your account if you violate these Terms,
          engage in fraudulent activity, fail to pay fees, or create excessive
          support burden.
        </>
      ),
    },
  ];

  const privacyItems = [
    {
      title: "Information We Collect",
      content: (
        <>
          <strong>Account Information:</strong> Name, email, billing details
          <br />
          <strong>Usage Data:</strong> Templates used, customizations made,
          deployment history
          <br />
          <strong>Technical Data:</strong> IP address, browser type, device
          information
          <br />
          <strong>Payment Information:</strong> Processed securely by Stripe
        </>
      ),
    },
    {
      title: "How We Use Information",
      content: (
        <>
          We use your information to provide and improve our Service, process
          payments, send service notifications, respond to support requests, and
          analyze usage patterns.
        </>
      ),
    },
    {
      title: "Data Sharing",
      content: (
        <>
          We do not sell your data. We may share information with service
          providers (Vercel, Stripe, Supabase), when required by law, or in case
          of business transfers such as merger or acquisition.
        </>
      ),
    },
    {
      title: "Data Security",
      content: (
        <>
          We implement industry-standard security measures including encryption
          in transit and at rest, regular security audits, and access controls.
          However, no method is 100% secure.
        </>
      ),
    },
    {
      title: "Your Rights",
      content: (
        <>
          You may access your personal data, correct inaccurate data, delete
          your account and data, opt out of marketing emails, and export your
          data.
        </>
      ),
    },
  ];

  const copyrightItems = [
    {
      title: "DMCA Compliance",
      content:
        "We respond to notices of alleged copyright infringement as per the Digital Millennium Copyright Act (DMCA).",
    },
    {
      title: "Reporting Copyright Infringement",
      content: (
        <>
          To report infringement, send notice containing your contact
          information, description of copyrighted work, URL of infringing
          material, statement of good faith belief, statement under penalty of
          perjury, and your signature to{" "}
          <a href="mailto:copyright@nimbus.com">copyright@nimbus.com</a>
        </>
      ),
    },
    {
      title: "Counter-Notification",
      content: (
        <>
          If you believe material was removed in error, you may submit a
          counter-notification containing your contact information, description
          of removed material, statement under penalty of perjury, consent to
          jurisdiction, and your signature.
        </>
      ),
    },
    {
      title: "Repeat Infringers",
      content:
        "We terminate accounts of repeat infringers in appropriate circumstances.",
    },
  ];

  const refundItems = [
    {
      title: "General Policy",
      content:
        "Monthly subscriptions are non-refundable. You may cancel at any time. No refunds for partial months.",
    },
    {
      title: "Exceptions",
      content:
        "Refunds may be granted in cases of technical errors preventing Service use, duplicate charges, or as required by applicable law.",
    },
    {
      title: "Cancellation",
      content:
        "Cancel via account settings. Sites remain active until end of billing period. No refunds for cancellation.",
    },
  ];

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <header className="page-header">
          <h1 className="page-header__title">Legal & Terms</h1>
          <p className="page-header__subtitle">
            Please read these terms carefully before using our Service.
          </p>
          <p className="page-header__meta">Last updated: {lastUpdated}</p>
        </header>

        {/* Jump Navigation */}
        <nav className="jump-nav">
          <a href="#terms" className="jump-nav__link">
            <FileText size={16} />
            Terms of Service
          </a>
          <a href="#privacy" className="jump-nav__link">
            <Shield size={16} />
            Privacy Policy
          </a>
          <a href="#copyright" className="jump-nav__link">
            <AlertCircle size={16} />
            Copyright Policy
          </a>
          <a href="#refund" className="jump-nav__link">
            <CreditCard size={16} />
            Refund Policy
          </a>
        </nav>

        {/* Main Content */}
        <div className="page-content">
          {/* Terms of Service */}
          <section id="terms" className="content-section">
            <div className="content-section__header">
              <FileText size={20} />
              <h2 className="content-section__title">Terms of Service</h2>
            </div>
            <Accordion items={termsItems} />
          </section>

          {/* Privacy Policy */}
          <section id="privacy" className="content-section">
            <div className="content-section__header">
              <Shield size={20} />
              <h2 className="content-section__title">Privacy Policy</h2>
            </div>
            <Accordion items={privacyItems} />
          </section>

          {/* Copyright Policy */}
          <section id="copyright" className="content-section">
            <div className="content-section__header">
              <AlertCircle size={20} />
              <h2 className="content-section__title">Copyright Policy</h2>
            </div>
            <Accordion items={copyrightItems} />
          </section>

          {/* Refund Policy */}
          <section id="refund" className="content-section">
            <div className="content-section__header">
              <CreditCard size={20} />
              <h2 className="content-section__title">Refund Policy</h2>
            </div>
            <Accordion items={refundItems} />
            <div className="notice">
              <strong>Questions?</strong> For refund requests, contact us at{" "}
              <a href="mailto:support@nimbus.com">support@nimbus.com</a>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="content-section">
            <div className="content-section__header">
              <Mail size={20} />
              <h2 className="content-section__title">Contact & Disclaimer</h2>
            </div>
            <div className="content-section__body">
              <p>For legal notices, contact our Legal Department at:</p>
              <a href="mailto:legal@nimbus.com" className="email-link">
                <Mail size={14} />
                legal@nimbus.com
              </a>

              <div className="notice" style={{ marginTop: "24px" }}>
                <strong>Disclaimer:</strong> This document is provided for
                informational purposes only and does not constitute legal
                advice. We recommend consulting with a qualified attorney to
                ensure compliance with your specific jurisdiction and business
                requirements.
              </div>

              <p style={{ marginTop: "24px" }}>
                We reserve the right to modify these legal terms at any time. We
                will notify users of significant changes through email or
                service notifications. Continued use of our Service after
                changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Legal;
