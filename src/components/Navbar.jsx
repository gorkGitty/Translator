// Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import theme from '../styles/theme';
import { TranslateOutlined, MicOutlined, ImageOutlined, HistoryOutlined, Logout, SignLanguage } from '@mui/icons-material';

const Navbar = ({ onLogout, isGuest }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon, label }) => (
    <Link
      to={to}
      style={{
        ...styles.link,
        ...(isActive(to) && styles.activeLink),
      }}
    >
      {icon}
      <span style={styles.linkText}>{label}</span>
    </Link>
  );

  return (
    <nav style={styles.navbar}>
      <div style={styles.content}>
        <Link to="/" style={styles.logo}>
          Translator
        </Link>
        <div style={styles.rightSection}>
          <div style={styles.links}>
            <NavLink to="/translate" icon={<TranslateOutlined />} label="Text" />
            <NavLink to="/voice-translation" icon={<MicOutlined />} label="Voice" />
            <NavLink to="/image-translation" icon={<ImageOutlined />} label="Image" />
            <NavLink to="/sign-language" icon={<SignLanguage />} label="Sign" />
            <NavLink to="/history" icon={<HistoryOutlined />} label="History" />
          </div>
          <button onClick={onLogout} style={styles.logoutButton}>
            <Logout style={styles.logoutIcon} />
            <span>{isGuest ? 'Exit Guest Mode' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.sm,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '600',
    color: theme.colors.primary,
    textDecoration: 'none',
    letterSpacing: '-0.025em',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xl,
  },
  links: {
    display: 'flex',
    gap: theme.spacing.lg,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    color: theme.colors.text.secondary,
    textDecoration: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: theme.typography.sizes.sm,
    position: 'relative',
    backgroundColor: 'transparent',
    '&:hover': {
      transform: 'translateY(-2px)',
      backgroundColor: `${theme.colors.primary}15`,
      color: theme.colors.primary,
      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.15)',
    },
    '&:active': {
      transform: 'translateY(0)',
    }
  },
  activeLink: {
    backgroundColor: `${theme.colors.primary}20`,
    color: theme.colors.primary,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(59, 130, 246, 0.15)',
    '&:hover': {
      backgroundColor: `${theme.colors.primary}25`,
    }
  },
  linkText: {
    marginLeft: theme.spacing.xs,
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: 'transparent',
    color: theme.colors.text.secondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: theme.typography.sizes.sm,
    '&:hover': {
      backgroundColor: '#fee2e2',
      borderColor: '#ef4444',
      color: '#ef4444',
    },
  },
  logoutIcon: {
    fontSize: '20px',
  },
};

export default Navbar;