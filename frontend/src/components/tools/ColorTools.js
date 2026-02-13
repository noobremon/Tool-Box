import React, { useState } from 'react';
import axios from 'axios';
import { Copy, Check, RefreshCw } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
const API = `${BACKEND_URL}/api`;

const ColorTools = ({ tool }) => {
  const [inputColor, setInputColor] = useState('#3b82f6');
  const [result, setResult] = useState('');
  const [palette, setPalette] = useState([]);
  const [shades, setShades] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcess = async () => {
    setLoading(true);
    try {
      switch (tool.id) {
        case 'color-converter': {
          const fromFormat = document.getElementById('from-format').value;
          const toFormat = document.getElementById('to-format').value;
          const response = await axios.post(`${API}/tools/color/convert`, {
            color: inputColor,
            from_format: fromFormat,
            to_format: toFormat
          });
          setResult(response.data.result);
          break;
        }
        case 'palette-generator': {
          const count = parseInt(document.getElementById('palette-count').value) || 5;
          const response = await axios.post(`${API}/tools/color/palette`, {
            base_color: inputColor,
            count
          });
          setPalette(response.data.palette);
          break;
        }
        case 'shades-generator': {
          const count = parseInt(document.getElementById('shades-count').value) || 10;
          const response = await axios.post(`${API}/tools/color/shades`, {
            color: inputColor,
            count
          });
          setShades(response.data.shades);
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

  const renderToolSpecificInputs = () => {
    switch (tool.id) {
      case 'color-converter':
        return (
          <>
            <div className="tool-option">
              <label>From Format:</label>
              <select id="from-format" data-testid="from-format-select">
                <option value="hex">HEX</option>
                <option value="rgb">RGB</option>
                <option value="rgba">RGBA</option>
              </select>
            </div>
            <div className="tool-option">
              <label>To Format:</label>
              <select id="to-format" data-testid="to-format-select">
                <option value="hex">HEX</option>
                <option value="rgb">RGB</option>
                <option value="rgba">RGBA</option>
                <option value="hsl">HSL</option>
              </select>
            </div>
          </>
        );
      case 'palette-generator':
        return (
          <div className="tool-option">
            <label>Number of Colors:</label>
            <input 
              type="number" 
              id="palette-count" 
              defaultValue="5" 
              min="2" 
              max="10"
              data-testid="palette-count-input"
            />
          </div>
        );
      case 'shades-generator':
        return (
          <div className="tool-option">
            <label>Number of Shades:</label>
            <input 
              type="number" 
              id="shades-count" 
              defaultValue="10" 
              min="3" 
              max="20"
              data-testid="shades-count-input"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="tool-content">
      <div className="tool-section">
        <h3>Input</h3>
        <div className="tool-option">
          <label>Color:</label>
          <div className="color-input-wrapper">
            <input
              type="color"
              value={inputColor}
              onChange={(e) => setInputColor(e.target.value)}
              data-testid="color-picker"
            />
            <input
              type="text"
              value={inputColor}
              onChange={(e) => setInputColor(e.target.value)}
              placeholder="#3b82f6"
              data-testid="color-text-input"
            />
          </div>
        </div>
        {renderToolSpecificInputs()}
        <button 
          className="btn-primary" 
          onClick={handleProcess}
          disabled={loading}
          data-testid="generate-button"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {result && (
        <div className="tool-section">
          <div className="result-header">
            <h3>Result</h3>
            <button 
              className="btn-secondary copy-btn"
              onClick={() => handleCopy(result)}
              data-testid="copy-result-button"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="color-result">
            <div className="color-preview" style={{ background: result }}></div>
            <input type="text" value={result} readOnly data-testid="color-result" />
          </div>
        </div>
      )}

      {palette.length > 0 && (
        <div className="tool-section">
          <h3>Generated Palette</h3>
          <div className="color-palette" data-testid="color-palette">
            {palette.map((color, index) => (
              <div key={index} className="palette-item">
                <div 
                  className="color-swatch" 
                  style={{ background: color }}
                  onClick={() => handleCopy(color)}
                  data-testid={`palette-color-${index}`}
                ></div>
                <span>{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {shades.length > 0 && (
        <div className="tool-section">
          <h3>Generated Shades</h3>
          <div className="color-shades" data-testid="color-shades">
            {shades.map((shade, index) => (
              <div 
                key={index} 
                className="shade-item"
                style={{ background: shade }}
                onClick={() => handleCopy(shade)}
                title={shade}
                data-testid={`shade-${index}`}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorTools;