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
import Signup from './components/Signup';

function App() {
  // Authentication state management
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState('login'); // 'login' or 'signup'

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

  const toggleAuthForm = (form) => {
    setAuthForm(form);
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        {user ? (
          <>
            <NavigationBar onLogout={handleLogout} isGuest={user.isAnonymous} />
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
          authForm === 'login' ? (
            <Login onLogin={setUser} onToggleForm={toggleAuthForm} />
          ) : (
            <Signup onSignup={setUser} onToggleForm={toggleAuthForm} />
          )
        )}
      </div>
    </Router>
  );
}

export default App;