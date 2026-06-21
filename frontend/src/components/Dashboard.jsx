// frontend/src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  // This state holds the list of visitors we get from the database
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect runs automatically as soon as the Dashboard loads
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        // Ask the backend for the list of all visitors
        const response = await axios.get('https://visitor-pass-backend-qhoo.onrender.com/api/visitors');
        setVisitors(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load visitors. Is your backend server running?');
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
        <button style={{ padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {loading ? (
        <p>Loading visitor data...</p>
      ) : (
        <div style={{ overflowX: 'auto', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Phone</th>
                <th style={{ padding: '12px' }}>Purpose</th>
                <th style={{ padding: '12px' }}>Date Registered</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>No visitors found. Go register one!</td>
                </tr>
              ) : (
                visitors.map((visitor) => (
                  <tr key={visitor._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{visitor.name}</td>
                    <td style={{ padding: '12px' }}>{visitor.email}</td>
                    <td style={{ padding: '12px' }}>{visitor.phone}</td>
                    <td style={{ padding: '12px' }}>{visitor.purposeOfVisit}</td>
                    <td style={{ padding: '12px' }}>{new Date(visitor.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;