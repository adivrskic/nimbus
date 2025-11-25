import { useState, useEffect } from 'react';
import { Layout, Palette, Rocket } from 'lucide-react';
import TemplateGallery from '../components/TemplateGallery';
import CustomizeModal from '../components/CustomizeModal';
import StyleShowcase from '../components/StyleShowcase';
import Blob from '../components/Blob';
import useReveal from '../hooks/useReveal';

import './Home.scss';

function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // IntersectionObserver hooks for reveal animations
  const [heroRef, heroVisible] = useReveal();
  const [stepsRef, stepsVisible] = useReveal();
  const [showcaseRef, showcaseVisible] = useReveal();
  const [templatesRef, templatesVisible] = useReveal();

  console.log(templatesRef, templatesVisible);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const steps = [
    {
      icon: <Palette size={40} />,
      number: '01',
      title: 'Choose Style',
      description: 'Pick from 5 unique design styles that match your aesthetic',
    },
    {
      icon: <Layout size={40} />,
      number: '02',
      title: 'Select Template',
      description: 'Choose a layout that fits your content and purpose',
    },
    {
      icon: <Rocket size={40} />,
      number: '03',
      title: 'Customize & Deploy',
      description: 'Add your content and launch your site instantly',
    },
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTemplate(null), 300);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className={`hero reveal ${heroVisible ? 'visible' : ''}`} ref={heroRef}>
        <Blob isDark={true} count={100} enableMouseInteraction={false} />
        <div className="container">
        <div className="hero__content">
          <h1 className="hero__title">
            Build your Website in 
            <span className="hero__title-outline">
              Minutes
            </span>
          </h1>
        </div>

          <div className="hero__subtitle-container">
            <p className="hero__subtitle">
              No coding required. Customize and deploy your perfect website today.
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
        className={`steps section reveal-stagger ${stepsVisible ? 'visible' : ''}`}
        ref={stepsRef}
        id="how-it-works"
      >
        <div className="container">
          <div className="steps__heading section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to your perfect website</p>
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
      <div className={`reveal ${showcaseVisible ? 'visible' : ''}`} ref={showcaseRef}>
        <StyleShowcase />
      </div>

      {/* Templates Section */}
      <section
        className={`templates section reveal ${templatesVisible ? 'visible' : ''}`}
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
        />
      )}
    </div>
  );
}

export default Home;
