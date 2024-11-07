// src/components/History.js
import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading history...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Translation History</h2>
      {history.length === 0 ? (
        <p style={styles.emptyMessage}>No translations yet</p>
      ) : (
        <div style={styles.historyList}>
          {history.map((item) => (
            <div key={item.id} style={styles.historyItem}>
              <div style={styles.timestamp}>
                {item.timestamp ? item.timestamp.toLocaleString() : 'Date not available'}
              </div>
              <div style={styles.translationDetails}>
                <div style={styles.languagePair}>
                  {item.fromLanguage} → {item.toLanguage}
                </div>
                <div style={styles.text}>
                  <p><strong>Original:</strong> {item.original}</p>
                  <p><strong>Translated:</strong> {item.translated}</p>
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
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    padding: '20px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  timestamp: {
    fontSize: '0.9em',
    color: '#666',
    marginBottom: '10px',
  },
  translationDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  languagePair: {
    fontSize: '0.9em',
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  }
};

export default History;
