// ImageTranslation.js
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { translateText } from '../api';

const ImageTranslation = () => {
  const [image, setImage] = useState(null);
  const [translatedText, setTranslatedText] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTranslateImage = async () => {
    if (image) {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (info) => console.log(info),
      });
      const extractedText = result.data.text;

      const translation = await translateText('en', 'fr', extractedText);
      setTranslatedText(translation.translation);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Image Translation</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button style={styles.button} onClick={handleTranslateImage}>Translate Image</button>
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

export default ImageTranslation;