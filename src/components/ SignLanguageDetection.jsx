// SignLanguageDetection.js
import React from 'react';

const SignLanguageDetection = () => {
  const handleStartDetection = () => {
    // Code to start webcam and detect sign language goes here
    console.log('Starting sign language detection...');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Language Detection</h2>
      <button style={styles.button} onClick={handleStartDetection}>Start Detection</button>
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
};

export default SignLanguageDetection;