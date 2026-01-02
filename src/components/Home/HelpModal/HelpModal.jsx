// components/Home/HelpModal/HelpModal.jsx
import { motion } from "framer-motion";
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
import {
  overlayVariants,
  contentVariants,
} from "../../../configs/animations.config";
import "./HelpModal.scss";

const HELP_SECTIONS = [
  {
    icon: MessageSquare,
    title: "Describe Your Site",
    content: `
      Start by typing a detailed description of the website you want to create.
      Mention your business type, audience, purpose, and tone — for example:
      “A modern portfolio for a freelance designer showcasing work and contact info.”
      The AI uses your description as the foundation for layout, colors, and copy.

      You can also include specifics like preferred sections (“include testimonials and pricing”),
      your call-to-action, or even the emotion you want the design to convey (clean, bold, inviting, etc.).
    `,
  },
  {
    icon: Settings,
    title: "Customize Options",
    content: `
      Click the **Options** button to access customization tools.
      There are over 60 categories including layout templates, color palettes, typography, spacing, and animation style.

      Fine-tune the look and structure globally or for each section individually.
      For example, you can change header alignment, hero height, or button style.
      If you’re experimenting, try adjusting the **Creativity slider** —
      higher values will produce more unique and less conventional combinations.
    `,
  },
  {
    icon: Palette,
    title: "Color Themes",
    content: `
      Choose from preset color themes or design your own palette.
      Each theme automatically adjusts text contrast and button styles for accessibility.
      Select “Custom” to define your exact brand colors — the preview updates instantly.

      Tip: For the best visual results, set your preferred mode (Light or Dark)
      so the AI can adapt shadows and gradients accordingly.
      Your color palette will carry through all generated components consistently.
    `,
  },
  {
    icon: Layout,
    title: "Sections & Layout",
    content: `
      Choose which content blocks your site should include — such as Hero, Features, About, Testimonials, Pricing, FAQ, or Contact forms.
      You can select multiple sections and reorder them freely before generation.

      Each section comes with several layout variations; for example, the Hero can have side-by-side layouts, overlays, or minimalist headers.
      The more structure you provide, the closer the AI output will match your brand’s expectations.
    `,
  },
  {
    icon: Coins,
    title: "Token System",
    content: `
      Each AI generation uses tokens. Tokens represent processing resources that vary with complexity.
      More detailed or fully designed outputs will use more tokens, while small layout tweaks use fewer.

      You can click the token counter at the top right to see your balance or purchase more tokens.
      The system dynamically shows estimated costs before generating.
      Using tokens strategically (for example, enhancing instead of regenerating) can help you get more from your balance.
    `,
  },
  {
    icon: Sparkles,
    title: "Generate",
    content: `
      Once you’re satisfied with your setup, click **Generate**.
      The AI will create a complete responsive layout using HTML, CSS, and semantic structure based on your inputs.

      The process usually takes a few seconds. After generation, review the output using the built-in preview viewer.
      If something feels off — like an awkward layout or too much whitespace — use the **Enhance** feature to refine without restarting.
    `,
  },
  {
    icon: Zap,
    title: "Enhance",
    content: `
      Use the Enhance input to make iterative improvements to your design.
      Simply describe the adjustment you want — for example:
      “Make the hero section darker with bolder typography,” or “Add subtle animations to feature cards.”

      The AI will modify only the affected parts, keeping the rest of your design intact.
      It’s perfect for polishing details like alignment, colors, or typography rhythm.
    `,
  },
  {
    icon: Download,
    title: "Download & Save",
    content: `
      When your website is ready, you can export or save your project.
      Click **Download** to get a fully responsive HTML package with embedded styles and assets.
      You can also save it to your workspace if you plan to keep editing later.

      Want version control? Each save keeps a historical version, so you can roll back or compare previous builds.
      This makes it easy to refine over time without losing earlier work.
    `,
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
        <div className="help-header">
          <div className="help-title">
            <HelpCircle size={20} />
            <span>How to Use Nimbus</span>
          </div>
          <button className="help-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="help-body">
          {HELP_SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                className="help-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <div className="help-section__title">
                  <div className="help-icon">
                    <Icon size={16} />
                  </div>
                  <span>{section.title}</span>
                </div>
                <div className="help-section__content">
                  {section.content.split("\n").map((line, idx) => (
                    <p key={idx}>{line.trim()}</p>
                  ))}
                </div>
              </motion.div>
            );
          })}

          <div className="help-tips">
            <h4 className="help-tips__title">Tips</h4>
            {TIPS.map((tip, index) => (
              <div key={index} className="help-tip">
                <Lightbulb size={14} />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HelpModal;
