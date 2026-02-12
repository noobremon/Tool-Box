import { 
  Type, AlignLeft, FileText, Eraser, Binary, Link,
  Palette, Droplet, Sparkles as SparklesIcon, Grid3x3,
  Layout, Box, Circle, Wand2,
  QrCode, Key, Shuffle, Fingerprint,
  Code2, Braces,
  Image as ImageIcon, Maximize, Minimize, Sliders, Droplets,
  Ruler, Weight, Thermometer, HardDrive, DollarSign,
  User, Mail, Barcode, CreditCard, FileImage,
  Calculator, Percent, Calendar, Clock,
  Tag, Share2, Search,
  Terminal, Diff, Hash, Timer, TestTube,
  Brain, Sparkles, Wand
} from 'lucide-react';

export const toolsData = {
  text: {
    name: 'Text Tools',
    tools: [
      {
        id: 'case-converter',
        name: 'Case Converter',
        description: 'Convert text between different cases',
        category: 'Text',
        icon: Type
      },
      {
        id: 'word-counter',
        name: 'Word Counter',
        description: 'Count words, characters, and lines',
        category: 'Text',
        icon: AlignLeft
      },
      {
        id: 'lorem-ipsum',
        name: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text',
        category: 'Text',
        icon: FileText
      },
      {
        id: 'whitespace-remover',
        name: 'Whitespace Remover',
        description: 'Remove extra whitespaces',
        category: 'Text',
        icon: Eraser
      },
      {
        id: 'base64-converter',
        name: 'Base64 Converter',
        description: 'Encode/decode Base64 strings',
        category: 'Text',
        icon: Binary
      },
      {
        id: 'url-encoder',
        name: 'URL Encoder',
        description: 'Encode/decode URLs',
        category: 'Text',
        icon: Link
      }
    ]
  },
  color: {
    name: 'Color Tools',
    tools: [
      {
        id: 'color-converter',
        name: 'Color Converter',
        description: 'Convert between HEX, RGB, HSL',
        category: 'Color',
        icon: Palette
      },
      {
        id: 'palette-generator',
        name: 'Palette Generator',
        description: 'Generate color palettes',
        category: 'Color',
        icon: Grid3x3
      },
      {
        id: 'shades-generator',
        name: 'Shades Generator',
        description: 'Generate color shades',
        category: 'Color',
        icon: Droplet
      }
    ]
  },
  css: {
    name: 'CSS Tools',
    tools: [
      {
        id: 'gradient-generator',
        name: 'Gradient Generator',
        description: 'Create CSS gradients',
        category: 'CSS',
        icon: Layout
      },
      {
        id: 'box-shadow',
        name: 'Box Shadow Generator',
        description: 'Generate box shadow CSS',
        category: 'CSS',
        icon: Box
      },
      {
        id: 'border-radius',
        name: 'Border Radius',
        description: 'Create border radius styles',
        category: 'CSS',
        icon: Circle
      },
      {
        id: 'glassmorphism',
        name: 'Glassmorphism',
        description: 'Generate glass effect styles',
        category: 'CSS',
        icon: Wand2
      }
    ]
  },
  code: {
    name: 'Coding Tools',
    tools: [
      {
        id: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Format and validate JSON',
        category: 'Code',
        icon: Braces
      }
    ]
  },
  converters: {
    name: 'Unit Converters',
    tools: [
      {
        id: 'length-converter',
        name: 'Length Converter',
        description: 'Convert length units',
        category: 'Converters',
        icon: Ruler
      },
      {
        id: 'weight-converter',
        name: 'Weight Converter',
        description: 'Convert weight units',
        category: 'Converters',
        icon: Weight
      },
      {
        id: 'temperature-converter',
        name: 'Temperature Converter',
        description: 'Convert temperature units',
        category: 'Converters',
        icon: Thermometer
      },
      {
        id: 'data-converter',
        name: 'Data Size Converter',
        description: 'Convert data storage units',
        category: 'Converters',
        icon: HardDrive
      }
    ]
  },
  generators: {
    name: 'Generators',
    tools: [
      {
        id: 'username-generator',
        name: 'Username Generator',
        description: 'Generate random usernames',
        category: 'Generators',
        icon: User
      },
      {
        id: 'email-generator',
        name: 'Email Generator',
        description: 'Generate email addresses',
        category: 'Generators',
        icon: Mail
      },
      {
        id: 'barcode-generator',
        name: 'Barcode Generator',
        description: 'Generate barcodes',
        category: 'Generators',
        icon: Barcode
      }
    ]
  },
  math: {
    name: 'Math Tools',
    tools: [
      {
        id: 'calculator',
        name: 'Calculator',
        description: 'Perform calculations',
        category: 'Math',
        icon: Calculator
      },
      {
        id: 'percentage',
        name: 'Percentage Calculator',
        description: 'Calculate percentages',
        category: 'Math',
        icon: Percent
      },
      {
        id: 'age-calculator',
        name: 'Age Calculator',
        description: 'Calculate age from birth date',
        category: 'Math',
        icon: Calendar
      }
    ]
  },
  seo: {
    name: 'SEO & Marketing',
    tools: [
      {
        id: 'meta-tags',
        name: 'Meta Tags Generator',
        description: 'Generate HTML meta tags',
        category: 'SEO',
        icon: Tag
      },
      {
        id: 'open-graph',
        name: 'Open Graph Generator',
        description: 'Generate Open Graph tags',
        category: 'SEO',
        icon: Share2
      }
    ]
  },
  developer: {
    name: 'Developer Tools',
    tools: [
      {
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Test regular expressions',
        category: 'Developer',
        icon: TestTube
      },
      {
        id: 'diff-checker',
        name: 'Diff Checker',
        description: 'Compare text differences',
        category: 'Developer',
        icon: Diff
      },
      {
        id: 'hash-generator',
        name: 'Hash Generator',
        description: 'Generate hashes (MD5, SHA)',
        category: 'Developer',
        icon: Hash
      },
      {
        id: 'timestamp-converter',
        name: 'Timestamp Converter',
        description: 'Convert Unix timestamps',
        category: 'Developer',
        icon: Clock
      }
    ]
  },
  ai: {
    name: 'AI Tools',
    tools: [
      {
        id: 'ai-text',
        name: 'AI Text Tool',
        description: 'Paraphrase, enhance, summarize',
        category: 'AI',
        icon: Brain
      },
      {
        id: 'ai-image',
        name: 'AI Image Generator',
        description: 'Generate images from text',
        category: 'AI',
        icon: Wand
      }
    ]
  },
  misc: {
    name: 'Miscellaneous',
    tools: [
      {
        id: 'qr-generator',
        name: 'QR Code Generator',
        description: 'Generate QR codes',
        category: 'Misc',
        icon: QrCode
      },
      {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Generate secure passwords',
        category: 'Misc',
        icon: Key
      },
      {
        id: 'list-shuffler',
        name: 'List Shuffler',
        description: 'Randomly shuffle lists',
        category: 'Misc',
        icon: Shuffle
      },
      {
        id: 'uuid-generator',
        name: 'UUID Generator',
        description: 'Generate unique identifiers',
        category: 'Misc',
        icon: Fingerprint
      }
    ]
  }
};
