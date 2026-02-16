# 🧰 ToolBox - All-in-One Developer Utility Platform

A modern, full-stack web application providing 40+ essential developer tools in one place. From text manipulation and color conversion to AI-powered content generation, ToolBox streamlines your workflow with a beautiful, responsive interface.

---

## ✨ Key Features

- **🎨 Beautiful UI/UX** - Modern dark/light theme with smooth transitions and responsive design
- **⚡ Fast & Efficient** - Built with FastAPI backend and React frontend for optimal performance
- **🔧 40+ Tools** - Comprehensive collection spanning 10+ categories
- **🤖 AI-Powered** - Integrated AI tools for text enhancement and image generation
- **💾 No Data Storage** - All processing happens in real-time, your data stays private
- **📱 Mobile-Friendly** - Fully responsive design works on all devices
- **🎯 Copy-Paste Ready** - Quick actions for instant results
- **🔒 Secure** - No tracking, no ads, open source

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icon set
- **Axios** - HTTP client for API calls

### Backend
- **FastAPI** - High-performance Python web framework
- **Uvicorn** - Lightning-fast ASGI server
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Pillow** - Image processing
- **QRCode & Barcode** - Code generation libraries
- **OpenAI API** - AI-powered features (optional)

### Database
- **MongoDB** - NoSQL database for future features

### Deployment
- **Render** - Cloud platform (configured)

---

## 📁 Folder Structure

```
Tool-Box/
│
├── backend/                    # Python/FastAPI Backend
│   ├── server.py              # Main API server with all endpoints
│   ├── server_backup.py       # Backup of server configuration
│   ├── requirements.txt       # Python dependencies
│   └── __pycache__/           # Python compiled files
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html         # Entry HTML file
│   │
│   ├── src/
│   │   ├── components/        # React Components
│   │   │   ├── Sidebar.js     # Navigation sidebar
│   │   │   ├── ToolCard.js    # Tool display card
│   │   │   ├── ToolPanel.js   # Tool interaction panel
│   │   │   ├── tools/         # Tool implementations
│   │   │   │   ├── AllNewTools.js
│   │   │   │   ├── CodeTools.js
│   │   │   │   ├── ColorTools.js
│   │   │   │   ├── CSSTools.js
│   │   │   │   ├── MiscTools.js
│   │   │   │   └── TextTools.js
│   │   │   └── ui/            # shadcn/ui components
│   │   │
│   │   ├── contexts/
│   │   │   └── ThemeContext.js # Dark/Light theme management
│   │   │
│   │   ├── data/
│   │   │   └── toolsData.js   # Tool definitions & metadata
│   │   │
│   │   ├── pages/
│   │   │   └── Dashboard.js   # Main dashboard page
│   │   │
│   │   ├── App.js             # Root component
│   │   └── index.js           # Application entry point
│   │
│   ├── package.json           # Node.js dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── craco.config.js        # Create React App override
│   └── components.json        # shadcn/ui configuration
│
├── tests/                      # Test files
├── test_reports/              # Test execution reports
├── build.sh                   # Build script for deployment
├── render.yaml                # Render.com deployment config
├── start_frontend.bat         # Windows frontend launcher
└── README.md                  # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.10 or higher)
- **MongoDB** (optional, for future features)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/noobremon/Tool-Box.git
cd Tool-Box
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

---

## ⚙️ Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Configuration (optional)
MONGO_URL=mongodb://localhost:27017
DB_NAME=toolbox_db

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# AI Features (optional - only if using AI tools)
EMERGENT_LLM_KEY=your_openai_api_key_here
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8000

# WebSocket Port (for dev server)
WDS_SOCKET_PORT=3000
```

> **Note:** AI tools require an OpenAI API key. Other tools work without any API keys.

---

## 🏃 Running Locally

### Development Mode

#### Terminal 1 - Start Backend:

```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`  
API Documentation: `http://localhost:8000/docs`

#### Terminal 2 - Start Frontend:

```bash
cd frontend
npm start
```

Frontend will be available at: `http://localhost:3000`

#### Windows Quick Start:

```bash
# Start frontend (from root directory)
start_frontend.bat

# Start backend manually in another terminal
cd backend
python -m uvicorn server:app --reload
```

---

## 🏗️ Build & Deployment

### Production Build

Use the provided build script:

```bash
chmod +x build.sh
./build.sh
```

This script will:
1. Build the React frontend (`npm run build`)
2. Install backend dependencies
3. Prepare production-ready files

### Manual Build

#### Frontend:

```bash
cd frontend
npm run build
```

Production build will be in `frontend/build/`

#### Backend:

```bash
cd backend
pip install -r requirements.txt
```

### Deployment to Render

This project is configured for Render deployment via `render.yaml`:

1. **Push to GitHub**
2. **Connect Render to your repository**
3. **Add environment variables** in Render dashboard:
   - `MONGO_URL`
   - `DB_NAME`
   - `EMERGENT_LLM_KEY` (optional)
   - `CORS_ORIGINS`

The app will auto-deploy on each push to main branch.

### Manual Production Deployment

```bash
# Start backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4

# Serve frontend (use a static file server)
cd frontend/build
npx serve -s . -p 3000
```

---

## 🔌 API Endpoints

### Base URL: `/api`

#### Text Tools
- `POST /api/tools/text/convert` - Convert text case
- `POST /api/tools/text/wordcount` - Count words/characters
- `POST /api/tools/text/lorem` - Generate lorem ipsum
- `POST /api/tools/text/whitespace` - Remove extra whitespace
- `POST /api/tools/text/base64` - Base64 encode/decode
- `POST /api/tools/text/url-encode` - URL encode/decode

#### Color Tools
- `POST /api/tools/color/convert` - Convert color formats
- `POST /api/tools/color/palette` - Generate color palettes
- `POST /api/tools/color/shades` - Generate color shades

#### CSS Tools
- `POST /api/tools/css/gradient` - Generate gradient CSS
- `POST /api/tools/css/box-shadow` - Generate box shadow CSS
- `POST /api/tools/css/border-radius` - Generate border radius CSS
- `POST /api/tools/css/glassmorphism` - Generate glassmorphism CSS

#### Misc Tools
- `POST /api/tools/misc/qrcode` - Generate QR code
- `POST /api/tools/misc/password` - Generate secure password
- `POST /api/tools/misc/shuffle` - Shuffle list items
- `GET /api/tools/misc/uuid` - Generate UUID

#### Code Tools
- `POST /api/tools/code/json-format` - Format JSON

#### Unit Converters
- `POST /api/tools/convert/units` - Convert units (length, weight, temp, data)

#### Generators
- `POST /api/tools/generate/username` - Generate username
- `POST /api/tools/generate/email` - Generate email
- `POST /api/tools/generate/barcode` - Generate barcode image

#### Math Tools
- `POST /api/tools/math/calculate` - Evaluate expression
- `POST /api/tools/math/percentage` - Calculate percentage
- `POST /api/tools/math/age` - Calculate age from birthdate

#### SEO Tools
- `POST /api/tools/seo/meta-tags` - Generate meta tags
- `POST /api/tools/seo/open-graph` - Generate Open Graph tags

#### Developer Tools
- `POST /api/tools/dev/regex-test` - Test regular expressions
- `POST /api/tools/dev/diff` - Compare text differences
- `POST /api/tools/dev/hash` - Generate hash (MD5, SHA1, SHA256, SHA512)
- `POST /api/tools/dev/timestamp` - Convert timestamps

#### AI Tools (requires API key)
- `POST /api/tools/ai/text` - AI text operations (paraphrase, enhance, summarize)
- `POST /api/tools/ai/image` - Generate AI images from text

### API Documentation

Interactive API docs available at: `http://localhost:8000/docs`

---

## 💡 Usage Examples

### Example 1: Convert Text Case

```javascript
// Frontend request
const response = await axios.post('/api/tools/text/convert', {
  text: "hello world",
  case_type: "title"
});
console.log(response.data.result); // "Hello World"
```

### Example 2: Generate QR Code

```javascript
const response = await axios.post('/api/tools/misc/qrcode', {
  text: "https://github.com/noobremon/Tool-Box",
  size: 300
});
// Returns base64 image: data:image/png;base64,...
```

### Example 3: Color Conversion

```javascript
const response = await axios.post('/api/tools/color/convert', {
  color: "#FF5733",
  from_format: "hex",
  to_format: "rgb"
});
console.log(response.data.result); // "rgb(255, 87, 51)"
```

### Example 4: Generate Password

```javascript
const response = await axios.post('/api/tools/misc/password', {
  length: 16,
  include_uppercase: true,
  include_lowercase: true,
  include_numbers: true,
  include_symbols: true
});
console.log(response.data.password); // "aB3$xR9@mK2#pL5&"
```

---

## 🏗️ Architecture & Component Flow

### System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser   │ ◄────► │ React Frontend│ ◄────► │FastAPI Backend│
│             │  HTTPS  │   (Port 3000) │   API  │  (Port 8000) │
└─────────────┘         └──────────────┘         └──────────────┘
                              │                         │
                              │                         │
                              ▼                         ▼
                        ┌──────────┐            ┌──────────┐
                        │ Tailwind │            │ MongoDB  │
                        │ shadcn/ui│            │(Optional)│
                        └──────────┘            └──────────┘
                                                      │
                                                      ▼
                                               ┌─────────────┐
                                               │  AI APIs    │
                                               │ (Optional)  │
                                               └─────────────┘
```

### Component Flow

```
Dashboard.js (Main Page)
    │
    ├── Sidebar.js (Category Navigation)
    │   └── Tool Categories (Text, Color, CSS, etc.)
    │
    ├── Search Bar (Filter Tools)
    │
    ├── Theme Toggle (Dark/Light Mode)
    │
    └── Tool Cards Grid
        └── ToolCard.js (Individual Tool Card)
            └── Click → Opens ToolPanel.js
                └── Tool-specific Component
                    └── API Call → Backend
                        └── Returns Result
```

### Major Components

1. **Dashboard.js** - Main container, manages state and routing
2. **Sidebar.js** - Category filter with responsive mobile view
3. **ToolCard.js** - Displays tool preview in grid layout
4. **ToolPanel.js** - Full-screen tool interface with inputs/outputs
5. **ThemeContext.js** - Global theme state management
6. **toolsData.js** - Centralized tool definitions and metadata

### Data Flow

1. User selects a category → Updates `selectedCategory` state
2. Tools filtered based on category → Renders `ToolCard` components
3. User clicks tool → Opens `ToolPanel` with selected tool
4. User inputs data → Component validates input
5. Submit action → Axios POST request to backend API
6. Backend processes → Returns JSON response
7. Frontend displays result → User can copy/download

---

## 📸 Screenshots

> **Coming Soon:** Add screenshots of the application here

### Dashboard View
<!-- ![Dashboard](screenshots/dashboard.png) -->

### Tool Interface
<!-- ![Tool Panel](screenshots/tool-panel.png) -->

### Dark Mode
<!-- ![Dark Mode](screenshots/dark-mode.png) -->

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m "Add: amazing feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update documentation for new features
- Test your changes locally before submitting
- One feature per pull request

### Adding a New Tool

1. Add tool definition to `frontend/src/data/toolsData.js`
2. Create tool component in `frontend/src/components/tools/`
3. Add backend endpoint in `backend/server.py`
4. Update API documentation
5. Test end-to-end functionality

### Code Style

- **Frontend:** Follow React best practices, use functional components
- **Backend:** Follow PEP 8 Python style guide
- **Commits:** Use conventional commits format

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 noobremon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🔮 Future Improvements

### Planned Features

- [ ] **User Accounts** - Save favorite tools and history
- [ ] **Collaboration** - Share tool outputs via unique URLs
- [ ] **More Tools** - Image manipulation, video tools, audio converters
- [ ] **Offline Mode** - PWA support for offline usage
- [ ] **API Rate Limiting** - Prevent abuse with rate limits
- [ ] **Batch Processing** - Process multiple items at once
- [ ] **Export Options** - PDF, CSV, JSON export for results
- [ ] **Keyboard Shortcuts** - Power user shortcuts
- [ ] **Tool Presets** - Save commonly used configurations
- [ ] **Mobile Apps** - Native iOS and Android apps

### Technical Improvements

- [ ] Add comprehensive unit and integration tests
- [ ] Implement Redis caching for frequently used conversions
- [ ] Add WebSocket support for real-time collaborative tools
- [ ] Optimize bundle size and lazy load components
- [ ] Add error tracking with Sentry
- [ ] Implement CI/CD pipeline
- [ ] Add Docker containerization
- [ ] Set up monitoring and analytics
- [ ] Create admin dashboard for analytics
- [ ] Add API versioning

### Community Requests

Have a feature request? [Open an issue](https://github.com/noobremon/Tool-Box/issues) on GitHub!

---

## 📞 Support & Contact

- **GitHub Issues:** [Report bugs or request features](https://github.com/noobremon/Tool-Box/issues)
- **Discussions:** [Join the conversation](https://github.com/noobremon/Tool-Box/discussions)
- **Email:** noobremon@example.com

---

## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful component library
- **FastAPI** - For the excellent Python framework
- **React Community** - For amazing tools and libraries
- **All Contributors** - Thank you for your contributions!

---

## ⭐ Star History

If you find this project useful, please consider giving it a star ⭐️ on GitHub!

---

<div align="center">

**Built with ❤️ by [noobremon](https://github.com/noobremon)**

[⬆ Back to Top](#-toolbox---all-in-one-developer-utility-platform)

</div>
