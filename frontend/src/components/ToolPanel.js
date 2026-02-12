import React from 'react';
import { X } from 'lucide-react';
import TextTools from './tools/TextTools';
import ColorTools from './tools/ColorTools';
import CSSTools from './tools/CSSTools';
import MiscTools from './tools/MiscTools';
import CodeTools from './tools/CodeTools';
import NewToolsUniversal from './tools/AllNewTools';

const ToolPanel = ({ tool, onClose }) => {
  const renderTool = () => {
    switch (tool.category) {
      case 'Text':
        return <TextTools tool={tool} />;
      case 'Color':
        return <ColorTools tool={tool} />;
      case 'CSS':
        return <CSSTools tool={tool} />;
      case 'Misc':
        return <MiscTools tool={tool} />;
      case 'Code':
        return <CodeTools tool={tool} />;
      case 'Converters':
      case 'Generators':
      case 'Math':
      case 'SEO':
      case 'Developer':
      case 'AI':
        return <NewToolsUniversal tool={tool} />;
      default:
        return <div>Tool not implemented yet</div>;
    }
  };

  return (
    <div className="tool-panel fade-in" data-testid={`tool-panel-${tool.id}`}>
      <div className="tool-panel-header">
        <div>
          <h2>{tool.name}</h2>
          <p className="text-secondary">{tool.description}</p>
        </div>
        <button 
          className="close-btn"
          onClick={onClose}
          data-testid="close-tool-panel"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="tool-panel-content">
        {renderTool()}
      </div>
    </div>
  );
};

export default ToolPanel;