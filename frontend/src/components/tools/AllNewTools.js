// This file contains all new tool components
// Import and use individual components as needed

import React, { useState } from 'react';
import axios from 'axios';
import { Copy, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
const API = `${BACKEND_URL}/api`;

// Universal New Tools Component
export const NewToolsUniversal = ({ tool }) => {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [image, setImage] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcess = async () => {
    setLoading(true);
    setImage('');
    
    try {
      const category = tool.category;
      
      // Converter Tools
      if (category === 'Converters') {
        const value = parseFloat(document.getElementById('converter-value').value);
        const fromUnit = document.getElementById('from-unit').value;
        const toUnit = document.getElementById('to-unit').value;
        
        const categoryMap = {
          'length-converter': 'length',
          'weight-converter': 'weight',
          'temperature-converter': 'temperature',
          'data-converter': 'data'
        };
        
        const response = await axios.post(`${API}/tools/convert/units`, {
          value,
          from_unit: fromUnit,
          to_unit: toUnit,
          category: categoryMap[tool.id]
        });
        setResult(`${value} ${fromUnit} = ${response.data.result} ${toUnit}`);
      }
      
      // Generator Tools
      else if (category === 'Generators') {
        if (tool.id === 'username-generator') {
          const style = document.getElementById('username-style').value;
          const length = parseInt(document.getElementById('username-length').value) || 8;
          const response = await axios.post(`${API}/tools/generate/username`, { style, length });
          setResult(response.data.username);
        }
        else if (tool.id === 'email-generator') {
          const name = document.getElementById('email-name').value;
          const domain = document.getElementById('email-domain').value || 'example.com';
          const response = await axios.post(`${API}/tools/generate/email`, { name, domain });
          setResult(response.data.email);
        }
        else if (tool.id === 'barcode-generator') {
          const data = document.getElementById('barcode-data').value;
          const response = await axios.post(`${API}/tools/generate/barcode`, { data, barcode_type: 'code128' });
          setImage(response.data.image);
          setResult(data);
        }
      }
      
      // Math Tools
      else if (category === 'Math') {
        if (tool.id === 'calculator') {
          const expression = document.getElementById('calc-expression').value;
          const response = await axios.post(`${API}/tools/math/calculate`, { expression });
          setResult(response.data.result.toString());
        }
        else if (tool.id === 'percentage') {
          const value = parseFloat(document.getElementById('percent-value').value);
          const total = parseFloat(document.getElementById('percent-total').value);
          const operation = document.getElementById('percent-operation').value;
          const response = await axios.post(`${API}/tools/math/percentage`, { value, total, operation });
          setResult(response.data.result.toString() + '%');
        }
        else if (tool.id === 'age-calculator') {
          const birthDate = document.getElementById('birth-date').value;
          const response = await axios.post(`${API}/tools/math/age`, { birth_date: birthDate });
          setResult(`${response.data.years} years, ${response.data.months} months, ${response.data.days} days`);
        }
      }
      
      // SEO Tools
      else if (category === 'SEO') {
        if (tool.id === 'meta-tags') {
          const title = document.getElementById('meta-title').value;
          const description = document.getElementById('meta-description').value;
          const keywords = document.getElementById('meta-keywords').value.split(',');
          const response = await axios.post(`${API}/tools/seo/meta-tags`, { title, description, keywords });
          setResult(response.data.html);
        }
        else if (tool.id === 'open-graph') {
          const title = document.getElementById('og-title').value;
          const description = document.getElementById('og-description').value;
          const imageUrl = document.getElementById('og-image').value;
          const url = document.getElementById('og-url').value;
          const response = await axios.post(`${API}/tools/seo/open-graph?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(imageUrl)}&url=${encodeURIComponent(url)}`);
          setResult(response.data.html);
        }
      }
      
      // Developer Tools
      else if (category === 'Developer') {
        if (tool.id === 'regex-tester') {
          const pattern = document.getElementById('regex-pattern').value;
          const text = document.getElementById('regex-text').value;
          const response = await axios.post(`${API}/tools/dev/regex-test`, { pattern, text });
          setResult(JSON.stringify(response.data, null, 2));
        }
        else if (tool.id === 'diff-checker') {
          const text1 = document.getElementById('diff-text1').value;
          const text2 = document.getElementById('diff-text2').value;
          const response = await axios.post(`${API}/tools/dev/diff`, { text1, text2 });
          setResult(`Total differences: ${response.data.total_differences}\n\n` + JSON.stringify(response.data.differences, null, 2));
        }
        else if (tool.id === 'hash-generator') {
          const text = document.getElementById('hash-text').value;
          const algorithm = document.getElementById('hash-algorithm').value;
          const response = await axios.post(`${API}/tools/dev/hash`, { text, algorithm });
          setResult(response.data.hash);
        }
        else if (tool.id === 'timestamp-converter') {
          const timestamp = document.getElementById('timestamp-value').value;
          const response = await axios.post(`${API}/tools/dev/timestamp`, { 
            timestamp: timestamp ? parseInt(timestamp) : null 
          });
          setResult(JSON.stringify(response.data, null, 2));
        }
      }
      
      // AI Tools
      else if (category === 'AI') {
        if (tool.id === 'ai-text') {
          const text = document.getElementById('ai-text-input').value;
          const operation = document.getElementById('ai-operation').value;
          const response = await axios.post(`${API}/tools/ai/text`, { text, operation });
          setResult(response.data.result);
        }
        else if (tool.id === 'ai-image') {
          const prompt = document.getElementById('ai-image-prompt').value;
          const size = document.getElementById('ai-image-size').value;
          const response = await axios.post(`${API}/tools/ai/image`, { prompt, size });
          setImage(response.data.image_url);
          setResult('Image generated successfully!');
        }
      }
      
    } catch (error) {
      setResult('Error: ' + (error.response?.data?.detail || error.message));
    }
    
    setLoading(false);
  };

  const renderInputs = () => {
    const category = tool.category;
    const toolId = tool.id;
    
    // Converter inputs
    if (category === 'Converters') {
      const units = {
        'length-converter': ['meter', 'kilometer', 'mile', 'yard', 'foot', 'inch'],
        'weight-converter': ['kilogram', 'gram', 'pound', 'ounce'],
        'temperature-converter': ['celsius', 'fahrenheit', 'kelvin'],
        'data-converter': ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte']
      };
      const toolUnits = units[toolId] || units['length-converter'];
      
      return (
        <>
          <div className="tool-option">
            <label>Value:</label>
            <input type="number" id="converter-value" placeholder="Enter value" data-testid="converter-value" />
          </div>
          <div className="tool-option">
            <label>From:</label>
            <select id="from-unit" data-testid="from-unit">
              {toolUnits.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="tool-option">
            <label>To:</label>
            <select id="to-unit" data-testid="to-unit">
              {toolUnits.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </>
      );
    }
    
    // Generator inputs
    if (category === 'Generators') {
      if (toolId === 'username-generator') {
        return (
          <>
            <div className="tool-option">
              <label>Style:</label>
              <select id="username-style" data-testid="username-style">
                <option value="random">Random</option>
                <option value="fantasy">Fantasy</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div className="tool-option">
              <label>Length:</label>
              <input type="number" id="username-length" defaultValue="8" min="4" max="20" data-testid="username-length" />
            </div>
          </>
        );
      }
      if (toolId === 'email-generator') {
        return (
          <>
            <div className="tool-option">
              <label>Name:</label>
              <input type="text" id="email-name" placeholder="john doe" data-testid="email-name" />
            </div>
            <div className="tool-option">
              <label>Domain:</label>
              <input type="text" id="email-domain" defaultValue="example.com" data-testid="email-domain" />
            </div>
          </>
        );
      }
      if (toolId === 'barcode-generator') {
        return (
          <div className="tool-option">
            <label>Data:</label>
            <input type="text" id="barcode-data" placeholder="123456789" defaultValue="123456789" data-testid="barcode-data" />
          </div>
        );
      }
    }
    
    // Math inputs
    if (category === 'Math') {
      if (toolId === 'calculator') {
        return (
          <div className="tool-option">
            <label>Expression:</label>
            <input type="text" id="calc-expression" placeholder="2 + 2 * 3" data-testid="calc-expression" />
          </div>
        );
      }
      if (toolId === 'percentage') {
        return (
          <>
            <div className="tool-option">
              <label>Operation:</label>
              <select id="percent-operation" data-testid="percent-operation">
                <option value="what_percent">What % of total</option>
                <option value="percent_of">Percentage of total</option>
              </select>
            </div>
            <div className="tool-option">
              <label>Value:</label>
              <input type="number" id="percent-value" placeholder="25" data-testid="percent-value" />
            </div>
            <div className="tool-option">
              <label>Total:</label>
              <input type="number" id="percent-total" placeholder="100" data-testid="percent-total" />
            </div>
          </>
        );
      }
      if (toolId === 'age-calculator') {
        return (
          <div className="tool-option">
            <label>Birth Date:</label>
            <input type="date" id="birth-date" data-testid="birth-date" />
          </div>
        );
      }
    }
    
    // SEO inputs
    if (category === 'SEO') {
      if (toolId === 'meta-tags') {
        return (
          <>
            <div className="tool-option">
              <label>Title:</label>
              <input type="text" id="meta-title" placeholder="Page Title" data-testid="meta-title" />
            </div>
            <div className="tool-option">
              <label>Description:</label>
              <textarea id="meta-description" placeholder="Page description" data-testid="meta-description" />
            </div>
            <div className="tool-option">
              <label>Keywords (comma-separated):</label>
              <input type="text" id="meta-keywords" placeholder="web, tools, online" data-testid="meta-keywords" />
            </div>
          </>
        );
      }
      if (toolId === 'open-graph') {
        return (
          <>
            <div className="tool-option">
              <label>Title:</label>
              <input type="text" id="og-title" placeholder="Page Title" data-testid="og-title" />
            </div>
            <div className="tool-option">
              <label>Description:</label>
              <textarea id="og-description" placeholder="Description" data-testid="og-description" />
            </div>
            <div className="tool-option">
              <label>Image URL:</label>
              <input type="text" id="og-image" placeholder="https://..." data-testid="og-image" />
            </div>
            <div className="tool-option">
              <label>URL:</label>
              <input type="text" id="og-url" placeholder="https://..." data-testid="og-url" />
            </div>
          </>
        );
      }
    }
    
    // Developer inputs
    if (category === 'Developer') {
      if (toolId === 'regex-tester') {
        return (
          <>
            <div className="tool-option">
              <label>Regex Pattern:</label>
              <input type="text" id="regex-pattern" placeholder="^[a-z]+$" data-testid="regex-pattern" />
            </div>
            <div className="tool-option">
              <label>Test Text:</label>
              <textarea id="regex-text" placeholder="Enter text to test" data-testid="regex-text" />
            </div>
          </>
        );
      }
      if (toolId === 'diff-checker') {
        return (
          <>
            <div className="tool-option">
              <label>Text 1:</label>
              <textarea id="diff-text1" placeholder="First text" data-testid="diff-text1" />
            </div>
            <div className="tool-option">
              <label>Text 2:</label>
              <textarea id="diff-text2" placeholder="Second text" data-testid="diff-text2" />
            </div>
          </>
        );
      }
      if (toolId === 'hash-generator') {
        return (
          <>
            <div className="tool-option">
              <label>Text:</label>
              <textarea id="hash-text" placeholder="Text to hash" data-testid="hash-text" />
            </div>
            <div className="tool-option">
              <label>Algorithm:</label>
              <select id="hash-algorithm" data-testid="hash-algorithm">
                <option value="md5">MD5</option>
                <option value="sha1">SHA1</option>
                <option value="sha256">SHA256</option>
                <option value="sha512">SHA512</option>
              </select>
            </div>
          </>
        );
      }
      if (toolId === 'timestamp-converter') {
        return (
          <div className="tool-option">
            <label>Unix Timestamp (leave empty for current):</label>
            <input type="number" id="timestamp-value" placeholder="1234567890" data-testid="timestamp-value" />
          </div>
        );
      }
    }
    
    // AI inputs
    if (category === 'AI') {
      if (toolId === 'ai-text') {
        return (
          <>
            <div className="tool-option">
              <label>Operation:</label>
              <select id="ai-operation" data-testid="ai-operation">
                <option value="paraphrase">Paraphrase</option>
                <option value="enhance">Enhance</option>
                <option value="summarize">Summarize</option>
              </select>
            </div>
            <div className="tool-option">
              <label>Text:</label>
              <textarea id="ai-text-input" placeholder="Enter your text" data-testid="ai-text-input" />
            </div>
          </>
        );
      }
      if (toolId === 'ai-image') {
        return (
          <>
            <div className="tool-option">
              <label>Prompt:</label>
              <textarea id="ai-image-prompt" placeholder="Describe the image you want to generate" data-testid="ai-image-prompt" />
            </div>
            <div className="tool-option">
              <label>Size:</label>
              <select id="ai-image-size" data-testid="ai-image-size">
                <option value="1024x1024">1024x1024</option>
                <option value="1024x1792">1024x1792 (Portrait)</option>
                <option value="1792x1024">1792x1024 (Landscape)</option>
              </select>
            </div>
          </>
        );
      }
    }
    
    return null;
  };

  return (
    <div className="tool-content">
      <div className="tool-section">
        <h3>Input</h3>
        {renderInputs()}
        <button 
          className="btn-primary" 
          onClick={handleProcess}
          disabled={loading}
          data-testid="process-button"
        >
          {loading ? 'Processing...' : 'Generate'}
        </button>
      </div>

      {image && (
        <div className="tool-section">
          <h3>Result</h3>
          <div className="qr-result" data-testid="generated-image">
            <img src={image} alt="Generated" style={{maxWidth: '100%'}} />
            <a href={image} download="generated.png" className="btn-secondary" data-testid="download-image">
              Download Image
            </a>
          </div>
        </div>
      )}

      {result && !image && (
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
            data-testid="tool-result"
          />
        </div>
      )}
    </div>
  );
};

export default NewToolsUniversal;
