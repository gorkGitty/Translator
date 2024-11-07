import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Translate from './components/Translate';
import History from './components/History';
import Home from './components/Home';
import VoiceTranslation from './components/VoiceTranslation'; // Importing new components
import ImageTranslation from './components/ImageTranslation';
import SignLanguageDetection from './components/ SignLanguageDetection';
import { auth } from './firebase';
import NavigationBar from './components/Navbar'; // Ensure this import is correct

function App() {
  const [user, setUser] = useState(null);

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
    <Router>
      <div className="App">
        {user ? (
          <>
            <NavigationBar />
            <button onClick={handleLogout}>Logout</button>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/translate" element={<Translate user={user} />} />
              <Route path="/history" element={<History user={user} />} />
              <Route path="/voice-translation" element={<VoiceTranslation />} /> {/* New route for voice translation */}
              <Route path="/image-translation" element={<ImageTranslation />} /> {/* New route for image translation */}
              <Route path="/sign-language" element={<SignLanguageDetection />} /> {/* New route for sign language detection */}
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