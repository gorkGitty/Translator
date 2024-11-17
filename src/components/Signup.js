import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase.js';
import theme from '../styles/theme.js';
import { Email, Lock, Error, Person } from '@mui/icons-material';

function Signup({ onSignup, onToggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onSignup(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    try {
      const userCredential = await signInAnonymously(auth);
      onSignup(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Sign up to start using Universal Translator</p>

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <Email style={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock style={styles.inputIcon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && (
            <div style={styles.error}>
              <Error style={styles.errorIcon} />
              {error}
            </div>
          )}

          <button type="submit" style={styles.button}>
            Create Account
          </button>

          <div style={styles.loginPrompt}>
            <span>Already have an account? </span>
            <button onClick={() => onToggleForm('login')} style={styles.textButton}>
              Sign in
            </button>
          </div>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>

        <button 
          onClick={handleGuestLogin} 
          style={styles.guestButton}
        >
          <Person style={styles.buttonIcon} />
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    animation: 'fadeIn 0.5s ease forwards',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.lg,
    padding: theme.spacing.xxl,
    animation: 'slideUp 0.5s ease forwards',
  },
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
  },
  inputGroup: {
    position: 'relative',
    animation: 'slideRight 0.5s ease forwards',
    animationDelay: 'calc(var(--index) * 100ms)',
  },
  inputIcon: {
    position: 'absolute',
    left: theme.spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.text.secondary,
    fontSize: '20px',
  },
  input: {
    width: '85%',
    padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xxl}`,
    fontSize: theme.typography.sizes.base,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    outline: 'none',
    transition: 'all 0.2s ease',
    '&:focus': {
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
    },
  },
  button: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.sizes.base,
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    animation: 'slideUp 0.5s ease forwards',
    animationDelay: '0.2s',
    '&:hover': {
      backgroundColor: theme.colors.primary + 'dd',
      transform: 'translateY(-1px)',
    },
  },
  guestButton: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.sizes.base,
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    transition: 'all 0.2s ease',
    animation: 'slideUp 0.5s ease forwards',
    animationDelay: '0.3s',
    '&:hover': {
      backgroundColor: theme.colors.surfaceHover,
      borderColor: theme.colors.primary,
      transform: 'translateY(-1px)',
    },
  },
  divider: {
    margin: `${theme.spacing.xl} 0`,
    position: 'relative',
    textAlign: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: theme.colors.border,
    },
  },
  dividerText: {
    backgroundColor: theme.colors.surface,
    padding: `0 ${theme.spacing.md}`,
    color: theme.colors.text.secondary,
    position: 'relative',
  },
  buttonIcon: {
    fontSize: '20px',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: `${theme.colors.error}10`,
    color: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.sizes.sm,
    animation: 'shake 0.5s ease forwards',
  },
  errorIcon: {
    fontSize: '20px',
  },
  loginPrompt: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    animation: 'fadeIn 0.5s ease forwards',
    animationDelay: '0.4s',
  },
  textButton: {
    background: 'none',
    border: 'none',
    color: theme.colors.primary,
    cursor: 'pointer',
    fontSize: theme.typography.sizes.base,
    padding: 0,
    transition: 'color 0.2s ease',
    '&:hover': {
      color: theme.colors.primary + 'dd',
      textDecoration: 'underline',
    },
  },
};

export default Signup;
