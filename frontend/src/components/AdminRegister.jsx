import { useState } from 'react';
import axios from 'axios';

function AdminRegister() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://visitor-pass-backend-qhoo.onrender.com/api/auth/register', formData);
      setMessage('Admin account created successfully! Now go to /login');
    } catch (error) {
      // THIS CHANGE SHOWS THE REAL ERROR FROM THE SERVER
      const errorMessage = error.response?.data?.message || "Registration failed. Try again.";
      setMessage(errorMessage);
    }
  };
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>Create Admin Account</h2>
      {message && <p style={{ fontWeight: 'bold' }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" placeholder="Email" required 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ padding: '10px' }}
        />
        <input 
          type="password" placeholder="Password" required 
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}>
          Register Admin
        </button>
      </form>
    </div>
  );
}

export default AdminRegister;