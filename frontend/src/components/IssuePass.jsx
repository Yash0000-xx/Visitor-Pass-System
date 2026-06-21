import { useState } from 'react';
import axios from 'axios';

function IssuePass() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purposeOfVisit: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
   
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to issue a pass.');
        return;
      }

    
      const response = await axios.post(
        'https://visitor-pass-backend-qhoo.onrender.com/api/passes/issue', 
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage('Pass issued successfully!');
      
   
      setFormData({ name: '', email: '', phone: '', purposeOfVisit: '' });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue pass.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2>Issue New Visitor Pass</h2>
      
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        
        <input 
          type="text" 
          name="name" 
          placeholder="Visitor Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px' }}
        />
        
        <input 
          type="email" 
          name="email" 
          placeholder="Visitor Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px' }}
        />
        
        <input 
          type="text" 
          name="phone" 
          placeholder="Phone Number" 
          value={formData.phone} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px' }}
        />
        
        <input 
          type="text" 
          name="purposeOfVisit" 
          placeholder="Purpose of Visit" 
          value={formData.purposeOfVisit} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px' }}
        />

        <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Issue Pass
        </button>
      </form>
    </div>
  );
}

export default IssuePass;