import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Translate, Mic, Image, SignLanguage } from '@mui/icons-material';
import theme from '../styles/theme.js';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Text Translation',
      description: 'Translate text between multiple languages instantly',
      icon: <Translate className="feature-icon" />,
      path: '/translate'
    },
    {
      title: 'Voice Translation',
      description: 'Speak and get real-time translations',
      icon: <Mic className="feature-icon" />,
      path: '/voice-translation'
    },
    {
      title: 'Image Translation',
      description: 'Extract and translate text from images',
      icon: <Image className="feature-icon" />,
      path: '/image-translation'
    },
    {
      title: 'Sign Language',
      description: 'Translate sign language in real-time',
      icon: <SignLanguage className="feature-icon" />,
      path: '/sign-language'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to Universal Translator</h1>
        <p style={styles.subtitle}>
          Break language barriers with our comprehensive translation tools
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="feature-card"
            onClick={() => navigate(feature.path)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {feature.icon}
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: theme.spacing.xl,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    padding: `${theme.spacing.xxl} 0`,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    maxWidth: '600px',
    margin: '0 auto',
  },
};

export default Home;