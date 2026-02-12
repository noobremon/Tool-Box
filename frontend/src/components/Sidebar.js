import React from 'react';
import { 
  Type, 
  Palette, 
  Code, 
  Image, 
  Layout,
  Sparkles,
  Grid3x3,
  Ruler,
  User,
  Calculator,
  Tag,
  Terminal,
  Brain
} from 'lucide-react';
import { toolsData } from '../data/toolsData';

const categoryIcons = {
  text: Type,
  color: Palette,
  css: Layout,
  image: Image,
  code: Code,
  converters: Ruler,
  generators: User,
  math: Calculator,
  seo: Tag,
  developer: Terminal,
  ai: Brain,
  misc: Sparkles
};

const Sidebar = ({ selectedCategory, setSelectedCategory, isOpen, onClose }) => {
  const categories = [
    { id: 'all', name: 'All Tools', icon: Grid3x3 },
    ...Object.keys(toolsData).map(key => ({
      id: key,
      name: toolsData[key].name,
      icon: categoryIcons[key] || Grid3x3,
      count: toolsData[key].tools.length
    }))
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className={`sidebar-item ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  onClose();
                }}
                data-testid={`category-${category.id}`}
              >
                <Icon size={20} />
                <span>{category.name}</span>
                {category.count && (
                  <span className="category-count">{category.count}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;