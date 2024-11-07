import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Translate, Mic, Image, SignLanguage } from '@mui/icons-material';
import theme from '../styles/theme';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Text Translation',
      description: 'Translate text between multiple languages instantly',
      icon: <Translate style={styles.featureIcon} />,
      path: '/translate'
    },
    {
      title: 'Voice Translation',
      description: 'Speak and get real-time translations',
      icon: <Mic style={styles.featureIcon} />,
      path: '/voice-translation'
    },
    {
      title: 'Image Translation',
      description: 'Extract and translate text from images',
      icon: <Image style={styles.featureIcon} />,
      path: '/image-translation'
    },
    {
      title: 'Sign Language',
      description: 'Translate sign language in real-time',
      icon: <SignLanguage style={styles.featureIcon} />,
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

      <div style={styles.featuresGrid}>
        {features.map((feature) => (
          <div
            key={feature.title}
            style={styles.featureCard}
            onClick={() => navigate(feature.path)}
          >
            {feature.icon}
            <h3 style={styles.featureTitle}>{feature.title}</h3>
            <p style={styles.featureDescription}>{feature.description}</p>
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
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing.xl,
    padding: theme.spacing.lg,
  },
  featureCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center',
    animation: 'fadeIn 0.5s ease forwards',
    animationDelay: 'calc(var(--index) * 100ms)',
    opacity: 0,
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.shadows.md,
      borderColor: theme.colors.primary,
      '& svg': {
        transform: 'scale(1.1)',
        color: theme.colors.primary,
      }
    },
    '& svg': {
      transition: 'all 0.3s ease',
    }
  },
  featureIcon: {
    fontSize: '48px',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  featureTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  featureDescription: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    lineHeight: '1.5',
  },
};

export default Home;