import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeTools = ({ tool }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    try {
      if (tool.id === 'json-formatter') {
        const parsed = JSON.parse(inputText);
        setResult(JSON.stringify(parsed, null, 2));
      }
    } catch (error) {
      setResult('Error: Invalid JSON - ' + error.message);
    }
  };

  return (
    <div className="tool-content">
      <div className="tool-section">
        <h3>Input</h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='{"name": "John", "age": 30}'
          data-testid="json-input"
        />
        <button 
          className="btn-primary" 
          onClick={handleFormat}
          data-testid="format-json-button"
        >
          Format JSON
        </button>
      </div>

      {result && (
        <div className="tool-section">
          <div className="result-header">
            <h3>Formatted JSON</h3>
            <button 
              className="btn-secondary copy-btn"
              onClick={handleCopy}
              data-testid="copy-json"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={result}
            readOnly
            data-testid="json-result"
          />
        </div>
      )}
    </div>
  );
};

export default CodeTools;