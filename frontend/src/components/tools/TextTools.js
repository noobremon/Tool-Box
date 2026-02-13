import React, { useState } from 'react';
import axios from 'axios';
import { Copy, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
const API = `${BACKEND_URL}/api`;

const TextTools = ({ tool }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcess = async () => {
    setLoading(true);
    try {
      switch (tool.id) {
        case 'case-converter': {
          const caseType = document.getElementById('case-type').value;
          const response = await axios.post(`${API}/tools/text/convert`, {
            text: inputText,
            case_type: caseType
          });
          setResult(response.data.result);
          break;
        }
        case 'word-counter': {
          const response = await axios.post(`${API}/tools/text/wordcount`, {
            text: inputText
          });
          setResult(`Words: ${response.data.words}\nCharacters: ${response.data.characters}\nCharacters (no spaces): ${response.data.characters_no_spaces}\nLines: ${response.data.lines}`);
          break;
        }
        case 'lorem-ipsum': {
          const paragraphs = parseInt(document.getElementById('paragraphs').value) || 3;
          const response = await axios.post(`${API}/tools/text/lorem`, {
            paragraphs
          });
          setResult(response.data.result);
          break;
        }
        case 'whitespace-remover': {
          const response = await axios.post(`${API}/tools/text/whitespace`, {
            text: inputText
          });
          setResult(response.data.result);
          break;
        }
        case 'base64-converter': {
          const encode = document.getElementById('encode-decode').value === 'encode';
          const response = await axios.post(`${API}/tools/text/base64`, {
            text: inputText,
            encode
          });
          setResult(response.data.result);
          break;
        }
        case 'url-encoder': {
          const encode = document.getElementById('url-encode-decode').value === 'encode';
          const response = await axios.post(`${API}/tools/text/url-encode`, {
            text: inputText,
            encode
          });
          setResult(response.data.result);
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
      case 'case-converter':
        return (
          <div className="tool-option">
            <label>Case Type:</label>
            <select id="case-type" data-testid="case-type-select">
              <option value="upper">UPPERCASE</option>
              <option value="lower">lowercase</option>
              <option value="title">Title Case</option>
              <option value="sentence">Sentence case</option>
              <option value="camel">camelCase</option>
              <option value="snake">snake_case</option>
              <option value="kebab">kebab-case</option>
            </select>
          </div>
        );
      case 'lorem-ipsum':
        return (
          <div className="tool-option">
            <label>Number of Paragraphs:</label>
            <input 
              type="number" 
              id="paragraphs" 
              defaultValue="3" 
              min="1" 
              max="10"
              data-testid="paragraphs-input"
            />
          </div>
        );
      case 'base64-converter':
        return (
          <div className="tool-option">
            <label>Action:</label>
            <select id="encode-decode" data-testid="encode-decode-select">
              <option value="encode">Encode</option>
              <option value="decode">Decode</option>
            </select>
          </div>
        );
      case 'url-encoder':
        return (
          <div className="tool-option">
            <label>Action:</label>
            <select id="url-encode-decode" data-testid="url-encode-decode-select">
              <option value="encode">Encode</option>
              <option value="decode">Decode</option>
            </select>
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
        {renderToolSpecificInputs()}
        {tool.id !== 'lorem-ipsum' && (
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
            data-testid="text-input"
          />
        )}
        <button 
          className="btn-primary" 
          onClick={handleProcess}
          disabled={loading}
          data-testid="process-button"
        >
          {loading ? 'Processing...' : 'Process'}
        </button>
      </div>

      {result && (
        <div className="tool-section">
          <div className="result-header">
            <h3>Result</h3>
            <button 
              className="btn-secondary copy-btn"
              onClick={handleCopy}
              data-testid="copy-button"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={result}
            readOnly
            data-testid="result-output"
          />
        </div>
      )}
    </div>
  );
};

export default TextTools;