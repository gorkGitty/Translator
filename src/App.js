import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Translate from './components/Translate';
import History from './components/History';
import Home from './components/Home';
import VoiceTranslation from './components/VoiceTranslation';
import ImageTranslation from './components/ImageTranslation';
import SignLanguageDetection from './components/SignLanguageDetection';
import { auth } from './firebase';
import NavigationBar from './components/Navbar';

function App() {
  // Authentication state management
  const [user, setUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        {user ? (
          <>
            <NavigationBar onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/translate" element={<Translate user={user} />} />
              <Route path="/history" element={<History user={user} />} />
              <Route path="/voice-translation" element={<VoiceTranslation user={user} />} />
              <Route path="/image-translation" element={<ImageTranslation user={user} />} />
              <Route path="/sign-language" element={<SignLanguageDetection />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <Login onLogin={setUser} />
        )}
      </div>
    </Router>
  );
}

export default App;