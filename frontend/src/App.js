import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import CleaningOptions from './components/CleaningOptions';
import DataVisualization from './components/DataVisualization';
import DataPreview from './components/DataPreview';
import Login from './components/Login';
import LLMChat from './components/LLMChat';
import Profile from './components/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [sessionId, setSessionId] = useState(null);
  const [dataInfo, setDataInfo] = useState(null);
  const [cleanedData, setCleanedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Persistence logic
  React.useEffect(() => {
    const savedUser = getCookie('idcas_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Failed to parse saved user cookie");
      }
    }
  }, []);

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (JSON.stringify(value) || "") + expires + "; path=/";
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const eraseCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCookie('idcas_user', userData, 7);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setSessionId(null);
    setDataInfo(null);
    setCleanedData(null);
    setActiveTab('dashboard');
    eraseCookie('idcas_user');
  };

  const handleFileUpload = (info) => {
    setSessionId(info.session_id);
    setDataInfo(info);
    setCleanedData(null);
  };

  const handleDataCleaned = (info) => {
    setDataInfo(info);
    setCleanedData(info);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeTab === 'profile') {
      return <Profile user={user} />;
    }

    return (
      <>
        {!sessionId ? (
          <div className="dashboard-section section-fade-in">
            <header className="page-header">
              <h1>Data Cleaning Dashboard</h1>
              <p>Upload your CSV or PDF file and clean your data with ease</p>
            </header>
            <FileUpload onUpload={handleFileUpload} loading={loading} setLoading={setLoading} />
          </div>
        ) : (
          <div className="dashboard-container section-fade-in">
            <div className="dashboard-section glass-card" style={{ padding: '30px' }}>
              <div className="section-title">Data Preview</div>
              <DataPreview dataInfo={dataInfo} />
            </div>

            <div className="dashboard-section glass-card" style={{ padding: '30px' }}>
              <div className="section-title">Cleaning Options</div>
              <CleaningOptions
                sessionId={sessionId}
                columns={dataInfo?.columns || []}
                onClean={handleDataCleaned}
                loading={loading}
                setLoading={setLoading}
              />
            </div>

            <div className="dashboard-section glass-card" style={{ padding: '30px' }}>
              <div className="section-title">
                Visualizations {cleanedData ? '(Cleaned Data)' : '(Raw Data)'}
              </div>
              <DataVisualization sessionId={sessionId} dataInfo={dataInfo} />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="App">
      <aside className="App-sidebar">
        <div className="App-logo">IDCAS</div>

        <nav className="nav-links">
          <div
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span>Dashboard</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Profile</span>
          </div>

          <div className="nav-divider"></div>

          <div className="nav-item nav-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Logout</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-brief">
            <div className="avatar-circle">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-name-small">
              {user?.name || 'User'}
            </div>
          </div>
        </div>
      </aside>

      <main className="App-main">
        {renderContent()}
      </main>

      {sessionId && activeTab === 'dashboard' && (
        <>
          <button
            className={`chat-toggle-btn ${isChatOpen ? 'hidden' : ''}`}
            onClick={() => setIsChatOpen(true)}
            title="Ask AI Assistant"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </button>

          {isChatOpen && (
            <LLMChat
              sessionId={sessionId}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;

