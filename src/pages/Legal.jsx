// pages/Legal.jsx
import React from "react";
import { FileText, Shield, AlertCircle, CreditCard, Mail } from "lucide-react";
import "./Legal.scss";

function Legal() {
  const lastUpdated = "December 11, 2023"; // Update this date as needed

  return (
    <div className="legal-page">
      <div className="container">
        {/* Header */}
        <div className="legal-header">
          <div className="legal-header__icon">
            <FileText size={48} />
          </div>
          <div className="legal-header__content">
            <h1>Legal & Terms</h1>
            <p className="legal-subtitle">Last updated: {lastUpdated}</p>
            <p className="legal-intro">
              Please read these terms carefully before using our Service.
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="legal-navigation">
          <a href="#terms" className="nav-link">
            <FileText size={18} />
            Terms of Service
          </a>
          <a href="#privacy" className="nav-link">
            <Shield size={18} />
            Privacy Policy
          </a>
          <a href="#copyright" className="nav-link">
            <AlertCircle size={18} />
            Copyright Policy
          </a>
          <a href="#refund" className="nav-link">
            <CreditCard size={18} />
            Refund Policy
          </a>
          <a href="#contact" className="nav-link">
            <Mail size={18} />
            Contact
          </a>
        </div>

        {/* Main Content */}
        <div className="legal-content">
          {/* Terms of Service */}
          <section id="terms" className="legal-section">
            <h2 className="section-title">
              <FileText size={24} />
              Terms of Service
            </h2>

            <div className="legal-card">
              <h3>1. Acceptance of Terms</h3>
              <p>
                Welcome to Nimbus ("Service"). By accessing or using our
                Service, you agree to be bound by these Terms of Service
                ("Terms"). If you disagree with any part of the terms, you may
                not access the Service.
              </p>

              <h3>2. Description of Service</h3>
              <p>
                Nimbus provides website template customization and deployment
                services. We offer:
              </p>
              <ul>
                <li>Customizable website templates</li>
                <li>Visual editing tools</li>
                <li>Site deployment services</li>
                <li>Downloadable HTML/CSS files</li>
              </ul>

              <h3>3. User Accounts</h3>
              <p>
                To access certain features, you must create an account. You
                agree to:
              </p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>

              <h3>4. License and Intellectual Property</h3>
              <h4>User Content:</h4>
              <p>
                You retain all rights to content you upload, customize, or
                create using our Service.
              </p>

              <h4>Nimbus Templates:</h4>
              <ul>
                <li>
                  We grant you a non-exclusive, worldwide, royalty-free license
                  to use templates for personal and commercial projects
                </li>
                <li>You may modify templates for your specific needs</li>
                <li>
                  You may not resell, redistribute, or sublicense our templates
                  as-is
                </li>
                <li>Attribution is appreciated but not required</li>
              </ul>

              <h4>Restrictions:</h4>
              <p>You may not:</p>
              <ul>
                <li>
                  Reverse engineer, decompile, or disassemble our software
                </li>
                <li>Use templates for illegal purposes</li>
                <li>Remove copyright notices</li>
                <li>Claim templates as your original work</li>
              </ul>

              <h3>5. Payment and Billing</h3>
              <ul>
                <li>
                  <strong>Pricing:</strong> $5 per site per month
                </li>
                <li>Billing occurs monthly in advance</li>
                <li>Payment is non-refundable except as required by law</li>
                <li>We may change pricing with 30 days' notice</li>
              </ul>

              <h3>6. Site Deployment and Hosting</h3>
              <ul>
                <li>We deploy sites to Vercel or similar platforms</li>
                <li>
                  You're responsible for domain registration and DNS
                  configuration
                </li>
                <li>
                  We reserve the right to remove sites that violate our policies
                </li>
                <li>Backups are your responsibility</li>
              </ul>

              <h3>7. Acceptable Use</h3>
              <p>You agree not to use the Service for:</p>
              <ul>
                <li>Illegal activities or promoting illegal content</li>
                <li>Hate speech, harassment, or discrimination</li>
                <li>Malware, viruses, or harmful code</li>
                <li>Spamming or phishing</li>
                <li>Copyright infringement</li>
                <li>Adult content without appropriate warnings</li>
              </ul>

              <h3>8. Data Privacy</h3>
              <p>
                We collect and use data as described in our Privacy Policy. By
                using our Service, you consent to:
              </p>
              <ul>
                <li>Collection of usage data</li>
                <li>Storage of your customization preferences</li>
                <li>Processing necessary for Service operation</li>
              </ul>

              <h3>9. Termination</h3>
              <p>We may suspend or terminate your account if you:</p>
              <ul>
                <li>Violate these Terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Fail to pay fees</li>
                <li>Create excessive support burden</li>
              </ul>
            </div>
          </section>

          {/* Privacy Policy */}
          <section id="privacy" className="legal-section">
            <h2 className="section-title">
              <Shield size={24} />
              Privacy Policy
            </h2>

            <div className="legal-card">
              <h3>1. Information We Collect</h3>
              <ul>
                <li>
                  <strong>Account Information:</strong> Name, email, billing
                  details
                </li>
                <li>
                  <strong>Usage Data:</strong> Templates used, customizations
                  made, deployment history
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  device information
                </li>
                <li>
                  <strong>Payment Information:</strong> Processed securely by
                  Stripe
                </li>
              </ul>

              <h3>2. How We Use Information</h3>
              <ul>
                <li>Provide and improve our Service</li>
                <li>Process payments</li>
                <li>Send service notifications</li>
                <li>Respond to support requests</li>
                <li>Analyze usage patterns</li>
              </ul>

              <h3>3. Data Sharing</h3>
              <p>We do not sell your data. We may share information with:</p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> Vercel, Stripe, Supabase
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law
                </li>
                <li>
                  <strong>Business Transfers:</strong> In case of merger or
                  acquisition
                </li>
              </ul>

              <h3>4. Data Security</h3>
              <p>We implement industry-standard security measures:</p>
              <ul>
                <li>Encryption in transit and at rest</li>
                <li>Regular security audits</li>
                <li>Access controls</li>
                <li>However, no method is 100% secure</li>
              </ul>

              <h3>5. Data Retention</h3>
              <p>
                We retain data as long as your account is active or as needed
                for:
              </p>
              <ul>
                <li>Legal compliance</li>
                <li>Dispute resolution</li>
                <li>Service improvement</li>
              </ul>

              <h3>6. Your Rights</h3>
              <p>You may:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Opt out of marketing emails</li>
                <li>Export your data</li>
              </ul>
            </div>
          </section>

          {/* Copyright Policy */}
          <section id="copyright" className="legal-section">
            <h2 className="section-title">
              <AlertCircle size={24} />
              Copyright Policy
            </h2>

            <div className="legal-card">
              <h3>1. DMCA Compliance</h3>
              <p>
                We respond to notices of alleged copyright infringement as per
                the Digital Millennium Copyright Act (DMCA).
              </p>

              <h3>2. Reporting Copyright Infringement</h3>
              <p>To report infringement, send notice containing:</p>
              <ul>
                <li>Your contact information</li>
                <li>Description of copyrighted work</li>
                <li>URL of infringing material</li>
                <li>Statement of good faith belief</li>
                <li>Statement under penalty of perjury</li>
                <li>Your signature</li>
              </ul>
              <p className="legal-email">
                Send to:{" "}
                <a href="mailto:copyright@nimbus.com">copyright@nimbus.com</a>
              </p>

              <h3>3. Counter-Notification</h3>
              <p>
                If you believe material was removed in error, you may submit a
                counter-notification containing:
              </p>
              <ul>
                <li>Your contact information</li>
                <li>Description of removed material</li>
                <li>Statement under penalty of perjury</li>
                <li>Consent to jurisdiction</li>
                <li>Your signature</li>
              </ul>

              <h3>4. Repeat Infringers</h3>
              <p>
                We terminate accounts of repeat infringers in appropriate
                circumstances.
              </p>
            </div>
          </section>

          {/* Refund Policy */}
          <section id="refund" className="legal-section">
            <h2 className="section-title">
              <CreditCard size={24} />
              Refund Policy
            </h2>

            <div className="legal-card">
              <h3>1. General Policy</h3>
              <ul>
                <li>Monthly subscriptions are non-refundable</li>
                <li>You may cancel at any time</li>
                <li>No refunds for partial months</li>
              </ul>

              <h3>2. Exceptions</h3>
              <p>Refunds may be granted in cases of:</p>
              <ul>
                <li>Technical errors preventing Service use</li>
                <li>Duplicate charges</li>
                <li>As required by applicable law</li>
              </ul>

              <h3>3. Cancellation</h3>
              <ul>
                <li>Cancel via account settings</li>
                <li>Sites remain active until end of billing period</li>
                <li>No refunds for cancellation</li>
              </ul>

              <h3>4. Contact</h3>
              <p>
                For refund requests:{" "}
                <a href="mailto:support@nimbus.com">support@nimbus.com</a>
              </p>
            </div>
          </section>

          {/* Contact & Disclaimer */}
          <section id="contact" className="legal-section">
            <h2 className="section-title">
              <Mail size={24} />
              Contact & Disclaimer
            </h2>

            <div className="legal-card">
              <h3>Contact Information</h3>
              <p>For legal notices:</p>
              <div className="contact-info">
                <p>
                  <strong>Nimbus Legal Department</strong>
                </p>
                <p>
                  Email: <a href="mailto:legal@nimbus.com">legal@nimbus.com</a>
                </p>
                <p>Address: [Your Physical Address]</p>
              </div>

              <h3>Disclaimer</h3>
              <div className="disclaimer">
                <p>
                  <strong>Important:</strong> This document is provided for
                  informational purposes only and does not constitute legal
                  advice. We recommend consulting with a qualified attorney to
                  ensure compliance with your specific jurisdiction and business
                  requirements. Replace bracketed information with your actual
                  details.
                </p>
              </div>

              <h3>Changes to Legal Terms</h3>
              <p>
                We reserve the right to modify these legal terms at any time. We
                will notify users of significant changes through email or
                service notifications. Continued use of our Service after
                changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>
        </div>

        {/* Back to Top */}
        <div className="back-to-top">
          <a href="#" className="back-to-top__link">
            Back to top ↑
          </a>
        </div>
      </div>
    </div>
  );
}

export default Legal;
