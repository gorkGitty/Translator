// VoiceTranslation.js
import React, { useState } from 'react';
import { translateText } from '../api';

const VoiceTranslation = () => {
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('fr');

  const handleVoiceTranslation = () => {
    const recognition = new window.SpeechRecognition();
    recognition.lang = fromLanguage;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = async (event) => {
      const speechResult = event.results[0][0].transcript;
      const result = await translateText(fromLanguage, toLanguage, speechResult);
      setTranslatedText(result.translation);
      speakTranslation(result.translation);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  };

  const speakTranslation = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = toLanguage;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Voice Translation</h2>
      <button style={styles.button} onClick={handleVoiceTranslation}>
        Start Voice Translation
      </button>
      {translatedText && <p style={styles.translatedText}>Translated Text: {translatedText}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#F5F5F5',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    margin: '20px',
  },
  title: {
    marginBottom: '20px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#4A90E2',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  translatedText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#333',
  },
};

export default VoiceTranslation;