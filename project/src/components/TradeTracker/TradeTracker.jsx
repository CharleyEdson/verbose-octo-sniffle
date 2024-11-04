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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTrades(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const addTrade = async () => {
    try {
      const newTrade = {
        spreadEntryExit: '',
        total: '',
        entrys: ''
      };

      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrade),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchTrades(); // Refresh the list
    } catch (err) {
      console.error('Add trade error:', err);
      setError('Failed to add trade');
    }
  };

  const updateTrade = async (index, field, value) => {
    try {
      const updatedTrades = [...trades];
      updatedTrades[index] = {
        ...updatedTrades[index],
        [field]: value
      };
      setTrades(updatedTrades);

      // You can add API call here to update Google Sheet if needed
    } catch (err) {
      console.error('Update trade error:', err);
      setError('Failed to update trade');
    }
  };

  if (loading) return <div className="loading">Loading trades...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="trade-tracker">
      <div className="header">
        <h2>Trade Tracker</h2>
        <button className="add-button" onClick={addTrade}>Add Trade</button>
      </div>

      <table className="trade-table">
        <thead>
          <tr>
            <th>Spread Entry/Exit</th>
            <th>Total</th>
            <th>Entry's</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={trade.spreadEntryExit}
                  onChange={(e) => updateTrade(index, 'spreadEntryExit', e.target.value)}
                  className="text-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={trade.total}
                  onChange={(e) => updateTrade(index, 'total', e.target.value)}
                  className="number-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={trade.entrys}
                  onChange={(e) => updateTrade(index, 'entrys', e.target.value)}
                  className="text-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeTracker;