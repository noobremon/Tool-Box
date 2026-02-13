import React, { useState, useMemo, useEffect } from 'react';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import ToolCard from '../components/ToolCard';
import ToolPanel from '../components/ToolPanel';
import { toolsData } from '../data/toolsData';

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close tool panel when category changes
  useEffect(() => {
    setSelectedTool(null);
  }, [selectedCategory]);

  const filteredTools = useMemo(() => {
    let tools = [];
    
    if (selectedCategory === 'all') {
      Object.values(toolsData).forEach(category => {
        tools = [...tools, ...category.tools];
      });
    } else {
      tools = toolsData[selectedCategory]?.tools || [];
    }

    if (searchQuery) {
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return tools;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="mobile-menu-toggle"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="logo" data-testid="app-logo">
              <span className="gradient-text">ToolBox</span>
            </h1>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              data-testid="search-input"
            />
          </div>

          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            data-testid="theme-toggle"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="content-area">
          {selectedTool ? (
            <ToolPanel
              tool={selectedTool}
              onClose={() => setSelectedTool(null)}
            />
          ) : (
            <>
              <div className="content-header">
                <h2 data-testid="category-title">
                  {selectedCategory === 'all' 
                    ? 'All Tools' 
                    : toolsData[selectedCategory]?.name || 'Tools'}
                </h2>
                <p className="text-secondary">
                  {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="tools-grid">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onClick={() => setSelectedTool(tool)}
                  />
                ))}
              </div>

              {filteredTools.length === 0 && (
                <div className="empty-state" data-testid="empty-state">
                  <p>No tools found matching your search.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;