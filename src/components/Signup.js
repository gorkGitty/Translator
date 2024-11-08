import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';
import theme from '../styles/theme';
import { Email, Lock, Error, Person } from '@mui/icons-material';

function Signup({ onSignup }) {
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
        <p style={styles.subtitle}>Sign up to start using Translator</p>

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
            Sign Up
          </button>
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
  // Reuse most styles from Login component
  // Add new styles for guest button and divider
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
    '&:hover': {
      backgroundColor: theme.colors.surfaceHover,
      borderColor: theme.colors.primary,
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
};

export default Signup;
