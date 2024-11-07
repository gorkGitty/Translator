import React, { useState } from 'react';
import { translateText } from '../api';
import languagesData from '../languages.json';
import VoiceIcon from '@mui/icons-material/RecordVoiceOver'; // Example icon for voice translation
import ImageIcon from '@mui/icons-material/Photo'; // Example icon for image translation
import SignLanguageIcon from '@mui/icons-material/Accessibility'; // Example icon for sign language detection
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Translate = ({ user }) => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('fr');

  const languages = Object.entries(languagesData.languages).map(([name, code]) => ({
    code,
    name,
  }));

  const handleTranslate = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const result = await translateText(fromLanguage, toLanguage, text);
      setTranslatedText(result.translation);
      
      // Save to history using the correct Firestore syntax
      const docRef = await addDoc(collection(db, 'history'), {
        uid: user.uid,
        original: text,
        translated: result.translation,
        fromLanguage,
        toLanguage,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Translate Text</h1>
      <textarea
        style={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <div style={styles.languageSelectors}>
        <label>
          From:
          <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          To:
          <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button style={styles.button} onClick={handleTranslate}>Translate</button>
      {translatedText && (
        <div style={styles.translatedTextContainer}>
          <p style={styles.translatedText}>Translated Text: {translatedText}</p>
        </div>
      )}
      <div style={styles.featuresContainer}>
        <h2 style={styles.featuresTitle}>Explore More Features</h2>
        <div style={styles.featureItem}>
          <VoiceIcon style={styles.icon} />
          <span>Voice Translation</span>
        </div>
        <div style={styles.featureItem}>
          <ImageIcon style={styles.icon} />
          <span>Image Translation</span>
        </div>
        <div style={styles.featureItem}>
          <SignLanguageIcon style={styles.icon} />
          <span>Sign Language Detection</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#F5F5F5',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    fontSize: '16px',
  },
  languageSelectors: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4A90E2',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  translatedTextContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#ffffff',
  },
  translatedText: {
    fontSize: '18px',
    color: '#333',
  },
  featuresContainer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  featuresTitle: {
    marginBottom: '15px',
    color: '#333',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px 0',
    fontSize: '18px',
    color: '#4A90E2',
  },
  icon: {
    marginRight: '8px',
    fontSize: '30px', // Adjust icon size
  },
};

export default Translate;