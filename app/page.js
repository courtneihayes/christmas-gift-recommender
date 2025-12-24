'use client';

import { useState } from 'react';

export default function Home() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('');
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGifts([]);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, gender, interests, budget }),
      });

      if (!response.ok) throw new Error('Failed to get recommendations');

      const data = await response.json();
      setGifts(data.gifts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1>🎁 Christmas Gift Recommender</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Age: </label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g., 25"
            required
            style={{ padding: '8px', marginLeft: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Gender: </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required style={{ padding: '8px', marginLeft: '10px' }}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Interests (comma-separated): </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., gaming, photography, cooking"
            required
            style={{ padding: '8px', marginLeft: '10px', width: '300px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Budget ($): </label>
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., 50"
            required
            style={{ padding: '8px', marginLeft: '10px' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {gifts.length > 0 && (
        <div>
          <h2>Recommended Gifts:</h2>
          {gifts.map((gift, idx) => (
            <div key={idx} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
              <h3>{gift.name}</h3>
              <p>{gift.description}</p>
              <p><strong>Price: ${gift.price}</strong></p>
              <p><strong>Why: </strong>{gift.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
