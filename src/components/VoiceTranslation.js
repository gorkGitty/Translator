// VoiceTranslation.js
import React, { useState, useRef } from 'react';
import { translateText } from '../api';
import theme from '../styles/theme';
import { Mic, Stop, VolumeUp, Language } from '@mui/icons-material';
import languagesData from '../languages.json';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';
import { db } from '../firebase';

const VoiceTranslation = ({ user }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('fr');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Reference for Speech Recognition
  const recognitionRef = useRef(null);

  const languages = Object.entries(languagesData.languages).map(([name, code]) => ({
    code,
    name,
  }));

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return false;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = fromLanguage; // Set the language for recognition

    // Handle recognition results
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update the original text as we get results
      setOriginalText(finalTranscript || interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Recognition error: ${event.error}`);
      handleStopRecording();
    };

    return true;
  };

  const handleStartRecording = async () => {
    setError('');
    setTranslatedText('');
    
    if (!initializeSpeechRecognition()) {
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please try again.');
    }
  };

  const handleStopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      // Only proceed with translation if we have text to translate
      if (originalText.trim()) {
        setIsProcessing(true);
        try {
          // Translate the transcribed text
          const result = await translateText(fromLanguage, toLanguage, originalText.trim());
          setTranslatedText(result.translation);

          // Save to history if user is authenticated
          if (user) {
            await addDoc(collection(db, 'history'), {
              uid: user.uid,
              original: originalText.trim(),
              translated: result.translation,
              fromLanguage,
              toLanguage,
              timestamp: serverTimestamp(),
              type: 'voice'
            });
          }
        } catch (error) {
          console.error('Translation error:', error);
          setError('Translation failed. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const speakTranslation = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = toLanguage;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={styles.container}>
      <div style={styles.translationCard}>
        <h2 style={styles.title}>Voice Translation</h2>

        <div style={styles.languageSelector}>
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
            
            <Language style={styles.languageIcon} />

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
        </div>

        <div style={styles.recordingSection}>
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            style={{
              ...styles.recordButton,
              ...(isRecording && styles.recordingActive),
            }}
            disabled={isProcessing}
          >
            {isRecording ? (
              <>
                <Stop style={styles.buttonIcon} />
                Stop Recording
              </>
            ) : (
              <>
                <Mic style={styles.buttonIcon} />
                Start Recording
              </>
            )}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {isProcessing && <div style={styles.processing}>Processing...</div>}

        {(originalText || translatedText) && (
          <div style={styles.resultsContainer}>
            {originalText && (
              <div style={styles.textBlock}>
                <h3 style={styles.resultTitle}>Original Text</h3>
                <div style={styles.textContent}>{originalText}</div>
              </div>
            )}
            
            {translatedText && (
              <div style={styles.textBlock}>
                <h3 style={styles.resultTitle}>
                  Translation
                  <button
                    onClick={() => speakTranslation(translatedText)}
                    style={styles.speakButton}
                  >
                    <VolumeUp style={styles.speakIcon} />
                  </button>
                </h3>
                <div style={styles.textContent}>{translatedText}</div>
              </div>
            )}
          </div>
        )}
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
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  languageSelector: {
    marginBottom: theme.spacing.xl,
  },
  languageBar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
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
  },
  languageIcon: {
    color: theme.colors.primary,
    fontSize: '24px',
  },
  recordingSection: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  recordButton: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.sizes.base,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  recordingActive: {
    backgroundColor: theme.colors.error,
  },
  buttonIcon: {
    fontSize: '24px',
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
  },
  textBlock: {
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContent: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    lineHeight: '1.5',
  },
  speakButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.colors.primary,
    cursor: 'pointer',
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: `${theme.colors.primary}10`,
    },
  },
  speakIcon: {
    fontSize: '20px',
  },
  error: {
    color: 'red',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  processing: {
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  languageSelector: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  select: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.border}`,
  },
};

export default VoiceTranslation;