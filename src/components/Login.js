import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import theme from '../styles/theme';
import { Email, Lock, Error } from '@mui/icons-material';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to continue to Translator</p>

        <form onSubmit={handleLogin} style={styles.form}>
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
            Sign In
          </button>
        </form>
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
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.lg,
    padding: theme.spacing.xxl,
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
    transition: 'border-color 0.2s ease',
    '&:focus': {
      borderColor: theme.colors.primary,
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
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.colors.primary + 'dd',
    },
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
  },
  errorIcon: {
    fontSize: '20px',
  },
};

export default Login;