import { useState } from 'react';
import axios from 'axios';

function AdminRegister() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Employee' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://visitor-pass-backend-qhoo.onrender.com/api/auth/register', formData);
      setMessage(`${formData.role} account created! Now go to /login`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>Create Staff Account</h2>
      {message && <p style={{ fontWeight: 'bold', color: 'green' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" placeholder="Full Name" required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{ padding: '10px' }}
        />

        <input 
          type="email" placeholder="Email" required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ padding: '10px' }}
        />
        
        <input 
          type="password" placeholder="Password" required 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          style={{ padding: '10px' }}
        />

        <select 
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          style={{ padding: '10px', fontSize: '16px' }}
          required
        >
          <option value="Employee">Employee</option>
          <option value="Admin">Admin</option>
          <option value="Security">Security</option>
        </select>

        <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Register Account
        </button>
      </form>
    </div>
  );
}

export default AdminRegister;