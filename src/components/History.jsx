// src/components/History.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import theme from '../styles/theme';
import { 
  AccessTime, 
  SwapHoriz, 
  Translate, 
  Mic, 
  Image 
} from '@mui/icons-material';

const TranslationTypeIcon = ({ type }) => {
  const iconStyle = {
    fontSize: '20px',
    color: theme.colors.primary,
  };

  switch (type) {
    case 'voice':
      return <Mic style={iconStyle} />;
    case 'image':
      return <Image style={iconStyle} />;
    default:
      return <Translate style={iconStyle} />;
  }
};

const History = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const historyRef = collection(db, 'history');
        const q = query(
          historyRef,
          where('uid', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Translation History</h2>
      
      {loading ? (
        <div style={styles.loading}>Loading history...</div>
      ) : history.length === 0 ? (
        <div style={styles.emptyState}>No translation history yet</div>
      ) : (
        <div style={styles.historyList}>
          {history.map((item) => (
            <div key={item.id} style={styles.historyItem}>
              <div style={styles.itemHeader}>
                <div style={styles.headerLeft}>
                  <div style={styles.timestamp}>
                    <AccessTime style={styles.icon} />
                    {item.timestamp ? item.timestamp.toLocaleString() : 'Date not available'}
                  </div>
                  <div style={styles.translationType}>
                    <TranslationTypeIcon type={item.type} />
                  </div>
                </div>
                <div style={styles.languagePair}>
                  {item.fromLanguage}
                  <SwapHoriz style={styles.icon} />
                  {item.toLanguage}
                </div>
              </div>
              <div style={styles.translationContent}>
                <div style={styles.textBlock}>
                  <div style={styles.label}>Original</div>
                  <div style={styles.text}>{item.original}</div>
                </div>
                <div style={styles.textBlock}>
                  <div style={styles.label}>Translated</div>
                  <div style={styles.text}>{item.translated}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: theme.spacing.xl,
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    padding: theme.spacing.xl,
  },
  emptyState: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
  },
  historyItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.md,
    },
  },
  itemHeader: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
  },
  languagePair: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  icon: {
    fontSize: '1.2em',
  },
  translationContent: {
    padding: theme.spacing.lg,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.xl,
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  text: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    lineHeight: '1.5',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  translationType: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: theme.borderRadius.sm,
  },
};

export default History;
