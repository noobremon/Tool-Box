import React, { useState } from 'react';
import axios from 'axios';
import { Copy, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
const API = `${BACKEND_URL}/api`;

const CSSTools = ({ tool }) => {
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Gradient state
  const [gradientColors, setGradientColors] = useState(['#3b82f6', '#10b981']);
  const [gradientDirection, setGradientDirection] = useState('to right');
  
  // Box shadow state
  const [shadowH, setShadowH] = useState(0);
  const [shadowV, setShadowV] = useState(5);
  const [shadowBlur, setShadowBlur] = useState(10);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState('rgba(0,0,0,0.3)');
  
  // Border radius state
  const [borderTL, setBorderTL] = useState(0);
  const [borderTR, setBorderTR] = useState(0);
  const [borderBR, setBorderBR] = useState(0);
  const [borderBL, setBorderBL] = useState(0);
  
  // Glassmorphism state
  const [glassBlur, setGlassBlur] = useState(10);
  const [glassOpacity, setGlassOpacity] = useState(0.3);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      switch (tool.id) {
        case 'gradient-generator': {
          const response = await axios.post(`${API}/tools/css/gradient`, {
            colors: gradientColors,
            direction: gradientDirection
          });
          setResult(response.data.css);
          break;
        }
        case 'box-shadow': {
          const response = await axios.post(`${API}/tools/css/box-shadow`, {
            h_offset: shadowH,
            v_offset: shadowV,
            blur: shadowBlur,
            spread: shadowSpread,
            color: shadowColor
          });
          setResult(response.data.css);
          break;
        }
        case 'border-radius': {
          const response = await axios.post(
            `${API}/tools/css/border-radius?tl=${borderTL}&tr=${borderTR}&br=${borderBR}&bl=${borderBL}`
          );
          setResult(response.data.css);
          break;
        }
        case 'glassmorphism': {
          const response = await axios.post(
            `${API}/tools/css/glassmorphism?blur=${glassBlur}&opacity=${glassOpacity}`
          );
          setResult(response.data.css);
          break;
        }
        default:
          setResult('Tool not implemented');
      }
    } catch (error) {
      setResult('Error: ' + (error.response?.data?.detail || error.message));
    }
    setLoading(false);
  };

  const renderToolInputs = () => {
    switch (tool.id) {
      case 'gradient-generator':
        return (
          <div className="gradient-controls">
            <div className="tool-option">
              <label>Direction:</label>
              <select 
                value={gradientDirection} 
                onChange={(e) => setGradientDirection(e.target.value)}
                data-testid="gradient-direction"
              >
                <option value="to right">To Right</option>
                <option value="to left">To Left</option>
                <option value="to bottom">To Bottom</option>
                <option value="to top">To Top</option>
                <option value="to bottom right">To Bottom Right</option>
                <option value="to bottom left">To Bottom Left</option>
              </select>
            </div>
            <div className="tool-option">
              <label>Colors:</label>
              <div className="gradient-colors">
                {gradientColors.map((color, index) => (
                  <input
                    key={index}
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...gradientColors];
                      newColors[index] = e.target.value;
                      setGradientColors(newColors);
                    }}
                    data-testid={`gradient-color-${index}`}
                  />
                ))}
                {gradientColors.length < 5 && (
                  <button 
                    className="btn-secondary"
                    onClick={() => setGradientColors([...gradientColors, '#000000'])}
                    data-testid="add-color"
                  >
                    + Add Color
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'box-shadow':
        return (
          <div className="shadow-controls">
            <div className="tool-option">
              <label>Horizontal Offset: {shadowH}px</label>
              <input 
                type="range" 
                min="-50" 
                max="50" 
                value={shadowH}
                onChange={(e) => setShadowH(parseInt(e.target.value))}
                data-testid="shadow-h"
              />
            </div>
            <div className="tool-option">
              <label>Vertical Offset: {shadowV}px</label>
              <input 
                type="range" 
                min="-50" 
                max="50" 
                value={shadowV}
                onChange={(e) => setShadowV(parseInt(e.target.value))}
                data-testid="shadow-v"
              />
            </div>
            <div className="tool-option">
              <label>Blur: {shadowBlur}px</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={shadowBlur}
                onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                data-testid="shadow-blur"
              />
            </div>
            <div className="tool-option">
              <label>Spread: {shadowSpread}px</label>
              <input 
                type="range" 
                min="-50" 
                max="50" 
                value={shadowSpread}
                onChange={(e) => setShadowSpread(parseInt(e.target.value))}
                data-testid="shadow-spread"
              />
            </div>
            <div className="tool-option">
              <label>Color:</label>
              <input 
                type="color" 
                value={shadowColor.startsWith('rgba') ? '#000000' : shadowColor}
                onChange={(e) => setShadowColor(e.target.value)}
                data-testid="shadow-color"
              />
            </div>
          </div>
        );
      
      case 'border-radius':
        return (
          <div className="border-controls">
            <div className="border-visual">
              <div 
                className="border-preview"
                style={{
                  borderRadius: `${borderTL}px ${borderTR}px ${borderBR}px ${borderBL}px`
                }}
              ></div>
            </div>
            <div className="tool-option">
              <label>Top Left: {borderTL}px</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={borderTL}
                onChange={(e) => setBorderTL(parseInt(e.target.value))}
                data-testid="border-tl"
              />
            </div>
            <div className="tool-option">
              <label>Top Right: {borderTR}px</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={borderTR}
                onChange={(e) => setBorderTR(parseInt(e.target.value))}
                data-testid="border-tr"
              />
            </div>
            <div className="tool-option">
              <label>Bottom Right: {borderBR}px</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={borderBR}
                onChange={(e) => setBorderBR(parseInt(e.target.value))}
                data-testid="border-br"
              />
            </div>
            <div className="tool-option">
              <label>Bottom Left: {borderBL}px</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={borderBL}
                onChange={(e) => setBorderBL(parseInt(e.target.value))}
                data-testid="border-bl"
              />
            </div>
          </div>
        );
      
      case 'glassmorphism':
        return (
          <div className="glass-controls">
            <div className="tool-option">
              <label>Blur: {glassBlur}px</label>
              <input 
                type="range" 
                min="0" 
                max="30" 
                value={glassBlur}
                onChange={(e) => setGlassBlur(parseInt(e.target.value))}
                data-testid="glass-blur"
              />
            </div>
            <div className="tool-option">
              <label>Opacity: {glassOpacity}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={glassOpacity}
                onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
                data-testid="glass-opacity"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderPreview = () => {
    switch (tool.id) {
      case 'gradient-generator':
        return (
          <div 
            className="css-preview gradient-preview"
            style={{ background: `linear-gradient(${gradientDirection}, ${gradientColors.join(', ')})` }}
            data-testid="gradient-preview"
          ></div>
        );
      case 'box-shadow':
        return (
          <div 
            className="css-preview shadow-preview"
            style={{ boxShadow: `${shadowH}px ${shadowV}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}` }}
            data-testid="shadow-preview"
          ></div>
        );
      case 'glassmorphism':
        return (
          <div 
            className="css-preview glass-preview"
            style={{
              background: `rgba(255, 255, 255, ${glassOpacity})`,
              backdropFilter: `blur(${glassBlur}px)`,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            data-testid="glass-preview"
          ></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="tool-content">
      <div className="tool-section">
        <h3>Settings</h3>
        {renderToolInputs()}
        <button 
          className="btn-primary" 
          onClick={handleGenerate}
          disabled={loading}
          data-testid="generate-css-button"
        >
          {loading ? 'Generating...' : 'Generate CSS'}
        </button>
      </div>

      <div className="tool-section">
        <h3>Preview</h3>
        {renderPreview()}
      </div>

      {result && (
        <div className="tool-section">
          <div className="result-header">
            <h3>CSS Code</h3>
            <button 
              className="btn-secondary copy-btn"
              onClick={handleCopy}
              data-testid="copy-css-button"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={result}
            readOnly
            data-testid="css-result"
          />
        </div>
      )}
    </div>
  );
};

export default CSSTools;