import React, { useState } from 'react';
import axios from 'axios';
import { Copy, Check, RefreshCw } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
const API = `${BACKEND_URL}/api`;

const MiscTools = ({ tool }) => {
  const [result, setResult] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      switch (tool.id) {
        case 'qr-generator': {
          const text = document.getElementById('qr-text').value;
          const size = parseInt(document.getElementById('qr-size').value) || 300;
          const response = await axios.post(`${API}/tools/misc/qrcode`, {
            text,
            size
          });
          setQrImage(response.data.image);
          setResult(text);
          break;
        }
        case 'password-generator': {
          const length = parseInt(document.getElementById('pwd-length').value) || 16;
          const includeUpper = document.getElementById('include-upper').checked;
          const includeLower = document.getElementById('include-lower').checked;
          const includeNumbers = document.getElementById('include-numbers').checked;
          const includeSymbols = document.getElementById('include-symbols').checked;
          
          const response = await axios.post(`${API}/tools/misc/password`, {
            length,
            include_uppercase: includeUpper,
            include_lowercase: includeLower,
            include_numbers: includeNumbers,
            include_symbols: includeSymbols
          });
          setResult(response.data.password);
          break;
        }
        case 'list-shuffler': {
          const text = document.getElementById('list-items').value;
          const items = text.split('\n').filter(item => item.trim());
          const response = await axios.post(`${API}/tools/misc/shuffle`, {
            items
          });
          setResult(response.data.shuffled.join('\n'));
          break;
        }
        case 'uuid-generator': {
          const response = await axios.get(`${API}/tools/misc/uuid`);
          setResult(response.data.uuid);
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
      case 'qr-generator':
        return (
          <>
            <div className="tool-option">
              <label>Text/URL:</label>
              <input 
                type="text" 
                id="qr-text" 
                placeholder="Enter text or URL"
                defaultValue="https://example.com"
                data-testid="qr-text-input"
              />
            </div>
            <div className="tool-option">
              <label>Size (px):</label>
              <input 
                type="number" 
                id="qr-size" 
                defaultValue="300"
                min="100"
                max="1000"
                data-testid="qr-size-input"
              />
            </div>
          </>
        );
      
      case 'password-generator':
        return (
          <>
            <div className="tool-option">
              <label>Length:</label>
              <input 
                type="number" 
                id="pwd-length" 
                defaultValue="16"
                min="4"
                max="128"
                data-testid="password-length"
              />
            </div>
            <div className="tool-option checkbox-option">
              <input 
                type="checkbox" 
                id="include-upper" 
                defaultChecked
                data-testid="include-uppercase"
              />
              <label htmlFor="include-upper">Include Uppercase (A-Z)</label>
            </div>
            <div className="tool-option checkbox-option">
              <input 
                type="checkbox" 
                id="include-lower" 
                defaultChecked
                data-testid="include-lowercase"
              />
              <label htmlFor="include-lower">Include Lowercase (a-z)</label>
            </div>
            <div className="tool-option checkbox-option">
              <input 
                type="checkbox" 
                id="include-numbers" 
                defaultChecked
                data-testid="include-numbers"
              />
              <label htmlFor="include-numbers">Include Numbers (0-9)</label>
            </div>
            <div className="tool-option checkbox-option">
              <input 
                type="checkbox" 
                id="include-symbols" 
                defaultChecked
                data-testid="include-symbols"
              />
              <label htmlFor="include-symbols">Include Symbols (!@#$...)</label>
            </div>
          </>
        );
      
      case 'list-shuffler':
        return (
          <div className="tool-option">
            <label>Items (one per line):</label>
            <textarea
              id="list-items"
              placeholder="Enter items, one per line..."
              defaultValue="Apple\nBanana\nCherry\nDate\nElderkberry"
              data-testid="list-items"
            />
          </div>
        );
      
      case 'uuid-generator':
        return (
          <p className="tool-description">Click generate to create a new UUID</p>
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
          data-testid="generate-misc-button"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {qrImage && (
        <div className="tool-section">
          <h3>QR Code</h3>
          <div className="qr-result" data-testid="qr-result">
            <img src={qrImage} alt="QR Code" />
            <a 
              href={qrImage} 
              download="qrcode.png" 
              className="btn-secondary"
              data-testid="download-qr"
            >
              Download QR Code
            </a>
          </div>
        </div>
      )}

      {result && !qrImage && (
        <div className="tool-section">
          <div className="result-header">
            <h3>Result</h3>
            <button 
              className="btn-secondary copy-btn"
              onClick={handleCopy}
              data-testid="copy-result"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={result}
            readOnly
            data-testid="misc-result"
          />
        </div>
      )}
    </div>
  );
};

export default MiscTools;