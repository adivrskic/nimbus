import { useState, useEffect } from 'react';
import { X, Download, Construction, ExternalLink } from 'lucide-react';
import CustomizationPanel from './CustomizationPanel';
import LivePreview from './LivePreview';
import { generateZip } from '../utils/generateZip';
import { generateHTML } from '../utils/templateRenderer';
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
  }
};


function CustomizeModal({ templateId, isOpen, onClose, userTheme }) {
  const templateConfig = templateConfigs[templateId];
  const [isAnimating, setIsAnimating] = useState(false);
  const [customization, setCustomization] = useState({});
  const [images, setImages] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

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
              className="btn btn-ghost"
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
              onClick={handleDeploy}
              disabled
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
    </>
  );
}

export default CustomizeModal;