import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { translateText } from '../api';
import languagesData from '../languages.json';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import theme from '../styles/theme';

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
      <div style={styles.translationCard}>
        <div style={styles.languageBar}>
          <select 
            value={fromLanguage} 
            onChange={(e) => setFromLanguage(e.target.value)}
            style={styles.select}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={() => {
              setFromLanguage(toLanguage);
              setToLanguage(fromLanguage);
            }}
            style={styles.swapButton}
          >
            <SwapHorizIcon />
          </button>

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

        <div style={styles.textareaContainer}>
          <textarea
            style={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate"
          />
          <div style={styles.divider} />
          <div style={styles.translatedContent}>
            {translatedText || 'Translation will appear here'}
          </div>
        </div>

        <button 
          style={styles.translateButton} 
          onClick={handleTranslate}
        >
          Translate
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: theme.spacing.xl,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  translationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    padding: theme.spacing.xl,
    border: `1px solid ${theme.colors.border}`,
  },
  languageBar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
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
  swapButton: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    backgroundColor: theme.colors.surface,
    color: theme.colors.primary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: theme.colors.surfaceHover,
    },
  },
  textareaContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1px 1fr',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    minHeight: '300px',
  },
  textarea: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    fontSize: theme.typography.sizes.base,
    lineHeight: '1.5',
    resize: 'none',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    '&:focus': {
      borderColor: theme.colors.primary,
    },
  },
  divider: {
    backgroundColor: theme.colors.border,
  },
  translatedContent: {
    padding: theme.spacing.lg,
    fontSize: theme.typography.sizes.base,
    lineHeight: '1.5',
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
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
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: theme.colors.primary + 'ee',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 0,
      height: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.3s ease, height 0.3s ease',
    },
    '&:active::after': {
      width: '200px',
      height: '200px',
    }
  },
};

export default Translate;