import { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyVisitors();
  }, []);

  const fetchMyVisitors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://visitor-pass-backend-qhoo.onrender.com/api/visitors/my-visitors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVisitors(response.data);
    } catch (error) {
      console.error("Error fetching visitors");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://visitor-pass-backend-qhoo.onrender.com/api/visitors/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(`Pass ${newStatus}!`);
      fetchMyVisitors();
      

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update status.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>My Appointments</h2>
      {message && <p style={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }}>{message}</p>}

      {visitors.length === 0 ? (
        <p>You have no scheduled visitors.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Purpose</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map(visitor => (
              <tr key={visitor._id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{visitor.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{visitor.purposeOfVisit}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: visitor.status === 'Approved' ? 'green' : visitor.status === 'Rejected' ? 'red' : 'orange' }}>
                  {visitor.status}
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  {visitor.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleStatusUpdate(visitor._id, 'Approved')} style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                        Approve
                      </button>
                      <button onClick={() => handleStatusUpdate(visitor._id, 'Rejected')} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeDashboard;