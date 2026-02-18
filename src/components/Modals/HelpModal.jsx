// components/Home/HelpModal/HelpModal.jsx
import {
  X,
  Sparkles,
  Settings,
  Coins,
  Download,
  Lightbulb,
  MessageSquare,
  Palette,
  Layout,
  Zap,
  HelpCircle,
} from "lucide-react";
import "./modals.scss";

const HELP_SECTIONS = [
  {
    icon: MessageSquare,
    title: "Describe Your Site",
    items: [
      "Start by typing a detailed description of the website you want to create.",
      "Mention your business type, audience, purpose, and tone.",
      'Example: "A modern portfolio for a freelance designer showcasing work and contact info."',
      "Include specifics like preferred sections, your call-to-action, or the emotion you want (clean, bold, inviting).",
      "The AI uses your description as the foundation for layout, colors, and copy.",
    ],
  },
  {
    icon: Settings,
    title: "Customize Options",
    items: [
      "Click the **Customize** button to access customization tools.",
      "Over 60 categories including layout templates, color palettes, typography, spacing, and animation style.",
      "Fine-tune the look globally or for each section individually.",
      "Adjust header alignment, hero height, button style, and more.",
      "Try the **Creativity slider** — higher values produce more unique combinations.",
    ],
  },
  {
    icon: Palette,
    title: "Color Themes",
    items: [
      "Choose from preset color themes or design your own palette.",
      "Each theme automatically adjusts text contrast and button styles for accessibility.",
      'Select "Custom" to define your exact brand colors — the preview updates instantly.',
      "Set your preferred mode (Light or Dark) so the AI can adapt shadows and gradients.",
      "Your color palette will carry through all generated components consistently.",
    ],
  },
  {
    icon: Layout,
    title: "Sections & Layout",
    items: [
      "Choose which content blocks your site should include — Hero, Features, About, Testimonials, Pricing, FAQ, Contact, etc.",
      "Select multiple sections and reorder them freely before generation.",
      "Each section comes with several layout variations.",
      "Example: Hero can have side-by-side layouts, overlays, or minimalist headers.",
      "The more structure you provide, the closer the output will match your expectations.",
    ],
  },
  {
    icon: Coins,
    title: "Token System",
    items: [
      "Each AI generation uses tokens based on complexity.",
      "More detailed outputs use more tokens; small tweaks use fewer.",
      "Click the token counter to see your balance or purchase more.",
      "Estimated costs are shown before generating.",
      "Use tokens strategically — enhancing instead of regenerating saves tokens.",
    ],
  },
  {
    icon: Sparkles,
    title: "Generate",
    items: [
      "Once satisfied with your setup, click **Generate**.",
      "The AI creates a complete responsive layout using HTML and CSS based on your inputs.",
      "The process usually takes a few seconds.",
      "Review the output using the built-in preview viewer.",
      "If something feels off, use the **Enhance** feature to refine without restarting.",
    ],
  },
  {
    icon: Zap,
    title: "Enhance",
    items: [
      "Use the Enhance input to make iterative improvements to your design.",
      'Describe the adjustment you want — e.g., "Make the hero section darker with bolder typography."',
      "The AI modifies only the affected parts, keeping the rest intact.",
      "Perfect for polishing details like alignment, colors, or typography.",
      "Much more efficient than regenerating from scratch.",
    ],
  },
  {
    icon: Download,
    title: "Download & Save",
    items: [
      "When your website is ready, export or save your project.",
      "Click **Download** to get a fully responsive HTML package with embedded styles.",
      "Save to your workspace to keep editing later.",
      "Each save keeps a historical version for rollback or comparison.",
      "Refine over time without losing earlier work.",
    ],
  },
];

const TIPS = [
  "Be specific about your industry and audience for improved results.",
  "Use the 'Inspiration' option to guide the visual direction.",
  "Select multiple sections to build complete websites, not just landing pages.",
  "Try 'Enhance' instead of regenerating to save tokens.",
  "Color contrast matters — test light and dark modes before exporting.",
  "Short but detailed descriptions yield the best base structures.",
];

// Helper to render text with **bold** markers
function renderTextWithBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <div
        className={`modal-content modal-content--lg ${isOpen ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header section */}
        <div className="modal-header-section">
          <div className="modal-header">
            <div className="modal-title">
              <HelpCircle size={16} />
              <span>How to Use Nimbus</span>
            </div>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body section */}
        <div className="modal-body">
          {HELP_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="help-section">
                <div className="help-section__title">
                  <div className="help-icon">
                    <Icon size={16} />
                  </div>
                  <span>{section.title}</span>
                </div>
                <ul className="help-section__list">
                  {section.items.map((item, idx) => (
                    <li key={idx}>{renderTextWithBold(item)}</li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="help-tips">
            <h4 className="help-tips__title">
              <Lightbulb size={16} />
              <span>Quick Tips</span>
            </h4>
            <ul className="help-tips__list">
              {TIPS.map((tip, index) => (
                <li key={index} className="help-tip">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
