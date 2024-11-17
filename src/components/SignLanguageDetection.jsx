// SignLanguageDetection.js
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const SignLanguageDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [currentLetter, setCurrentLetter] = useState({ letter: '', startTime: null });
  const requestAnimationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const [detectionActive, setDetectionActive] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const wordTimeoutRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(4);
  const [predictionBuffer, setPredictionBuffer] = useState([]);
  const [isCollectingPredictions, setIsCollectingPredictions] = useState(false);
  const collectionTimeRef = useRef(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const IMG_SIZE = 224;
  const LETTER_THRESHOLD_MS = 4000; // 4 seconds threshold

  useEffect(() => {
    if (showDisclaimer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDisclaimer]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              console.log('Video playback started');
              setIsStreaming(true);
            })
            .catch(err => {
              console.error('Error playing video:', err);
              setError('Failed to start video playback');
            });
        };
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Error accessing camera: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
        streamRef.current.removeTrack(track);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Reset the video element
    }
    setIsStreaming(false);
    setDetectionActive(false);
    if (requestAnimationFrameRef.current) {
      cancelAnimationFrame(requestAnimationFrameRef.current);
      requestAnimationFrameRef.current = null;
    }
  };

  const updateDetectedText = (letter, confidence) => {
    if (confidence > 0.7) {
      setPredictionBuffer(prev => [...prev, { letter, confidence }]);
      
      if (!isCollectingPredictions) {
        setIsCollectingPredictions(true);
        setTimeLeft(4);
        
        collectionTimeRef.current = setTimeout(() => {
          processPredictionBuffer();
        }, 4000);
      }
    }
  };

  const processPredictionBuffer = () => {
    if (predictionBuffer.length > 0) {
      // Group predictions by letter
      const letterGroups = predictionBuffer.reduce((acc, { letter, confidence }) => {
        if (!acc[letter]) {
          acc[letter] = [];
        }
        acc[letter].push(confidence);
        return acc;
      }, {});

      // Calculate scores for each letter
      const letterScores = Object.entries(letterGroups).map(([letter, confidences]) => {
        const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
        const frequency = confidences.length / predictionBuffer.length;
        return {
          letter,
          score: avgConfidence * frequency * confidences.length
        };
      });

      // Sort by score and get top prediction
      letterScores.sort((a, b) => b.score - a.score);
      const bestPrediction = letterScores[0];

      // Only accept if we have enough consistent predictions
      if (bestPrediction && bestPrediction.score > 0.3) {
        setCurrentWord(prev => {
          if (prev.slice(-1) !== bestPrediction.letter) {
            return prev + bestPrediction.letter;
          }
          return prev;
        });
      }
    }

    // Reset for next collection period
    setPredictionBuffer([]);
    setIsCollectingPredictions(false);
    
    // Add word to detected text if it's been stable
    if (currentWord.length > 0) {
      setDetectedText(prev => prev + (prev ? ' ' : '') + currentWord);
      setCurrentWord('');
    }
  };

  useEffect(() => {
    let intervalId;
    
    if (isCollectingPredictions) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (collectionTimeRef.current) {
        clearTimeout(collectionTimeRef.current);
      }
    };
  }, [isCollectingPredictions]);

  const toggleDetection = () => {
    if (!detectionActive) {
      setDetectionActive(true);
      startDetection();
    } else {
      setDetectionActive(false);
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    }
  };

  const startDetection = () => {
    const predictFrame = async () => {
      if (videoRef.current?.readyState === 4) {
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        canvasRef.current.width = IMG_SIZE;
        canvasRef.current.height = IMG_SIZE;
        const ctx = canvasRef.current.getContext('2d');

        ctx.drawImage(
          videoRef.current,
          0, 0, videoWidth, videoHeight,
          0, 0, IMG_SIZE, IMG_SIZE
        );

        try {
          let tensor = tf.browser.fromPixels(canvasRef.current)
            .div(255.0)
            .expandDims(0);

          const predictions = model.predict(tensor);
          const predictionArray = predictions.dataSync();
          const maxConfidence = Math.max(...predictionArray);
          const letterIndex = predictionArray.indexOf(maxConfidence);

          setPrediction(String.fromCharCode(65 + letterIndex));
          setConfidence(maxConfidence);
          
          updateDetectedText(String.fromCharCode(65 + letterIndex), maxConfidence);

          tensor.dispose();
          predictions.dispose();
        } catch (err) {
          console.error('Prediction error:', err);
        }
      }
      requestAnimationFrameRef.current = requestAnimationFrame(predictFrame);
    };

    predictFrame();
  };

  // Load model effect remains the same as your original code
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        
        // Use the correct path with basename
        const basename = process.env.PUBLIC_URL || '/Translator';
        const modelPath = `${basename}/models/model_asl/model.json`;
        
        console.log('Attempting to load model from:', modelPath);
        
        // Debug: Check if we can access the model.json file
        const modelResponse = await fetch(modelPath);
        console.log('Model response status:', modelResponse.status);
        console.log('Model response headers:', Object.fromEntries(modelResponse.headers));
        
        if (!modelResponse.ok) {
          throw new Error(`HTTP error! status: ${modelResponse.status}`);
        }
        
        // Debug: Check the content of the response
        const responseText = await modelResponse.text();
        console.log('First 100 characters of response:', responseText.substring(0, 100));
        
        // Try parsing the JSON
        const modelJSON = JSON.parse(responseText);
        console.log('Model metadata loaded:', {
          format: modelJSON.format,
          generatedBy: modelJSON.generatedBy
        });

        // Load the actual model
        const loadedModel = await tf.loadGraphModel(modelPath, {
          onProgress: (fraction) => {
            console.log(`Loading model: ${(fraction * 100).toFixed(1)}%`);
          }
        });

        setModel(loadedModel);
        setIsLoading(false);
        console.log('Model loaded successfully');
        
        try {
          await startCamera();
          console.log('Camera initialized successfully');
        } catch (err) {
          console.error('Failed to initialize camera:', err);
          setError('Failed to initialize camera: ' + err.message);
        }
        
      } catch (err) {
        console.error('Detailed loading error:', err);
        // More detailed error message
        setError(`Failed to load ASL model: ${err.message}\n${err.stack}`);
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopCamera();
      if (model) {
        model.dispose();
      }
      tf.engine().reset();
    };
  }, []);

  // Add cleanup for the collection timer
  useEffect(() => {
    return () => {
      if (collectionTimeRef.current) {
        clearTimeout(collectionTimeRef.current);
      }
    };
  }, []);

  const handleSpaceDetection = () => {
    // Add a button to manually add spaces
    setDetectedText(prev => prev + (prev ? ' ' : ''));
    setCurrentWord('');
    setPredictionBuffer([]);
    setIsCollectingPredictions(false);
    if (collectionTimeRef.current) {
      clearTimeout(collectionTimeRef.current);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>GlobeTalk Sign Language</h1>
        <span style={styles.betaBadge}>BETA</span>
      </div>
      {showDisclaimer && (
        <div style={styles.disclaimerOverlay}>
          <div style={styles.disclaimerModal}>
            <h3 style={styles.disclaimerTitle}>Beta Feature Disclaimer</h3>
            <p style={styles.disclaimerText}>
              This Sign Language Detection feature is currently in beta testing. The model is still being improved and may not generate the most accurate results. Please be aware that:
            </p>
            <ul style={styles.disclaimerList}>
              <li>Translations may not be 100% accurate</li>
              <li>The model works best in good lighting conditions</li>
              <li>Some signs may not be recognized correctly</li>
              <li>Performance may vary across different devices</li>
            </ul>
            <button 
              onClick={() => setShowDisclaimer(false)}
              style={styles.disclaimerButton}
            >
              I Understand
            </button>
          </div>
        </div>
      )}
      {isLoading && <div style={styles.loading}>Loading model...</div>}
      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.videoContainer}>
        <video
          ref={videoRef}
          style={styles.video}
          autoPlay
          playsInline
          muted
        />
        {!isStreaming && (
          <div style={styles.placeholder}>
            Waiting for camera...
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={styles.canvas}
        />
      </div>

      <div style={styles.controls}>
        <button 
          onClick={isStreaming ? stopCamera : startCamera}
          style={{
            ...styles.controlButton,
            backgroundColor: '#2196F3' // Blue color for stream button
          }}
        >
          {isStreaming ? 'Stop Stream' : 'Start Stream'}
        </button>
        
        {isStreaming && (
          <button 
            onClick={toggleDetection}
            style={{
              ...styles.controlButton,
              backgroundColor: detectionActive ? '#ff4444' : '#4CAF50'
            }}
          >
            {detectionActive ? 'Stop Detection' : 'Start Detection'}
          </button>
        )}
        
        {detectionActive && (
          <button
            onClick={handleSpaceDetection}
            style={{
              ...styles.controlButton,
              backgroundColor: '#FFA500'
            }}
          >
            Add Space
          </button>
        )}
      </div>

      {detectionActive && (
        <div style={styles.predictionContainer}>
          <div style={styles.predictionBox}>
            <div style={styles.predictionHeader}>Current Word: {currentWord}</div>
            <div style={styles.predictionInfo}>
              <div>Detected Letter: {prediction || '-'}</div>
              <div>Confidence: {confidence ? `${(confidence * 100).toFixed(1)}%` : '0%'}</div>
              <div>Collection Status: {isCollectingPredictions ? 'Collecting' : 'Waiting'}</div>
              <div>Samples: {predictionBuffer.length}</div>
              <div>Time: {timeLeft}s</div>
              <div>
                Stability: {(predictionBuffer.length > 0 
                  ? (new Set(predictionBuffer.map(p => p.letter)).size / predictionBuffer.length) 
                  : 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {detectedText && (
        <div style={styles.detectedText}>
          <h3>Detected Text:</h3>
          <p>{detectedText}</p>
        </div>
      )}
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
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  title: {
    marginBottom: '20px',
  },
  betaBadge: {
    backgroundColor: '#FF4081',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 2px 4px rgba(255, 64, 129, 0.2)',
  },
  videoContainer: {
    width: '100%',
    maxWidth: '640px',
    height: '480px',
    margin: '20px auto',
    backgroundColor: '#000',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)',
    backgroundColor: '#000',
  },
  placeholder: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
    fontSize: '20px',
    textAlign: 'center',
    zIndex: 1,
  },
  prediction: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
  },
  confidence: {
    fontSize: '18px',
    marginTop: '10px',
    color: '#666',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '20px',
  },
  controlButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  canvas: {
    display: 'none',
  },
  timer: {
    fontSize: '16px',
    marginTop: '8px',
    color: '#666',
    fontWeight: 'normal',
  },
  bufferInfo: {
    fontSize: '14px',
    marginTop: '8px',
    color: '#666',
    fontStyle: 'italic'
  },
  predictionInfo: {
    fontSize: '16px',
    fontWeight: 'normal',
    marginTop: '10px',
    padding: '10px',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: '4px',
  },
  stabilityIndicator: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
    fontStyle: 'italic'
  },
  predictionContainer: {
    width: '100%',
    maxWidth: '640px',
    margin: '20px auto',
    minHeight: '200px', // Fixed height to prevent layout shifts
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  predictionBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  predictionHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  predictionInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    fontSize: '16px',
    '& > div': {
      padding: '8px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
    }
  },
  disclaimerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  disclaimerModal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  disclaimerTitle: {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#333',
  },
  disclaimerText: {
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '16px',
    color: '#666',
  },
  disclaimerList: {
    marginBottom: '24px',
    paddingLeft: '24px',
    color: '#666',
    '& li': {
      marginBottom: '8px',
    },
  },
  disclaimerButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#1976D2',
    },
  },
};

const MemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState({ numTensors: 0, numBytes: 0 });

  useEffect(() => {
    const updateMemoryInfo = () => {
      const info = tf.memory();
      setMemoryInfo({
        numTensors: info.numTensors,
        numBytes: (info.numBytes / (1024 * 1024)).toFixed(2)
      });
    };

    const intervalId = setInterval(updateMemoryInfo, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px' }}>
      Tensors: {memoryInfo.numTensors}<br/>
      Memory: {memoryInfo.numBytes} MB
    </div>
  );
};

export default SignLanguageDetection;