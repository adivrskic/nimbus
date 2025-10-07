import { useState, useEffect } from 'react';
import { X, Download, Construction, ExternalLink } from 'lucide-react';
import CustomizationPanel from './CustomizationPanel';
import LivePreview from './LivePreview';
import { generateZip } from '../utils/generateZip';
import { generateHTML } from '../utils/templateRenderer';
import PaymentModal from './PaymentModal';
import './CustomizeModal.scss';

const templateConfigs = {
  'business-card': {
    id: 'business-card',
    name: 'Modern Business Card',
    category: 'Personal',
    customizable: {
      name: { type: 'text', default: 'Alex Morgan', label: 'Your Name' },
      title: { type: 'text', default: 'Product Designer', label: 'Job Title' },
      company: { type: 'text', default: 'Creative Studio', label: 'Company' },
      location: { type: 'text', default: 'San Francisco, CA', label: 'Location' },
      
      contactInfo: {
        type: 'group',
        label: 'Contact Information',
        itemLabel: 'Contact',
        min: 1,
        max: 5,
        fields: {
          type: { type: 'select', options: ['Email', 'Phone', 'Website', 'LinkedIn', 'Twitter', 'GitHub', 'Instagram', 'Facebook', 'WhatsApp', 'Telegram', 'Discord', 'Other'], label: 'Type', default: 'Email' },
          value: { type: 'text', label: 'Value', default: '' }
        },
        default: [
          { type: 'Email', value: 'alex@example.com' },
          { type: 'Phone', value: '+1 (555) 123-4567' },
          { type: 'Website', value: 'alexmorgan.com' }
        ]
      },
      
      accentColor: { type: 'color', default: '#eb1736', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Auto',
        label: 'Theme'
      }
    }
  },
  'split-profile': {
    id: 'split-profile',
    name: 'Split Profile',
    category: 'Personal',
    customizable: {
      name: { type: 'text', default: 'Marcus Thompson', label: 'Your Name' },
      role: { type: 'text', default: 'Digital Creator', label: 'Role/Title' },
      location: { type: 'text', default: 'Los Angeles, CA', label: 'Location' },
      bio: { 
        type: 'textarea',
        default: 'I create compelling content that bridges creativity and technology. Specializing in visual storytelling, brand development, and digital experiences that leave lasting impressions.',
        label: 'Bio'
      },
      availability: { type: 'text', default: 'Available for Projects', label: 'Availability Status' },
      
      skills: {
        type: 'repeatable',
        label: 'Skills',
        itemLabel: 'Skill',
        default: ['Content Creation', 'Brand Strategy', 'Video Production', 'Social Media'],
        max: 8
      },
      
      contactInfo: {
        type: 'group',
        label: 'Contact Information',
        itemLabel: 'Contact',
        min: 1,
        max: 4,
        fields: {
          type: { type: 'select', options: ['Email', 'Phone', 'Website'], label: 'Type', default: 'Email' },
          value: { type: 'text', label: 'Value', default: '' }
        },
        default: [
          { type: 'Email', value: 'marcus@example.com' },
          { type: 'Phone', value: '+1 (555) 789-0123' },
          { type: 'Website', value: 'marcusthompson.com' }
        ]
      },
      
      socialLinks: {
        type: 'group',
        label: 'Social Links',
        itemLabel: 'Social Link',
        min: 0,
        max: 6,
        fields: {
          platform: { type: 'text', label: 'Platform', default: '' },
          url: { type: 'text', label: 'URL/Handle', default: '' }
        },
        default: [
          { platform: 'Instagram', url: '@marcusthompson' },
          { platform: 'Twitter', url: '@marcust' },
          { platform: 'LinkedIn', url: 'linkedin.com/in/marcusthompson' }
        ]
      },
      profileImage: { 
        type: 'image', 
        label: 'Profile Photo',
        accept: 'image/*'
      },
      
      accentColor: { type: 'color', default: '#eb1736', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Dark',
        label: 'Theme'
      }
    }
  },
  'profile': {
    id: 'profile',
    name: 'Personal Profile',
    category: 'Personal',
    customizable: {
      name: { type: 'text', default: 'Jordan Chen', label: 'Your Name' },
      tagline: { type: 'text', default: 'Creative Developer & Designer', label: 'Tagline' },
      bio: { 
        type: 'textarea',
        default: 'I craft beautiful digital experiences that merge creativity with functionality. Passionate about clean code and elegant design.',
        label: 'Bio'
      },
      
      socialLinks: {
        type: 'group',
        label: 'Social Links',
        itemLabel: 'Social Link',
        min: 1,
        max: 6,
        fields: {
          platform: { type: 'text', label: 'Platform', default: '' },
          url: { type: 'text', label: 'URL/Handle', default: '' }
        },
        default: [
          { platform: 'Email', url: 'jordan@example.com' },
          { platform: 'Twitter', url: '@jordanchen' },
          { platform: 'GitHub', url: 'github.com/jordanchen' },
          { platform: 'LinkedIn', url: 'linkedin.com/in/jordanchen' }
        ]
      },
      
      accentColor: { type: 'color', default: '#eb1736', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Auto',
        label: 'Theme'
      }
    }
  },
  'product-launch': {
    id: 'product-launch',
    name: 'Product Launch',
    category: 'Landing Page',
    customizable: {
      productName: { type: 'text', default: 'Nexus', label: 'Product Name' },
      tagline: { type: 'text', default: 'The Future of Productivity', label: 'Tagline' },
      description: { 
        type: 'textarea',
        default: 'Transform the way you work with AI-powered tools that adapt to your workflow. Experience seamless collaboration and unprecedented efficiency.',
        label: 'Description'
      },
      ctaText: { type: 'text', default: 'Start Free Trial', label: 'CTA Button Text' },
      ctaUrl: { type: 'text', default: '#signup', label: 'CTA Button URL' },
      
      features: {
        type: 'group',
        label: 'Features',
        itemLabel: 'Feature',
        min: 1,
        max: 6,
        fields: {
          name: { type: 'text', label: 'Feature Name', default: '' }
        },
        default: [
          { name: 'AI-Powered Automation' },
          { name: 'Real-time Collaboration' },
          { name: 'Enterprise Security' }
        ]
      },
      
      socialLinks: {
        type: 'group',
        label: 'Social Links',
        itemLabel: 'Social Link',
        min: 0,
        max: 4,
        fields: {
          platform: { type: 'text', label: 'Platform', default: '' },
          url: { type: 'text', label: 'URL', default: '' }
        },
        default: [
          { platform: 'Twitter', url: 'twitter.com/nexus' },
          { platform: 'LinkedIn', url: 'linkedin.com/company/nexus' }
        ]
      },
      
      accentColor: { type: 'color', default: '#eb1736', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Dark',
        label: 'Theme'
      }
    }
  },
  'startup-hero': {
    id: 'startup-hero',
    name: 'Startup Hero',
    category: 'Landing Page',
    customizable: {
      companyName: { type: 'text', default: 'Velocity', label: 'Company Name' },
      headline: { type: 'text', default: 'Ship Faster. Build Better.', label: 'Headline' },
      subheadline: { 
        type: 'textarea',
        default: 'The all-in-one platform for modern development teams. Deploy in seconds, scale effortlessly, and focus on what matters—building great products.',
        label: 'Subheadline'
      },
      ctaPrimary: { type: 'text', default: 'Get Started Free', label: 'Primary CTA' },
      ctaSecondary: { type: 'text', default: 'View Demo', label: 'Secondary CTA' },
      email: { type: 'text', default: 'hello@velocity.com', label: 'Contact Email' },
      
      stats: {
        type: 'group',
        label: 'Statistics',
        itemLabel: 'Stat',
        min: 1,
        max: 6,
        fields: {
          value: { type: 'text', label: 'Value', default: '' },
          label: { type: 'text', label: 'Label', default: '' }
        },
        default: [
          { value: '50K+', label: 'Developers' },
          { value: '99.9%', label: 'Uptime' },
          { value: '24/7', label: 'Support' }
        ]
      },
      
      accentColor: { type: 'color', default: '#eb1736', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Light',
        label: 'Theme'
      }
    }
  },
  'fine-dining': {
    id: 'fine-dining',
    name: 'Fine Dining Menu',
    category: 'Restaurant',
    customizable: {
      restaurantName: { type: 'text', default: 'Élégance', label: 'Restaurant Name' },
      tagline: { type: 'text', default: 'Contemporary French Cuisine', label: 'Tagline' },
      chefName: { type: 'text', default: 'Chef Laurent Dubois', label: 'Chef Name' },
      address: { type: 'text', default: '123 Gourmet Avenue, New York, NY', label: 'Address' },
      phone: { type: 'text', default: '+1 (555) 123-4567', label: 'Phone' },
      hours: { type: 'text', default: 'Tue-Sat: 5:30 PM - 10:30 PM', label: 'Hours' },
      
      appetizers: {
        type: 'group',
        label: 'Appetizers',
        itemLabel: 'Appetizer',
        min: 1,
        max: 8,
        fields: {
          name: { type: 'text', label: 'Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          { name: 'Foie Gras Terrine', description: 'House-made terrine with brioche toast, fig compote & micro greens', price: '24' }
        ]
      },
      
      entrees: {
        type: 'group',
        label: 'Entrées',
        itemLabel: 'Entrée',
        min: 1,
        max: 8,
        fields: {
          name: { type: 'text', label: 'Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          { name: 'Herb-Crusted Lamb Rack', description: 'Colorado lamb with rosemary jus, truffle potato purée & seasonal vegetables', price: '58' }
        ]
      },
      
      desserts: {
        type: 'group',
        label: 'Desserts',
        itemLabel: 'Dessert',
        min: 1,
        max: 8,
        fields: {
          name: { type: 'text', label: 'Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          { name: 'Crème Brûlée', description: 'Classic vanilla bean custard with caramelized sugar & fresh berries', price: '16' }
        ]
      },
      
      accentColor: { type: 'color', default: '#d4af37', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Dark',
        label: 'Theme'
      }
    }
  },
  'casual-bistro': {
    id: 'casual-bistro',
    name: 'Casual Bistro Menu',
    category: 'Restaurant',
    customizable: {
      restaurantName: { type: 'text', default: 'The Daily Grind', label: 'Restaurant Name' },
      tagline: { type: 'text', default: 'Fresh. Local. Delicious.', label: 'Tagline' },
      location: { type: 'text', default: 'Downtown Portland', label: 'Location' },
      phone: { type: 'text', default: '(555) 987-6543', label: 'Phone' },
      instagram: { type: 'text', default: '@thedailygrind', label: 'Instagram Handle' },
      specialText: { type: 'text', default: "Chef's Special: Wild Mushroom Risotto", label: 'Special of the Day' },
      
      breakfastItems: {
        type: 'group',
        label: 'Breakfast Items',
        itemLabel: 'Breakfast Item',
        min: 1,
        max: 8,
        fields: {
          name: { type: 'text', label: 'Name', default: '' },
          description: { type: 'text', label: 'Description', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          { name: 'Avocado Toast', description: 'Smashed avocado, poached eggs, chili flakes on sourdough', price: '14' }
        ]
      },
      
      lunchItems: {
        type: 'group',
        label: 'Lunch Items',
        itemLabel: 'Lunch Item',
        min: 1,
        max: 8,
        fields: {
          name: { type: 'text', label: 'Name', default: '' },
          description: { type: 'text', label: 'Description', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          { name: 'Grilled Chicken Sandwich', description: 'Herb-marinated chicken, arugula, tomato, aioli on ciabatta', price: '16' }
        ]
      },
      
      drinks: {
        type: 'group',
        label: 'Drinks',
        itemLabel: 'Drink',
        min: 1,
        max: 8,
        fields: {
          name: { type: 'text', label: 'Name', default: '' },
          description: { type: 'text', label: 'Description', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          { name: 'Cold Brew Coffee', description: 'House-roasted beans, smooth & refreshing', price: '5' }
        ]
      },
      
      accentColor: { type: 'color', default: '#eb1736', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Light',
        label: 'Theme'
      }
    }
  },
  'creative-portfolio': {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    customizable: {
      name: { type: 'text', default: 'Alex Rivera', label: 'Your Name' },
      headline: { type: 'text', default: 'Creative Director & Designer', label: 'Headline' },
      heroSubtitle: { 
        type: 'textarea',
        default: 'I craft digital experiences that blend artistry with functionality. Specializing in brand identity, web design, and creative direction.',
        label: 'Hero Subtitle'
      },
      aboutTitle: { type: 'text', default: 'About Me', label: 'About Title' },
      aboutText: { 
        type: 'textarea',
        default: "With over 8 years of experience in design and creative direction, I've helped brands tell their stories through compelling visual narratives. My work has been featured in Design Week, Awwwards, and Communication Arts.",
        label: 'About Text'
      },
      
      stats: {
        type: 'group',
        label: 'Statistics',
        itemLabel: 'Stat',
        min: 1,
        max: 4,
        fields: {
          value: { type: 'text', label: 'Value', default: '' },
          label: { type: 'text', label: 'Label', default: '' }
        },
        default: [
          { value: '8+', label: 'Years Experience' },
          { value: '150+', label: 'Projects Completed' },
          { value: '12', label: 'Awards Won' }
        ]
      },
      
      projects: {
        type: 'group',
        label: 'Projects',
        itemLabel: 'Project',
        min: 1,
        max: 6,
        fields: {
          image: { type: 'image', label: 'Project Image', accept: 'image/*' },
          title: { type: 'text', label: 'Title', default: '' },
          category: { type: 'text', label: 'Category', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' }
        },
        default: [
          { title: 'Brand Identity for TechCorp', category: 'Branding', description: 'Complete brand identity redesign for a leading tech company.' },
          { title: 'E-commerce Platform', category: 'Web Design', description: 'Modern, conversion-focused e-commerce platform.' },
          { title: 'Mobile App Redesign', category: 'UI/UX', description: 'Complete overhaul of a fitness tracking app.' }
        ]
      },
      
      services: {
        type: 'group',
        label: 'Services',
        itemLabel: 'Service',
        min: 1,
        max: 6,
        fields: {
          name: { type: 'text', label: 'Service Name', default: '' },
          description: { type: 'text', label: 'Description', default: '' }
        },
        default: [
          { name: 'Brand Identity', description: 'Logo design, brand guidelines, visual identity systems' },
          { name: 'Web Design', description: 'Responsive websites, landing pages, web applications' },
          { name: 'Creative Direction', description: 'Art direction, creative strategy, campaign development' }
        ]
      },
      
      contactInfo: {
        type: 'group',
        label: 'Contact Information',
        itemLabel: 'Contact',
        min: 1,
        max: 4,
        fields: {
          type: { type: 'select', options: ['Email', 'Phone', 'Location'], label: 'Type', default: 'Email' },
          value: { type: 'text', label: 'Value', default: '' }
        },
        default: [
          { type: 'Email', value: 'alex@example.com' },
          { type: 'Phone', value: '+1 (555) 123-4567' },
          { type: 'Location', value: 'New York, NY' }
        ]
      },
      
      socialLinks: {
        type: 'group',
        label: 'Social Links',
        itemLabel: 'Social Link',
        min: 0,
        max: 6,
        fields: {
          platform: { type: 'text', label: 'Platform', default: '' },
          url: { type: 'text', label: 'URL/Handle', default: '' }
        },
        default: [
          { platform: 'LinkedIn', url: 'linkedin.com/in/alexrivera' },
          { platform: 'Twitter', url: '@alexrivera' },
          { platform: 'Dribbble', url: 'dribbble.com/alexrivera' }
        ]
      },      
      accentColor: { type: 'color', default: '#eb1736', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Dark',
        label: 'Theme'
      }
    }
  },
  'agency-showcase': {
    id: 'agency-showcase',
    name: 'Agency Showcase',
    category: 'Business',
    customizable: {
      agencyName: { type: 'text', default: 'Momentum', label: 'Agency Name' },
      tagline: { type: 'text', default: 'We Build Brands That Matter', label: 'Tagline' },
      heroDescription: { 
        type: 'textarea',
        default: 'Award-winning creative agency specializing in brand strategy, digital design, and innovative campaigns that drive results.',
        label: 'Hero Description'
      },
      email: { type: 'text', default: 'hello@momentum.agency', label: 'Email' },
      phone: { type: 'text', default: '+1 (555) 987-6543', label: 'Phone' },
      location: { type: 'text', default: 'New York, NY', label: 'Location' },
      
      projects: {
        type: 'group',
        label: 'Projects',
        itemLabel: 'Project',
        min: 1,
        max: 6,
        fields: {
          image: { type: 'image', label: 'Project Image', accept: 'image/*' },
          name: { type: 'text', label: 'Project Name', default: '' },
          client: { type: 'text', label: 'Client', default: '' },
          year: { type: 'text', label: 'Year', default: '' }
        },
        default: [
          { name: 'TechFlow Rebrand', client: 'TechFlow Inc.', year: '2024' },
          { name: 'Zenith Campaign', client: 'Zenith Group', year: '2024' }
        ]
      },
      
      stats: {
        type: 'group',
        label: 'Statistics',
        itemLabel: 'Stat',
        min: 1,
        max: 4,
        fields: {
          value: { type: 'text', label: 'Value', default: '' },
          label: { type: 'text', label: 'Label', default: '' }
        },
        default: [
          { value: '200+', label: 'Clients Served' },
          { value: '500+', label: 'Projects Delivered' },
          { value: '35', label: 'Team Members' }
        ]
      },
      
      accentColor: { type: 'color', default: '#eb1736', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Light',
        label: 'Theme'
      }
    }
  },
  'saas-product': {
    id: 'saas-product',
    name: 'SaaS Product',
    category: 'Business',
    customizable: {
      productName: { type: 'text', default: 'CloudSync', label: 'Product Name' },
      headline: { type: 'text', default: 'Collaboration Made Simple', label: 'Headline' },
      subheadline: { 
        type: 'textarea',
        default: 'The all-in-one workspace for teams. Sync files, manage projects, and communicate seamlessly—all in one place.',
        label: 'Subheadline'
      },
      ctaText: { type: 'text', default: 'Start Free Trial', label: 'CTA Text' },
      
      features: {
        type: 'group',
        label: 'Features',
        itemLabel: 'Feature',
        min: 1,
        max: 6,
        fields: {
          title: { type: 'text', label: 'Title', default: '' },
          description: { type: 'text', label: 'Description', default: '' }
        },
        default: [
          { title: 'Real-Time Sync', description: 'Access your files anywhere, anytime with instant synchronization' },
          { title: 'Team Collaboration', description: 'Work together seamlessly with built-in chat and commenting' },
          { title: 'Enterprise Security', description: 'Bank-level encryption and compliance with SOC 2 standards' }
        ]
      },
      
      pricingPlans: {
        type: 'group',
        label: 'Pricing Plans',
        itemLabel: 'Plan',
        min: 1,
        max: 4,
        fields: {
          name: { type: 'text', label: 'Plan Name', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          { name: 'Basic', price: '9' },
          { name: 'Pro', price: '29' },
          { name: 'Enterprise', price: '99' }
        ]
      },
      
      testimonials: {
        type: 'group',
        label: 'Testimonials',
        itemLabel: 'Testimonial',
        min: 0,
        max: 3,
        fields: {
          text: { type: 'textarea', label: 'Testimonial', default: '' },
          author: { type: 'text', label: 'Author', default: '' },
          role: { type: 'text', label: 'Role', default: '' }
        },
        default: [
          { text: 'CloudSync has transformed how our team works. We\'re more productive and connected than ever.', author: 'Sarah Chen', role: 'CTO, TechCorp' }
        ]
      },
      
      accentColor: { type: 'color', default: '#0ea5e9', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Light',
        label: 'Theme'
      }
    }
  },
  'consulting-firm': {
    id: 'consulting-firm',
    name: 'Consulting Firm',
    category: 'Business',
    customizable: {
      firmName: { type: 'text', default: 'Sterling Advisory', label: 'Firm Name' },
      tagline: { type: 'text', default: 'Strategic Consulting for Growth', label: 'Tagline' },
      introText: { 
        type: 'textarea',
        default: 'We partner with ambitious companies to solve complex challenges and unlock sustainable growth through strategic insights and operational excellence.',
        label: 'Introduction'
      },
      phoneNumber: { type: 'text', default: '+1 (555) 234-5678', label: 'Phone' },
      emailAddress: { type: 'text', default: 'contact@sterling.com', label: 'Email' },
      officeLocation: { type: 'text', default: 'Chicago, IL', label: 'Office Location' },
      
      services: {
        type: 'group',
        label: 'Services',
        itemLabel: 'Service',
        min: 1,
        max: 6,
        fields: {
          name: { type: 'text', label: 'Service Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' }
        },
        default: [
          { name: 'Strategy & Operations', description: 'Develop winning strategies and optimize operations to drive efficiency and competitive advantage.' },
          { name: 'Digital Transformation', description: 'Navigate digital change with confidence through technology strategy and implementation expertise.' },
          { name: 'M&A Advisory', description: 'Expert guidance through mergers, acquisitions, and corporate restructuring for maximum value.' }
        ]
      },
      
      expertise: {
        type: 'repeatable',
        label: 'Industry Expertise',
        itemLabel: 'Industry',
        default: ['Financial Services', 'Healthcare', 'Technology', 'Manufacturing'],
        max: 8
      },
      
      stats: {
        type: 'group',
        label: 'Statistics',
        itemLabel: 'Stat',
        min: 1,
        max: 4,
        fields: {
          value: { type: 'text', label: 'Value', default: '' },
          label: { type: 'text', label: 'Label', default: '' }
        },
        default: [
          { value: '25+', label: 'Years in Business' },
          { value: '$2B+', label: 'Client Value Created' }
        ]
      },
      
      accentColor: { type: 'color', default: '#1e40af', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Light',
        label: 'Theme'
      }
    }
  },
  'photography-grid': {
    id: 'photography-grid',
    name: 'Photography Grid',
    category: 'Portfolio',
    customizable: {
      name: { type: 'text', default: 'Elena Rodriguez', label: 'Your Name' },
      tagline: { type: 'text', default: 'Visual Storyteller', label: 'Tagline' },
      bio: { 
        type: 'textarea',
        default: 'Capturing moments that matter. Specializing in portrait, lifestyle, and documentary photography with a focus on authentic human connection.',
        label: 'Bio'
      },
      galleryTitle: { type: 'text', default: 'Recent Work', label: 'Gallery Title' },
      
      contactInfo: {
        type: 'group',
        label: 'Contact Information',
        itemLabel: 'Contact',
        min: 1,
        max: 4,
        fields: {
          type: { type: 'select', options: ['Email', 'Phone', 'Website', 'Instagram'], label: 'Type', default: 'Email' },
          value: { type: 'text', label: 'Value', default: '' }
        },
        default: [
          { type: 'Email', value: 'elena@example.com' },
          { type: 'Phone', value: '+1 (555) 234-5678' },
          { type: 'Website', value: 'elenarodriguez.com' },
          { type: 'Instagram', value: '@elenarodriguez' }
        ]
      },
      
      socialLinks: {
        type: 'group',
        label: 'Social Links',
        itemLabel: 'Social Link',
        min: 0,
        max: 4,
        fields: {
          platform: { type: 'text', label: 'Platform', default: '' },
          url: { type: 'text', label: 'URL/Handle', default: '' }
        },
        default: [
          { platform: 'Behance', url: 'behance.net/elenarodriguez' }
        ]
      },
      galleryImages: {
        type: 'images',
        label: 'Gallery Photos',
        min: 1,
        max: 12,
        accept: 'image/*'
      },
      accentColor: { type: 'color', default: '#000000', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Light',
        label: 'Theme'
      }
    }
  },
  'photography-masonry': {
    id: 'photography-masonry',
    name: 'Photography Masonry',
    category: 'Portfolio',
    customizable: {
      name: { type: 'text', default: 'Noah Martinez', label: 'Your Name' },
      specialty: { type: 'text', default: 'Fine Art & Landscape Photography', label: 'Specialty' },
      statement: { 
        type: 'textarea',
        default: 'Through my lens, I explore the intersection of natural beauty and human emotion. Each photograph is a meditation on light, form, and the fleeting moments that define our experience.',
        label: 'Artist Statement'
      },
      location: { type: 'text', default: 'Pacific Northwest', label: 'Based In' },
      email: { type: 'text', default: 'noah@example.com', label: 'Email' },
      prints: { type: 'text', default: 'Available for purchase', label: 'Prints Availability' },
      
      socialLinks: {
        type: 'group',
        label: 'Social Links',
        itemLabel: 'Social Link',
        min: 0,
        max: 4,
        fields: {
          platform: { type: 'text', label: 'Platform', default: '' },
          url: { type: 'text', label: 'URL/Handle', default: '' }
        },
        default: [
          { platform: 'Instagram', url: '@noahmartinez' },
          { platform: 'Flickr', url: 'flickr.com/noahmartinez' }
        ]
      },
      masonryImages: {
        type: 'images',
        label: 'Portfolio Photos',
        min: 1,
        max: 20,
        accept: 'image/*'
      },
      accentColor: { type: 'color', default: '#2d3748', label: 'Accent Color' },
      darkMode: { 
        type: 'select', 
        options: ['Light', 'Dark', 'Auto'],
        default: 'Dark',
        label: 'Theme'
      }
    }
  },
  'wedding-invite': {
  id: 'wedding-invite',
  name: 'Wedding Invitation',
  category: 'Events',
  customizable: {
    brideName: { type: 'text', default: 'Sarah', label: 'Bride\'s First Name' },
    groomName: { type: 'text', default: 'Michael', label: 'Groom\'s First Name' },
    weddingDate: { type: 'text', default: 'June 15, 2025', label: 'Wedding Date' },
    weddingTime: { type: 'text', default: '4:00 PM', label: 'Ceremony Time' },
    venueName: { type: 'text', default: 'The Grand Estate', label: 'Venue Name' },
    venueAddress: { type: 'textarea', default: '123 Garden Lane\nNapa Valley, CA 94558', label: 'Venue Address' },
    
    ceremonyTitle: { type: 'text', default: 'Ceremony', label: 'Ceremony Section Title' },
    ceremonyTime: { type: 'text', default: '4:00 PM', label: 'Ceremony Time' },
    ceremonyLocation: { type: 'text', default: 'Garden Terrace', label: 'Ceremony Location' },
    
    receptionTitle: { type: 'text', default: 'Reception', label: 'Reception Section Title' },
    receptionTime: { type: 'text', default: '6:00 PM', label: 'Reception Time' },
    receptionLocation: { type: 'text', default: 'Grand Ballroom', label: 'Reception Location' },
    
    story: {
      type: 'textarea',
      default: 'We met in college during our senior year and have been inseparable ever since. After five wonderful years together, we\'re excited to begin our next chapter as husband and wife.',
      label: 'Our Story'
    },
    
    rsvpDeadline: { type: 'text', default: 'May 1, 2025', label: 'RSVP Deadline' },
    rsvpEmail: { type: 'text', default: 'rsvp@sarahandmichael.com', label: 'RSVP Email' },
    rsvpPhone: { type: 'text', default: '(555) 123-4567', label: 'RSVP Phone (Optional)' },
    
    additionalInfo: {
      type: 'textarea',
      default: 'Attire: Garden Formal\nParking: Valet available\nAccommodations: Room block at Napa Grand Hotel',
      label: 'Additional Information'
    },
    
    registryLinks: {
      type: 'group',
      label: 'Registry Links',
      itemLabel: 'Registry',
      min: 0,
      max: 4,
      fields: {
        store: { type: 'text', label: 'Store Name', default: '' },
        url: { type: 'text', label: 'Registry URL', default: '' }
      },
      default: [
        { store: 'Amazon', url: 'amazon.com/wedding/registry' },
        { store: 'Crate & Barrel', url: 'crateandbarrel.com/gift-registry' }
      ]
    },
    
    heroImage: { 
      type: 'image', 
      label: 'Engagement Photo',
      accept: 'image/*'
    },
    
    accentColor: { type: 'color', default: '#d4af37', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Light',
      label: 'Theme'
    }
  }
},
'event-landing': {
  id: 'event-landing',
  name: 'Event Landing Page',
  category: 'Events',
  customizable: {
    eventName: { type: 'text', default: 'Tech Summit 2025', label: 'Event Name' },
    tagline: { type: 'text', default: 'The Future of Innovation', label: 'Tagline' },
    eventDate: { type: 'text', default: 'September 20-22, 2025', label: 'Event Date' },
    eventLocation: { type: 'text', default: 'San Francisco Convention Center', label: 'Location' },
    
    description: { 
      type: 'textarea',
      default: 'Join industry leaders, innovators, and visionaries for three days of insights, networking, and inspiration. Discover the latest trends shaping technology and business.',
      label: 'Event Description'
    },
    
    ctaPrimary: { type: 'text', default: 'Get Tickets', label: 'Primary CTA Button' },
    ctaSecondary: { type: 'text', default: 'View Schedule', label: 'Secondary CTA Button' },
    ticketUrl: { type: 'text', default: '#tickets', label: 'Ticket URL' },
    
    speakers: {
      type: 'group',
      label: 'Speakers',
      itemLabel: 'Speaker',
      min: 0,
      max: 8,
      fields: {
        image: { type: 'image', label: 'Photo', accept: 'image/*' },
        name: { type: 'text', label: 'Name', default: '' },
        title: { type: 'text', label: 'Title', default: '' },
        company: { type: 'text', label: 'Company', default: '' }
      },
      default: [
        { name: 'Dr. Sarah Chen', title: 'Chief Innovation Officer', company: 'TechCorp' },
        { name: 'Marcus Johnson', title: 'CEO', company: 'FutureAI' },
        { name: 'Emily Rodriguez', title: 'Head of Design', company: 'Creative Labs' }
      ]
    },
    
    schedule: {
      type: 'group',
      label: 'Schedule',
      itemLabel: 'Session',
      min: 0,
      max: 12,
      fields: {
        time: { type: 'text', label: 'Time', default: '' },
        title: { type: 'text', label: 'Session Title', default: '' },
        speaker: { type: 'text', label: 'Speaker', default: '' },
        location: { type: 'text', label: 'Location', default: '' }
      },
      default: [
        { time: '9:00 AM', title: 'Opening Keynote', speaker: 'Dr. Sarah Chen', location: 'Main Stage' },
        { time: '10:30 AM', title: 'The Future of AI', speaker: 'Marcus Johnson', location: 'Hall A' },
        { time: '2:00 PM', title: 'Design Thinking Workshop', speaker: 'Emily Rodriguez', location: 'Workshop Room' }
      ]
    },
    
    tickets: {
      type: 'group',
      label: 'Ticket Types',
      itemLabel: 'Ticket',
      min: 1,
      max: 4,
      fields: {
        name: { type: 'text', label: 'Ticket Name', default: '' },
        price: { type: 'text', label: 'Price', default: '' },
        features: { type: 'textarea', label: 'Features (one per line)', default: '' }
      },
      default: [
        { name: 'General Admission', price: '299', features: 'All sessions\nNetworking events\nLunch included' },
        { name: 'VIP Pass', price: '599', features: 'All sessions\nVIP lounge access\nMeet & greet with speakers\nAll meals included' }
      ]
    },
    
    venue: {
      type: 'group',
      label: 'Venue Details',
      itemLabel: 'Detail',
      min: 0,
      max: 4,
      fields: {
        label: { type: 'text', label: 'Label', default: '' },
        value: { type: 'text', label: 'Value', default: '' }
      },
      default: [
        { label: 'Address', value: '747 Howard St, San Francisco, CA 94103' },
        { label: 'Parking', value: 'Valet and self-parking available' },
        { label: 'Transit', value: 'Powell St BART - 5 min walk' }
      ]
    },
    
    contactEmail: { type: 'text', default: 'info@techsummit.com', label: 'Contact Email' },
    
    accentColor: { type: 'color', default: '#eb1736', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Dark',
      label: 'Theme'
    }
  }
},
'baby-announcement': {
  id: 'baby-announcement',
  name: 'Baby Announcement',
  category: 'Events',
  customizable: {
    babyName: { type: 'text', default: 'Olivia Grace', label: 'Baby\'s Name' },
    parentNames: { type: 'text', default: 'Emma & James Peterson', label: 'Parents\' Names' },
    birthDate: { type: 'text', default: 'March 15, 2025', label: 'Birth Date' },
    birthTime: { type: 'text', default: '8:42 AM', label: 'Birth Time' },
    weight: { type: 'text', default: '7 lbs 8 oz', label: 'Weight' },
    length: { type: 'text', default: '20 inches', label: 'Length' },
    
    announcement: {
      type: 'textarea',
      default: 'We are overjoyed to announce the arrival of our beautiful daughter. She has filled our hearts with love beyond measure.',
      label: 'Announcement Message'
    },
    
    meaningOfName: {
      type: 'textarea',
      default: 'Olivia means "olive tree" symbolizing peace and beauty. Grace represents elegance and divine favor.',
      label: 'Meaning of Name (Optional)'
    },
    
    thankYouMessage: {
      type: 'textarea',
      default: 'Thank you for all the love, support, and well wishes during this special time. We can\'t wait for you to meet her!',
      label: 'Thank You Message'
    },
    
    babyPhoto: { 
      type: 'image', 
      label: 'Baby Photo',
      accept: 'image/*'
    },
    
    gallery: {
      type: 'images',
      label: 'Additional Photos',
      min: 0,
      max: 6,
      accept: 'image/*'
    },
    
    accentColor: { type: 'color', default: '#ffc0cb', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Light',
      label: 'Theme'
    }
  }
},
'teacher-profile': {
  id: 'teacher-profile',
  name: 'Teacher Profile',
  category: 'Education',
  customizable: {
    name: { type: 'text', default: 'Ms. Jennifer Martinez', label: 'Your Name' },
    title: { type: 'text', default: 'High School English Teacher', label: 'Title/Position' },
    school: { type: 'text', default: 'Lincoln High School', label: 'School Name' },
    yearsExperience: { type: 'text', default: '12', label: 'Years of Experience' },
    
    bio: {
      type: 'textarea',
      default: 'I am passionate about helping students discover the power of literature and effective communication. My goal is to create an engaging, supportive classroom where every student feels confident to express their ideas and grow as readers and writers.',
      label: 'About Me'
    },
    
    subjects: {
      type: 'repeatable',
      label: 'Subjects Taught',
      itemLabel: 'Subject',
      default: ['AP English Literature', 'Creative Writing', 'American Literature'],
      max: 8
    },
    
    education: {
      type: 'group',
      label: 'Education',
      itemLabel: 'Degree',
      min: 1,
      max: 4,
      fields: {
        degree: { type: 'text', label: 'Degree', default: '' },
        institution: { type: 'text', label: 'Institution', default: '' },
        year: { type: 'text', label: 'Year', default: '' }
      },
      default: [
        { degree: 'M.Ed. in English Education', institution: 'Boston University', year: '2015' },
        { degree: 'B.A. in English Literature', institution: 'UCLA', year: '2012' }
      ]
    },
    
    teachingPhilosophy: {
      type: 'textarea',
      default: 'I believe every student has a unique voice worth hearing. My classroom is a space where mistakes are learning opportunities, questions are celebrated, and diverse perspectives enrich our understanding of literature and the world.',
      label: 'Teaching Philosophy'
    },
    
    classInfo: {
      type: 'group',
      label: 'Class Information',
      itemLabel: 'Class',
      min: 0,
      max: 6,
      fields: {
        className: { type: 'text', label: 'Class Name', default: '' },
        period: { type: 'text', label: 'Period/Time', default: '' },
        room: { type: 'text', label: 'Room Number', default: '' }
      },
      default: [
        { className: 'AP Literature', period: 'Period 1 (8:00 AM)', room: 'Room 204' },
        { className: 'Creative Writing', period: 'Period 3 (10:30 AM)', room: 'Room 204' }
      ]
    },
    
    officeHours: {
      type: 'textarea',
      default: 'Monday & Wednesday: 3:00 PM - 4:00 PM\nTuesday & Thursday: 7:30 AM - 8:00 AM\nOr by appointment',
      label: 'Office Hours'
    },
    
    contactEmail: { type: 'text', default: 'jmartinez@lincolnhs.edu', label: 'Email' },
    contactPhone: { type: 'text', default: '(555) 123-4567', label: 'Phone (Optional)' },
    
    profilePhoto: { 
      type: 'image', 
      label: 'Profile Photo',
      accept: 'image/*'
    },
    
    accentColor: { type: 'color', default: '#2563eb', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Light',
      label: 'Theme'
    }
  }
},
'student-portfolio': {
  id: 'student-portfolio',
  name: 'Student Portfolio',
  category: 'Education',
  customizable: {
    studentName: { type: 'text', default: 'Alex Johnson', label: 'Student Name' },
    grade: { type: 'text', default: 'Junior', label: 'Grade Level' },
    school: { type: 'text', default: 'Riverside High School', label: 'School Name' },
    gradYear: { type: 'text', default: '2026', label: 'Expected Graduation Year' },
    
    about: {
      type: 'textarea',
      default: 'I\'m a passionate student interested in computer science, robotics, and creative problem-solving. I love taking on new challenges and working on projects that make a difference in my community.',
      label: 'About Me'
    },
    
    interests: {
      type: 'repeatable',
      label: 'Interests & Hobbies',
      itemLabel: 'Interest',
      default: ['Robotics', 'Web Development', 'Photography', 'Debate Team'],
      max: 10
    },
    
    projects: {
      type: 'group',
      label: 'Projects',
      itemLabel: 'Project',
      min: 0,
      max: 8,
      fields: {
        image: { type: 'image', label: 'Project Image', accept: 'image/*' },
        title: { type: 'text', label: 'Project Title', default: '' },
        description: { type: 'textarea', label: 'Description', default: '' },
        skills: { type: 'text', label: 'Skills Used', default: '' }
      },
      default: [
        { 
          title: 'School Website Redesign', 
          description: 'Led a team to redesign our school\'s website, improving navigation and accessibility.',
          skills: 'HTML, CSS, JavaScript, Figma'
        },
        { 
          title: 'Community Garden App', 
          description: 'Built a mobile app to help coordinate our local community garden volunteer schedules.',
          skills: 'React Native, Firebase'
        }
      ]
    },
    
    achievements: {
      type: 'group',
      label: 'Achievements & Awards',
      itemLabel: 'Achievement',
      min: 0,
      max: 10,
      fields: {
        title: { type: 'text', label: 'Achievement', default: '' },
        year: { type: 'text', label: 'Year', default: '' },
        description: { type: 'text', label: 'Description', default: '' }
      },
      default: [
        { title: 'Regional Science Fair - 1st Place', year: '2024', description: 'AI-powered recycling sorter' },
        { title: 'National Merit Semifinalist', year: '2024', description: '' }
      ]
    },
    
    academics: {
      type: 'group',
      label: 'Academic Info',
      itemLabel: 'Detail',
      min: 0,
      max: 6,
      fields: {
        label: { type: 'text', label: 'Label', default: '' },
        value: { type: 'text', label: 'Value', default: '' }
      },
      default: [
        { label: 'GPA', value: '3.95' },
        { label: 'Class Rank', value: 'Top 5%' },
        { label: 'AP Courses', value: '8' }
      ]
    },
    
    contactEmail: { type: 'text', default: 'alex.johnson@email.com', label: 'Email' },
    
    profilePhoto: { 
      type: 'image', 
      label: 'Profile Photo',
      accept: 'image/*'
    },
    
    accentColor: { type: 'color', default: '#8b5cf6', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Auto',
      label: 'Theme'
    }
  }
},
'fitness-trainer': {
  id: 'fitness-trainer',
  name: 'Fitness Trainer Profile',
  category: 'Health & Wellness',
  customizable: {
    trainerName: { type: 'text', default: 'Marcus Thompson', label: 'Your Name' },
    tagline: { type: 'text', default: 'Certified Personal Trainer & Nutrition Coach', label: 'Tagline' },
    yearsExperience: { type: 'text', default: '8+', label: 'Years of Experience' },
    
    heroStatement: {
      type: 'textarea',
      default: 'Transform your body, elevate your mind, and achieve goals you never thought possible. Let\'s build the strongest version of you together.',
      label: 'Hero Statement'
    },
    
    bio: {
      type: 'textarea',
      default: 'I\'ve dedicated my life to fitness and helping others reach their potential. From weight loss to muscle building, marathon training to injury recovery—I create personalized programs that deliver real results.',
      label: 'About Me'
    },
    
    specialties: {
      type: 'repeatable',
      label: 'Specialties',
      itemLabel: 'Specialty',
      default: ['Strength Training', 'Weight Loss', 'Sports Performance', 'Injury Prevention', 'Nutrition Coaching'],
      max: 10
    },
    
    certifications: {
      type: 'group',
      label: 'Certifications',
      itemLabel: 'Certification',
      min: 0,
      max: 8,
      fields: {
        title: { type: 'text', label: 'Certification', default: '' },
        organization: { type: 'text', label: 'Organization', default: '' },
        year: { type: 'text', label: 'Year', default: '' }
      },
      default: [
        { title: 'Certified Personal Trainer (CPT)', organization: 'NASM', year: '2016' },
        { title: 'Precision Nutrition Level 1', organization: 'Precision Nutrition', year: '2018' }
      ]
    },
    
    trainingPackages: {
      type: 'group',
      label: 'Training Packages',
      itemLabel: 'Package',
      min: 0,
      max: 4,
      fields: {
        name: { type: 'text', label: 'Package Name', default: '' },
        sessions: { type: 'text', label: 'Sessions', default: '' },
        price: { type: 'text', label: 'Price', default: '' },
        features: { type: 'textarea', label: 'Features (one per line)', default: '' }
      },
      default: [
        { 
          name: 'Starter', 
          sessions: '4 sessions/month',
          price: '240',
          features: 'Personalized workout plan\nForm coaching\nProgress tracking'
        },
        { 
          name: 'Committed', 
          sessions: '8 sessions/month',
          price: '440',
          features: 'Personalized workout plan\nNutrition guidance\nForm coaching\n24/7 text support\nProgress tracking'
        }
      ]
    },
    
    testimonials: {
      type: 'group',
      label: 'Client Testimonials',
      itemLabel: 'Testimonial',
      min: 0,
      max: 6,
      fields: {
        name: { type: 'text', label: 'Client Name', default: '' },
        result: { type: 'text', label: 'Result Achieved', default: '' },
        quote: { type: 'textarea', label: 'Testimonial', default: '' }
      },
      default: [
        { 
          name: 'Sarah K.', 
          result: 'Lost 45 lbs in 6 months',
          quote: 'Marcus completely transformed my relationship with fitness. His approach is tough but supportive, and the results speak for themselves!'
        }
      ]
    },
    
    schedule: {
      type: 'textarea',
      default: 'Monday - Friday: 6:00 AM - 8:00 PM\nSaturday: 8:00 AM - 2:00 PM\nSunday: Closed',
      label: 'Availability'
    },
    
    location: { type: 'text', default: 'Gold\'s Gym Downtown + Virtual Training', label: 'Training Location' },
    phone: { type: 'text', default: '(555) 789-0123', label: 'Phone' },
    email: { type: 'text', default: 'marcus@fitnesstraining.com', label: 'Email' },
    
    instagramHandle: { type: 'text', default: '@marcusfitness', label: 'Instagram Handle (Optional)' },
    
    trainerPhoto: { 
      type: 'image', 
      label: 'Profile Photo',
      accept: 'image/*'
    },
    
    accentColor: { type: 'color', default: '#f97316', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Dark',
      label: 'Theme'
    }
  }
},
'wellness-coach': {
  id: 'wellness-coach',
  name: 'Wellness Coach',
  category: 'Health & Wellness',
  customizable: {
    coachName: { type: 'text', default: 'Dr. Lisa Chen', label: 'Your Name' },
    credentials: { type: 'text', default: 'PhD, Certified Holistic Health Coach', label: 'Credentials' },
    tagline: { 
      type: 'text', 
      default: 'Find Balance. Nurture Wellness. Transform Your Life.', 
      label: 'Tagline' 
    },
    
    welcomeMessage: {
      type: 'textarea',
      default: 'Welcome. I\'m here to guide you on a journey to holistic wellness—supporting your mind, body, and spirit as you discover what true health means for you.',
      label: 'Welcome Message'
    },
    
    philosophy: {
      type: 'textarea',
      default: 'I believe wellness is not a destination, but a lifelong journey of self-discovery and growth. Through mindful practices, compassionate support, and evidence-based approaches, I help you create sustainable habits that honor your unique needs and goals.',
      label: 'Coaching Philosophy'
    },
    
    services: {
      type: 'group',
      label: 'Services',
      itemLabel: 'Service',
      min: 0,
      max: 6,
      fields: {
        name: { type: 'text', label: 'Service Name', default: '' },
        description: { type: 'textarea', label: 'Description', default: '' },
        duration: { type: 'text', label: 'Duration/Format', default: '' }
      },
      default: [
        { 
          name: 'One-on-One Coaching', 
          description: 'Personalized sessions focused on your unique wellness goals, from stress management to nutrition and lifestyle changes.',
          duration: '60 minutes • Virtual or In-Person'
        },
        { 
          name: 'Mindfulness & Meditation', 
          description: 'Learn practical techniques to reduce stress, increase presence, and cultivate inner peace in your daily life.',
          duration: '45 minutes • Virtual'
        },
        { 
          name: 'Holistic Wellness Programs', 
          description: 'Comprehensive 12-week programs addressing nutrition, movement, sleep, stress, and emotional wellbeing.',
          duration: '12 weeks • Includes weekly sessions'
        }
      ]
    },
    
    approach: {
      type: 'repeatable',
      label: 'My Approach',
      itemLabel: 'Principle',
      default: [
        'Whole-person wellness',
        'Evidence-based practices',
        'Compassionate guidance',
        'Sustainable lifestyle changes',
        'Mind-body connection'
      ],
      max: 8
    },
    
    backgrounds: {
      type: 'group',
      label: 'Background & Training',
      itemLabel: 'Credential',
      min: 0,
      max: 6,
      fields: {
        title: { type: 'text', label: 'Title', default: '' },
        institution: { type: 'text', label: 'Institution', default: '' },
        year: { type: 'text', label: 'Year', default: '' }
      },
      default: [
        { title: 'PhD in Health Psychology', institution: 'Stanford University', year: '2015' },
        { title: 'Certified Health Coach', institution: 'Institute for Integrative Nutrition', year: '2017' },
        { title: 'Mindfulness-Based Stress Reduction', institution: 'UMASS Medical School', year: '2018' }
      ]
    },
    
    areasOfFocus: {
      type: 'repeatable',
      label: 'Areas of Focus',
      itemLabel: 'Area',
      default: [
        'Stress Management',
        'Sleep Optimization',
        'Emotional Wellbeing',
        'Nutrition & Lifestyle',
        'Work-Life Balance',
        'Mindfulness Practices'
      ],
      max: 10
    },
    
    sessionInfo: {
      type: 'textarea',
      default: 'Initial Consultation (30 min): Complimentary\nSingle Session (60 min): $150\n4-Session Package: $540\n12-Week Program: $1,800',
      label: 'Session Information'
    },
    
    bookingUrl: { type: 'text', default: '#book', label: 'Booking URL' },
    email: { type: 'text', default: 'lisa@wellnesscoaching.com', label: 'Email' },
    phone: { type: 'text', default: '(555) 234-5678', label: 'Phone (Optional)' },
    
    coachPhoto: { 
      type: 'image', 
      label: 'Profile Photo',
      accept: 'image/*'
    },
    
    accentColor: { type: 'color', default: '#10b981', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Light',
      label: 'Theme'
    }
  }
},
'musician-band': {
  id: 'musician-band',
  name: 'Musician/Band Page',
  category: 'Creative',
  customizable: {
    artistName: { type: 'text', default: 'The Midnight Collective', label: 'Artist/Band Name' },
    genre: { type: 'text', default: 'Indie Rock • Alternative', label: 'Genre' },
    location: { type: 'text', default: 'Brooklyn, NY', label: 'Based In' },
    
    bio: {
      type: 'textarea',
      default: 'Four friends. One sound. Blending raw energy with introspective lyrics, we create music that hits you in the chest and stays in your head for days. Our latest album "Echoes After Dark" is out now.',
      label: 'Bio'
    },
    
    featuredVideo: { type: 'text', default: '', label: 'Featured Video URL (YouTube/Vimeo embed)' },
    
    latestRelease: {
      type: 'group',
      label: 'Latest Release',
      itemLabel: 'Release',
      min: 0,
      max: 1,
      fields: {
        title: { type: 'text', label: 'Album/Single Title', default: '' },
        releaseDate: { type: 'text', label: 'Release Date', default: '' },
        coverArt: { type: 'image', label: 'Cover Art', accept: 'image/*' },
        description: { type: 'textarea', label: 'Description', default: '' },
        streamingLinks: { type: 'textarea', label: 'Streaming Links (one per line)', default: '' }
      },
      default: [
        { 
          title: 'Echoes After Dark',
          releaseDate: 'March 2025',
          description: '12 tracks exploring themes of memory, connection, and late-night introspection.',
          streamingLinks: 'Spotify\nApple Music\nBandcamp\nSoundCloud'
        }
      ]
    },
    
    upcomingShows: {
      type: 'group',
      label: 'Upcoming Shows',
      itemLabel: 'Show',
      min: 0,
      max: 10,
      fields: {
        date: { type: 'text', label: 'Date', default: '' },
        venue: { type: 'text', label: 'Venue', default: '' },
        city: { type: 'text', label: 'City', default: '' },
        ticketUrl: { type: 'text', label: 'Ticket URL', default: '' }
      },
      default: [
        { date: 'Apr 15', venue: 'Music Hall of Williamsburg', city: 'Brooklyn, NY', ticketUrl: '#tickets' },
        { date: 'Apr 22', venue: 'The Sinclair', city: 'Cambridge, MA', ticketUrl: '#tickets' },
        { date: 'May 3', venue: 'Union Transfer', city: 'Philadelphia, PA', ticketUrl: '#tickets' }
      ]
    },
    
    bandMembers: {
      type: 'group',
      label: 'Band Members',
      itemLabel: 'Member',
      min: 0,
      max: 8,
      fields: {
        name: { type: 'text', label: 'Name', default: '' },
        role: { type: 'text', label: 'Role/Instrument', default: '' },
        photo: { type: 'image', label: 'Photo', accept: 'image/*' }
      },
      default: [
        { name: 'Maya Rodriguez', role: 'Vocals, Guitar' },
        { name: 'Jake Wilson', role: 'Lead Guitar' },
        { name: 'Sam Chen', role: 'Bass' },
        { name: 'Alex Parker', role: 'Drums' }
      ]
    },
    
    pressQuotes: {
      type: 'group',
      label: 'Press Quotes',
      itemLabel: 'Quote',
      min: 0,
      max: 6,
      fields: {
        quote: { type: 'textarea', label: 'Quote', default: '' },
        source: { type: 'text', label: 'Source', default: '' }
      },
      default: [
        { quote: 'Raw, honest, and utterly captivating', source: 'Rolling Stone' },
        { quote: 'The most exciting new sound in indie rock', source: 'Pitchfork' }
      ]
    },
    
    socialLinks: {
      type: 'group',
      label: 'Social & Streaming',
      itemLabel: 'Link',
      min: 0,
      max: 8,
      fields: {
        platform: { type: 'text', label: 'Platform', default: '' },
        url: { type: 'text', label: 'URL', default: '' }
      },
      default: [
        { platform: 'Instagram', url: '@midnightcollective' },
        { platform: 'Spotify', url: 'spotify:artist:...' },
        { platform: 'YouTube', url: 'youtube.com/...' }
      ]
    },
    
    contactEmail: { type: 'text', default: 'booking@midnightcollective.com', label: 'Contact/Booking Email' },
    
    bandPhoto: { 
      type: 'image', 
      label: 'Band Photo',
      accept: 'image/*'
    },
    
    accentColor: { type: 'color', default: '#dc2626', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Dark',
      label: 'Theme'
    }
  }
},
'cleaning-service': {
  id: 'cleaning-service',
  name: 'Cleaning Service',
  category: 'Business',
  customizable: {
    businessName: { type: 'text', default: 'Sparkle & Shine Cleaning', label: 'Business Name' },
    tagline: { type: 'text', default: 'Professional Cleaning You Can Trust', label: 'Tagline' },
    yearsInBusiness: { type: 'text', default: '15+', label: 'Years in Business' },
    
    heroText: {
      type: 'textarea',
      default: 'Experience the difference of a truly clean home. Our professional team delivers exceptional results with eco-friendly products and attention to detail.',
      label: 'Hero Description'
    },
    
    services: {
      type: 'group',
      label: 'Services',
      itemLabel: 'Service',
      min: 1,
      max: 8,
      fields: {
        name: { type: 'text', label: 'Service Name', default: '' },
        description: { type: 'textarea', label: 'Description', default: '' },
        price: { type: 'text', label: 'Starting Price', default: '' }
      },
      default: [
        { 
          name: 'Residential Cleaning',
          description: 'Complete home cleaning including all rooms, kitchen, and bathrooms. Customized to your needs.',
          price: '$120'
        },
        { 
          name: 'Deep Cleaning',
          description: 'Thorough top-to-bottom cleaning including baseboards, inside appliances, and hard-to-reach areas.',
          price: '$200'
        },
        { 
          name: 'Move In/Out Cleaning',
          description: 'Comprehensive cleaning for moving transitions. Perfect for landlords and tenants.',
          price: '$250'
        },
        { 
          name: 'Office Cleaning',
          description: 'Professional commercial cleaning for offices, retail spaces, and business facilities.',
          price: '$150'
        }
      ]
    },
    
    whyChooseUs: {
      type: 'repeatable',
      label: 'Why Choose Us',
      itemLabel: 'Reason',
      default: [
        'Eco-friendly products',
        'Insured & bonded',
        'Background-checked staff',
        '100% satisfaction guarantee',
        'Flexible scheduling',
        'No contracts required'
      ],
      max: 10
    },
    
    serviceAreas: {
      type: 'repeatable',
      label: 'Service Areas',
      itemLabel: 'Area',
      default: [
        'Downtown',
        'North End',
        'West Side',
        'Suburbs'
      ],
      max: 12
    },
    
    testimonials: {
      type: 'group',
      label: 'Customer Reviews',
      itemLabel: 'Review',
      min: 0,
      max: 6,
      fields: {
        name: { type: 'text', label: 'Customer Name', default: '' },
        location: { type: 'text', label: 'Location', default: '' },
        review: { type: 'textarea', label: 'Review', default: '' },
        rating: { type: 'text', label: 'Rating (out of 5)', default: '5' }
      },
      default: [
        { 
          name: 'Jennifer M.',
          location: 'Downtown',
          review: 'Absolutely amazing service! My house has never been cleaner. The team was professional, thorough, and respectful of my home.',
          rating: '5'
        },
        { 
          name: 'Michael R.',
          location: 'West Side',
          review: 'I use them for my office every week. Always reliable, always spotless. Highly recommend!',
          rating: '5'
        }
      ]
    },
    
    phone: { type: 'text', default: '(555) 123-4567', label: 'Phone Number' },
    email: { type: 'text', default: 'info@sparkleclean.com', label: 'Email' },
    hours: { type: 'text', default: 'Mon-Sat: 8:00 AM - 6:00 PM', label: 'Business Hours' },
    bookingUrl: { type: 'text', default: '#book', label: 'Booking URL' },
    
    accentColor: { type: 'color', default: '#06b6d4', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Light',
      label: 'Theme'
    }
  }
},
'real-estate-agent': {
  id: 'real-estate-agent',
  name: 'Real Estate Agent',
  category: 'Business',
  customizable: {
    agentName: { type: 'text', default: 'Sarah Mitchell', label: 'Your Name' },
    title: { type: 'text', default: 'Licensed Real Estate Agent', label: 'Title/License' },
    brokerage: { type: 'text', default: 'Prestige Realty Group', label: 'Brokerage/Company' },
    tagline: { 
      type: 'text', 
      default: 'Helping You Find Your Dream Home', 
      label: 'Tagline' 
    },
    
    bio: {
      type: 'textarea',
      default: 'With over 10 years of experience in the local market, I specialize in helping families find their perfect home. My commitment to personalized service and market expertise ensures a smooth, successful transaction every time.',
      label: 'Bio'
    },
    
    yearsExperience: { type: 'text', default: '10+', label: 'Years of Experience' },
    homesSold: { type: 'text', default: '500+', label: 'Homes Sold' },
    
    specializations: {
      type: 'repeatable',
      label: 'Specializations',
      itemLabel: 'Specialization',
      default: [
        'First-Time Home Buyers',
        'Luxury Properties',
        'Investment Properties',
        'Relocation Services'
      ],
      max: 8
    },
    
    featuredListings: {
      type: 'group',
      label: 'Featured Listings',
      itemLabel: 'Listing',
      min: 0,
      max: 6,
      fields: {
        image: { type: 'image', label: 'Property Image', accept: 'image/*' },
        address: { type: 'text', label: 'Address', default: '' },
        price: { type: 'text', label: 'Price', default: '' },
        beds: { type: 'text', label: 'Bedrooms', default: '' },
        baths: { type: 'text', label: 'Bathrooms', default: '' },
        sqft: { type: 'text', label: 'Square Feet', default: '' },
        status: { type: 'select', options: ['For Sale', 'Sold', 'Pending', 'Coming Soon'], label: 'Status', default: 'For Sale' }
      },
      default: [
        { 
          address: '123 Maple Avenue',
          price: '$725,000',
          beds: '4',
          baths: '3',
          sqft: '2,800',
          status: 'For Sale'
        },
        { 
          address: '456 Oak Street',
          price: '$895,000',
          beds: '5',
          baths: '4',
          sqft: '3,500',
          status: 'Sold'
        },
        { 
          address: '789 Pine Drive',
          price: '$650,000',
          beds: '3',
          baths: '2.5',
          sqft: '2,200',
          status: 'Pending'
        }
      ]
    },
    
    serviceAreas: {
      type: 'repeatable',
      label: 'Service Areas',
      itemLabel: 'Area',
      default: [
        'Downtown',
        'Westside',
        'Eastside',
        'Suburbs'
      ],
      max: 10
    },
    
    testimonials: {
      type: 'group',
      label: 'Client Testimonials',
      itemLabel: 'Testimonial',
      min: 0,
      max: 4,
      fields: {
        name: { type: 'text', label: 'Client Name', default: '' },
        review: { type: 'textarea', label: 'Review', default: '' },
        propertyType: { type: 'text', label: 'Property Type', default: '' }
      },
      default: [
        { 
          name: 'Jennifer & Mike Thompson',
          review: 'Sarah made our home-buying experience effortless. She understood exactly what we were looking for and found us the perfect home within our budget.',
          propertyType: 'Single Family Home'
        },
        { 
          name: 'David Chen',
          review: 'Professional, knowledgeable, and always available. Sarah sold our home in just 10 days for above asking price!',
          propertyType: 'Condo'
        }
      ]
    },
    
    certifications: {
      type: 'repeatable',
      label: 'Certifications',
      itemLabel: 'Certification',
      default: [
        'NAR Member',
        'Certified Luxury Home Specialist',
        'Accredited Buyer Representative'
      ],
      max: 8
    },
    
    phone: { type: 'text', default: '(555) 987-6543', label: 'Phone Number' },
    email: { type: 'text', default: 'sarah@prestigerealty.com', label: 'Email' },
    officeAddress: { type: 'text', default: '100 Main Street, Suite 200', label: 'Office Address' },
    licenseNumber: { type: 'text', default: 'DRE #01234567', label: 'License Number' },
    
    socialLinks: {
      type: 'group',
      label: 'Social Links',
      itemLabel: 'Social Link',
      min: 0,
      max: 6,
      fields: {
        platform: { type: 'text', label: 'Platform', default: '' },
        url: { type: 'text', label: 'URL', default: '' }
      },
      default: [
        { platform: 'LinkedIn', url: 'linkedin.com/in/sarahmitchell' },
        { platform: 'Instagram', url: '@sarahmitchellrealestate' }
      ]
    },
    
    agentPhoto: { 
      type: 'image', 
      label: 'Professional Photo',
      accept: 'image/*'
    },
    
    accentColor: { type: 'color', default: '#2563eb', label: 'Accent Color' },
    darkMode: { 
      type: 'select', 
      options: ['Light', 'Dark', 'Auto'],
      default: 'Light',
      label: 'Theme'
    }
  }
}
};


function CustomizeModal({ templateId, isOpen, onClose, userTheme }) {
  const templateConfig = templateConfigs[templateId];
  const [isAnimating, setIsAnimating] = useState(false);
  const [customization, setCustomization] = useState({});
  const [images, setImages] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Load saved customization from localStorage
  useEffect(() => {
    if (templateConfig) {
      const savedKey = `template_customization_${templateId}`;
      const saved = localStorage.getItem(savedKey);
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCustomization(parsed);
        } catch (error) {
          console.error('Error parsing saved customization:', error);
          initializeDefaults();
        }
      } else {
        initializeDefaults();
      }
    }

    function initializeDefaults() {
      const defaults = { 
        __userModifiedStyles: {},
        __visibility: {}
      };
      
      Object.entries(templateConfig.customizable).forEach(([key, config]) => {
        if (key === 'darkMode' && config.type === 'select') {
          defaults[key] = userTheme === 'dark' ? 'Dark' : userTheme === 'light' ? 'Light' : 'Auto';
          // Mark as modified so it takes precedence
          defaults.__userModifiedStyles[key] = true;
        } else if (config.type === 'group' || config.type === 'repeatable') {
          defaults[key] = config.default || [];
        } else {
          defaults[key] = config.default;
        }
      });
      
      setCustomization(defaults);
      setImages({});
    }
  }, [templateId, templateConfig, userTheme]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCustomizationChange = (newCustomization) => {
    setCustomization(newCustomization);
    
    // Save to localStorage
    const savedKey = `template_customization_${templateId}`;
    localStorage.setItem(savedKey, JSON.stringify(newCustomization));
  };

  const handleImageChange = (field, imageData) => {
    setImages(prev => ({
      ...prev,
      [field]: imageData
    }));
  };

  const [expandedGroups, setExpandedGroups] = useState({});

  const handleFieldFocus = (fieldName) => {
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.');
      const groupKey = parts[0];
      const index = parseInt(parts[1]);
      
      // Force expand the group item
      const key = `${groupKey}-${index}`;
      setExpandedGroups(prev => ({
        ...prev,
        [key]: true
      }));
      
      // Scroll first
      setTimeout(() => {
        const groupElement = document.querySelector(`[data-field="${groupKey}"]`);
        if (groupElement) {
          groupElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Wait longer for the expansion animation to complete
          setTimeout(() => {
            const groupItems = groupElement.querySelectorAll('.field__group-item');
            const targetItem = groupItems[index];
            
            if (targetItem) {
              // Find the input within the expanded fields container
              const fieldsContainer = targetItem.querySelector('.field__group-item-fields');
              const input = fieldsContainer?.querySelector('input, textarea, select');
              
              if (input) {
                input.focus();
                // For text inputs, also move cursor to end
                if (input.type === 'text' || input.tagName === 'TEXTAREA') {
                  input.setSelectionRange(input.value.length, input.value.length);
                }
              }
            }
          }, 350); // Increased from 100ms to 350ms
        }
      }, 50);
    } else {
      const fieldElement = document.querySelector(`[data-field="${fieldName}"]`);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = fieldElement.querySelector('input, textarea, select');
        if (input) {
          setTimeout(() => input.focus(), 300);
        }
      }
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateZip(templateId, customization, images);
    } catch (error) {
      console.error('Error generating zip:', error);
      alert('Failed to generate files. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenPreview = () => {
    const html = generateHTML(templateId, customization, images);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDeploy = () => {
    alert('Deployment feature coming soon!');
  };

  if (!isOpen || !templateConfig) return null;

  return (
    <>
      <div 
        className={`modal-backdrop ${isAnimating ? 'modal-backdrop--visible' : ''}`}
        onClick={handleClose}
      />
      <div className={`customize-modal ${isAnimating ? 'customize-modal--visible' : ''}`}>
        <div className="customize-modal__header">
          <div className="customize-modal__header-left">
            <button 
              className="customize-modal__close"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div>
              <h1 className="customize-modal__title">{templateConfig.name}</h1>
              <p className="customize-modal__subtitle">Customize your template</p>
            </div>
          </div>
          
          <div className="customize-modal__actions">
            <button 
              className="btn btn-secondary"
              onClick={handleOpenPreview}
              title="Open preview in new tab"
            >
              <ExternalLink size={18} />
              Preview
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <Download size={18} />
              {isGenerating ? 'Generating...' : 'Download'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <Construction size={18} />
              Deploy
            </button>
          </div>
        </div>

        <div className="customize-modal__content">
          <CustomizationPanel
            config={templateConfig.customizable}
            values={customization}
            onChange={handleCustomizationChange}
            images={images}
            onImageChange={handleImageChange}
            expandedGroups={expandedGroups}
            onExpandedGroupsChange={setExpandedGroups}
          />
          
          <LivePreview
            templateId={templateId}
            customization={customization}
            images={images}
            onFieldClick={handleFieldFocus}
          />
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        templateId={templateId}
        customization={customization}
        images={images}
      />
    </>
  );
}

export default CustomizeModal;