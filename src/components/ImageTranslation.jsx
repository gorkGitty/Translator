// ImageTranslation.js
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { translateText } from '../api';
import theme from '../styles/theme';
import { CloudUpload, Translate } from '@mui/icons-material';
import languagesData from '../languages.json';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ImageTranslation = ({ user }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [toLanguage, setToLanguage] = useState('fr'); // Default to French

  const languages = Object.entries(languagesData.languages).map(([name, code]) => ({
    code,
    name,
  }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleTranslateImage = async () => {
    if (!image || !user) {
      console.error('No image selected or user not authenticated');
      return;
    }

    setLoading(true);
    try {
      const result = await Tesseract.recognize(image, 'eng');
      const extractedText = result.data.text;
      const translation = await translateText('en', toLanguage, extractedText);
      setTranslatedText(translation.translation);

      await addDoc(collection(db, 'history'), {
        uid: user.uid,
        original: extractedText,
        translated: translation.translation,
        fromLanguage: 'en',
        toLanguage,
        timestamp: serverTimestamp(),
        type: 'image'
      });
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>GlobeTalk Image Translation</h1>
        
        <div style={styles.languageSelector}>
          <label style={styles.label}>Translate to:</label>
          <select 
            value={toLanguage} 
            onChange={(e) => setToLanguage(e.target.value)}
            style={styles.select}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.uploadSection}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
            id="image-upload"
          />
          <label htmlFor="image-upload" style={styles.uploadLabel}>
            <CloudUpload style={styles.uploadIcon} />
            <span>Choose an image</span>
          </label>
        </div>

        {previewUrl && (
          <div style={styles.previewContainer}>
            <img src={previewUrl} alt="Preview" style={styles.preview} />
          </div>
        )}

        <button
          style={styles.translateButton}
          onClick={handleTranslateImage}
          disabled={!image || loading}
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
              <Translate style={styles.buttonIcon} />
              Translate Image
            </>
          )}
        </button>

        {translatedText && (
          <div style={styles.resultContainer}>
            <h3 style={styles.resultTitle}>Translation Result</h3>
            <div style={styles.translatedText}>{translatedText}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: theme.spacing.xl,
    maxWidth: '800px',
    margin: '0 auto',
    animation: 'fadeIn 0.5s ease forwards',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    padding: theme.spacing.xl,
    border: `1px solid ${theme.colors.border}`,
  },
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  languageSelector: {
    marginBottom: theme.spacing.xl,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  select: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface,
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    '&:hover': {
      borderColor: theme.colors.primary,
    },
  },
  uploadSection: {
    marginBottom: theme.spacing.xl,
    animation: 'slideUp 0.5s ease forwards',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    border: `2px dashed ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}05`,
    },
  },
  uploadIcon: {
    fontSize: '48px',
    color: theme.colors.primary,
  },
  previewContainer: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    border: `1px solid ${theme.colors.border}`,
  },
  preview: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  translateButton: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.sizes.base,
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.colors.primary + 'dd',
    },
    '&:disabled': {
      backgroundColor: theme.colors.secondary,
      cursor: 'not-allowed',
    },
  },
  buttonIcon: {
    fontSize: '20px',
  },
  resultContainer: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
  },
  resultTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  translatedText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    lineHeight: '1.5',
  },
  imagePreview: {
    animation: 'scaleIn 0.5s ease forwards',
    animationDelay: '0.2s',
  }
};

export default ImageTranslation;