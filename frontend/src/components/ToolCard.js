import React from 'react';
import { ArrowRight } from 'lucide-react';

const ToolCard = ({ tool, onClick }) => {
  return (
    <div 
      className="tool-card" 
      onClick={onClick}
      data-testid={`tool-card-${tool.id}`}
    >
      <div className="tool-card-header">
        <div className="tool-icon">
          {tool.icon && <tool.icon size={24} />}
        </div>
        <h3 className="tool-name">{tool.name}</h3>
      </div>
      
      <p className="tool-description">{tool.description}</p>
      
      <div className="tool-card-footer">
        <span className="tool-category">{tool.category}</span>
        <ArrowRight size={16} className="tool-arrow" />
      </div>
    </div>
  );
};

export default ToolCard;