import React, { useState, useEffect } from 'react';
import './TradeTracker.css';

const TradeTracker = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trades on component mount
  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades');
      if (!response.ok) throw new Error('Failed to fetch trades');
      const data = await response.json();
      setTrades(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const addRow = async () => {
    const newTrade = {
      spreadEntryExit: '',
      total: '',
      entrys: ''
    };

    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrade),
      });

      if (!response.ok) throw new Error('Failed to add trade');
      await fetchTrades(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const updateField = async (id, field, value) => {
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) throw new Error('Failed to update trade');
      await fetchTrades(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteRow = async (id) => {
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete trade');
      await fetchTrades(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="trade-tracker">
      <div className="header">
        <h2>Trade Tracker</h2>
        <button className="add-button" onClick={addRow}>
          Add Trade
        </button>
      </div>

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
          {trades.map((trade, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={trade.spreadEntryExit}
                  onChange={(e) => updateField(index, 'spreadEntryExit', e.target.value)}
                  className="text-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={trade.total}
                  onChange={(e) => updateField(index, 'total', e.target.value)}
                  className="number-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={trade.entrys}
                  onChange={(e) => updateField(index, 'entrys', e.target.value)}
                  className="text-input"
                />
              </td>
              <td>
                <button 
                  onClick={() => deleteRow(index)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeTracker;