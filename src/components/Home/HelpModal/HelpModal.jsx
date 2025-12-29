// components/Home/HelpModal/HelpModal.jsx - Help and usage guide modal
import { motion } from "framer-motion";
import {
  X,
  Sparkles,
  Settings,
  Coins,
  Download,
  Rocket,
  Lightbulb,
  MessageSquare,
  Palette,
  Layout,
  Zap,
  HelpCircle,
} from "lucide-react";
import {
  overlayVariants,
  contentVariants,
} from "../../../configs/animations.config";
import "./HelpModal.scss";

const HELP_SECTIONS = [
  {
    icon: MessageSquare,
    title: "Describe Your Site",
    content:
      "Start by typing a description of the website you want to create. Be as detailed as you like - mention your business, target audience, and what you want visitors to do.",
  },
  {
    icon: Settings,
    title: "Customize Options",
    content:
      "Click the Options button to access 60+ customization categories including templates, color palettes, typography, layouts, and more. Each selection shapes the AI's output.",
  },
  {
    icon: Palette,
    title: "Color Themes",
    content:
      "Choose from preset color palettes or create your own custom colors. Select 'Custom' in the Color Theme section to define exact brand colors.",
  },
  {
    icon: Layout,
    title: "Sections & Layout",
    content:
      "Specify which sections to include (Hero, Features, Pricing, FAQ, etc.) and how they should be arranged. You can select multiple sections.",
  },
  {
    icon: Coins,
    title: "Token System",
    content:
      "Each generation uses tokens. Click the token count to see a breakdown. More customizations may use more tokens but result in better targeted output.",
  },
  {
    icon: Sparkles,
    title: "Generate",
    content:
      "Click Generate to create your website. The AI will build a complete, responsive HTML page based on your description and selections.",
  },
  {
    icon: Zap,
    title: "Enhance",
    content:
      "After generating, you can enhance or modify your site. Describe changes in the enhance input and the AI will update your design.",
  },
  {
    icon: Download,
    title: "Download & Save",
    content:
      "Download your generated HTML file directly, save it to your projects for later editing, or deploy it live with one click.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    content:
      "Ready to go live? Click Deploy to publish your site to a unique URL instantly. Share it with the world in seconds.",
  },
];

const TIPS = [
  "Be specific about your industry and target audience for better results",
  "Use the 'Inspiration' option to match styles of well-known websites",
  "Select multiple sections to build a comprehensive landing page",
  "Custom colors work best with Light or Dark mode explicitly set",
  "The 'Creativity' slider controls how experimental the AI gets",
  "Use 'Enhance' to iterate on your design without starting over",
];

function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="help-overlay"
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="help-content"
        onClick={(e) => e.stopPropagation()}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="help-header">
          <div className="help-title">
            <HelpCircle size={18} />
            <span>How to Use</span>
          </div>
          <button className="help-close" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        {/* Sections */}
        {HELP_SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              className="help-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="help-section__title">
                <Icon size={14} />
                <span>{section.title}</span>
              </div>
              <div className="help-section__content">
                <p>{section.content}</p>
              </div>
            </motion.div>
          );
        })}

        {/* Tips */}
        <div className="help-tip">
          <Lightbulb size={14} />
          <span>
            <strong>Pro Tip:</strong>{" "}
            {TIPS[Math.floor(Math.random() * TIPS.length)]}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HelpModal;
