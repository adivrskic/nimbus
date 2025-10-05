import { useState, useEffect } from 'react';
import { ArrowRight, Layout, Palette, Rocket } from 'lucide-react';
import TemplateGallery from '../components/TemplateGallery';
import CustomizeModal from '../components/CustomizeModal';
import ParticleWave from '../components/ParticleWave';

import './Home.scss';

function Home({ theme }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive particle wave props
  const particleProps = isMobile
    ? {
        particleCount: 15000,
        minRadiusScale: 1.2,
        baseSpeed: 0.8,
        speedVariation: 0,
        perspective: 600,
        sizeMin: 5,
        sizeMax: 8,
        enableTilt: true,
        tiltIntensity: 0.3,
        baseRadius: 80,
        morphSpeed: 0.04,
        rotationSpeed: 0.3,
        pulseSpeed: 0.01,
      }
    : {
        particleCount: 10000,
        minRadiusScale: 1.625,
        baseSpeed: 1,
        speedVariation: 0,
        perspective: 800,
        sizeMin: 7,
        sizeMax: 10,
        enableTilt: true,
        tiltIntensity: 0.5,
        baseRadius: 140,
        morphSpeed: 0.044,
        rotationSpeed: 0.34,
        pulseSpeed: 0.01,
      };

  const steps = [
    {
      icon: <Layout size={40} />,
      number: "01",
      title: "Choose Template",
      description: "Browse our collection of professional, ready-to-use templates"
    },
    {
      icon: <Palette size={40} />,
      number: "02", 
      title: "Customize",
      description: "Personalize colors, fonts, text, and images to match your brand"
    },
    {
      icon: <Rocket size={40} />,
      number: "03",
      title: "Deploy",
      description: "Download your files or deploy instantly with our hosting"
    }
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedTemplate(null);
    }, 300);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <ParticleWave
          isDark={theme === 'dark'}
          {...particleProps}
        />
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title">
              Build Your Website in
              <span className="hero__title-gradient"> Minutes</span>
            </h1>
            <p className="hero__subtitle">
              Professional templates, zero coding required. Choose, customize, and deploy your perfect website today.
            </p>
            <div className="hero__cta">
              <a href="#how-it-works" className="btn btn-primary">
                Get Started For Free
              </a>
              <a href="#templates" className="btn btn-secondary">
                View Templates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how-it-works"className="steps section">
        <div className="container">
          <h2 className="steps__heading">How It Works</h2>
          <div className="steps__grid">
            {steps.map((step, index) => (
              <div key={index} className={`step-card ${index % 2 === 1 ? 'step-card--reverse' : ''}`}>
                <div className="step-card__number">{step.number}</div>
                
                <div className="step-card__icon-wrapper">
                  <div className="step-card__icon">
                    {step.icon}
                  </div>
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

      {/* Templates Section */}
      <section id="templates" className="templates section">
        <div className="container">
          <div className="templates__header">
            <h2>Choose Your Template</h2>
            <p>Start with a professionally designed template and make it your own</p>
          </div>
          <TemplateGallery onTemplateSelect={handleTemplateSelect} />
        </div>
      </section>

      {/* Customize Modal */}
      <CustomizeModal
        templateId={selectedTemplate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userTheme={theme}
      />
    </div>
  );
}

export default Home;