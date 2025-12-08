import { useState, useEffect } from "react";
import { Layout, Palette, Rocket } from "lucide-react";
import TemplateGallery from "../components/TemplateGallery";
import CustomizeModal from "../components/CustomizeModal";
import StyleShowcase from "../components/StyleShowcase";
import Blob from "../components/Blob";
import useReveal from "../hooks/useReveal";
import "./Home.scss";

function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editSiteData, setEditSiteData] = useState(null); // NEW: Store site data
  const [editDraftData, setEditDraftData] = useState(null); // For drafts too

  const [heroRef, heroVisible] = useReveal();
  const [stepsRef, stepsVisible] = useReveal();
  const [showcaseRef, showcaseVisible] = useReveal();
  const [templatesRef, templatesVisible] = useReveal();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Listen for events from UserAccountModal
  useEffect(() => {
    // Event for editing drafts
    const handleOpenCustomizeWithDraft = (event) => {
      console.log("Received open-customize-with-draft event:", event.detail);
      const { templateId, draft } = event.detail;

      setSelectedTemplate(templateId);

      localStorage.setItem(
        "editDraft",
        JSON.stringify({
          id: draft.id,
          templateId: draft.template_id,
          customization: draft.customization,
          theme: draft.theme || "minimal",
          colorMode: draft.color_mode || "auto",
          draftName: draft.draft_name,
        })
      );

      localStorage.setItem("isEditingDraft", "true");

      // Open modal after a short delay
      setTimeout(() => {
        setIsModalOpen(true);
      }, 10);
    };

    // NEW: Event for editing deployed sites
    const handleOpenCustomizeWithSite = (event) => {
      console.log("Opening customize for deployed site:", event.detail);
      const { templateId, isDeployedSite, siteData } = event.detail;

      setSelectedTemplate(templateId);
      setEditSiteData(siteData); // Store site data in state

      setTimeout(() => {
        setIsModalOpen(true);
      }, 10);
    };

    // Register both event listeners
    window.addEventListener(
      "open-customize-with-draft",
      handleOpenCustomizeWithDraft
    );

    window.addEventListener(
      "open-customize-with-site",
      handleOpenCustomizeWithSite
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "open-customize-with-draft",
        handleOpenCustomizeWithDraft
      );
      window.removeEventListener(
        "open-customize-with-site",
        handleOpenCustomizeWithSite
      );
    };
  }, []);

  const steps = [
    {
      number: 1,
      icon: <Palette />,
      title: "Choose Your Template",
      description:
        "Select from our professionally designed templates. Preview each one live to see how your content would look.",
    },
    {
      number: 2,
      icon: <Layout />,
      title: "Customize Everything",
      description:
        "Use our visual editor to customize every detail. See changes instantly across all device sizes.",
    },
    {
      number: 3,
      icon: <Rocket />,
      title: "Publish Instantly",
      description:
        "Go live with one click. Your site comes with free SSL, SEO optimization, and high-speed hosting.",
    },
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 10);
  };

  // Update handleCloseModal to clear edit data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditSiteData(null);
    setEditDraftData(null);
    setTimeout(() => setSelectedTemplate(null), 400);
  };
  console.log("site andd raft: ", editSiteData, editDraftData);
  return (
    <div className="home">
      {/* Hero Section */}
      <section
        className={`hero reveal ${heroVisible ? "visible" : ""}`}
        ref={heroRef}
      >
        <Blob isDark={true} count={100} enableMouseInteraction={false} />
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title">
              Build your Website in
              <span className="hero__title-outline">Minutes</span>
            </h1>
          </div>

          <div className="hero__subtitle-container">
            <p className="hero__subtitle">
              No coding required.
              <br /> Customize and deploy your perfect website today.
            </p>
            <div className="hero__cta">
              <a href="#templates" className="btn btn-primary">
                View Templates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section
        className={`steps section reveal-stagger ${
          stepsVisible ? "visible" : ""
        }`}
        ref={stepsRef}
        id="how-it-works"
      >
        <div className="container">
          <div className="steps__heading section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Three simple steps to your perfect website
            </p>
          </div>

          <div className="steps__grid">
            {steps.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-card__number">{step.number}</div>
                <div className="step-card__icon-wrapper">
                  <div className="step-card__icon">{step.icon}</div>
                </div>
                <div className="step-card__content">
                  <h3 className="step-card__title">{step.title}</h3>
                  <p className="step-card__description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Showcase Section */}
      <div
        className={`reveal ${showcaseVisible ? "visible" : ""}`}
        ref={showcaseRef}
      >
        <StyleShowcase />
      </div>

      {/* Templates Section */}
      <section
        className={`templates section reveal ${
          templatesVisible ? "visible" : ""
        }`}
        ref={templatesRef}
        id="templates"
      >
        <div className="container">
          <div className="templates__header section-header">
            <h2 className="section-title">Choose Your Template</h2>
            <p className="section-subtitle">
              Professional designs that adapt to any style you choose
            </p>
          </div>

          <TemplateGallery onTemplateSelect={handleTemplateSelect} />
        </div>
      </section>

      {/* Customize Modal */}
      {selectedTemplate && (
        <CustomizeModal
          templateId={selectedTemplate}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editSiteData={editSiteData} // Pass site data
          editDraftData={editDraftData} // Pass draft data
        />
      )}
    </div>
  );
}

export default Home;
