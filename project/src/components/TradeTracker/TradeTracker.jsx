import React, { useState, useEffect } from 'react';
import './TradeTracker.css';

const TradeTracker = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades');
      
      if (!response.ok) {
        console.error('API Response not OK:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data); // Debug log
      setTrades(data || []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to load existing trades. Starting with empty table.');
      // Keep trades as empty array instead of failing
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const addTrade = () => {
    const newTrade = {
      spreadEntryExit: '',
      total: '',
      entrys: ''
    };
    setTrades([...trades, newTrade]);
  };

  const updateTrade = (index, field, value) => {
    const updatedTrades = [...trades];
    updatedTrades[index] = {
      ...updatedTrades[index],
      [field]: value
    };
    setTrades(updatedTrades);
  };

  const deleteTrade = (index) => {
    const updatedTrades = trades.filter((_, i) => i !== index);
    setTrades(updatedTrades);
  };

  // Show loading state but only briefly
  if (loading) {
    return (
      <div className="trade-tracker">
        <div className="header">
          <h2>Trade Tracker</h2>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="trade-tracker">
      <div className="header">
        <h2>Trade Tracker</h2>
        <button className="add-button" onClick={addTrade}>Add Trade</button>
      </div>
      
      {error && <div className="error-banner">{error}</div>}

      <table className="trade-table">
        <thead>
          <tr>
            <th>Spread Entry/Exit</th>
            <th>Total</th>
            <th>Entry's</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-state">
                No trades yet. Click "Add Trade" to get started.
              </td>
            </tr>
          ) : (
            trades.map((trade, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={trade.spreadEntryExit || ''}
                    onChange={(e) => updateTrade(index, 'spreadEntryExit', e.target.value)}
                    className="text-input"
                    placeholder="Enter spread"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={trade.total || ''}
                    onChange={(e) => updateTrade(index, 'total', e.target.value)}
                    className="number-input"
                    placeholder="Enter total"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={trade.entrys || ''}
                    onChange={(e) => updateTrade(index, 'entrys', e.target.value)}
                    className="text-input"
                    placeholder="Enter entry's"
                  />
                </td>
                <td>
                  <button 
                    onClick={() => deleteTrade(index)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TradeTracker;