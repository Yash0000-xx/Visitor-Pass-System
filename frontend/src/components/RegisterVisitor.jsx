// frontend/src/components/RegisterVisitor.jsx
import { useState } from 'react';
import axios from 'axios';

function RegisterVisitor() {
  // State variables to hold the form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purposeOfVisit: '',
    hostId: '64b... (We will link real Employees later)' // Placeholder for now
  });
  
  const [message, setMessage] = useState('');

  // Handle changes when the user types in the input boxes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit the form to the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://visitor-pass-backend-qhoo.onrender.com/api/visitors/register', formData);
      setMessage(response.data.message);
      
      // Clear the form after success
      setFormData({ name: '', email: '', phone: '', purposeOfVisit: '', hostId: formData.hostId });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error registering visitor.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>Visitor Registration</h2>
      
      {/* Show success or error messages */}
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" name="name" placeholder="Full Name" 
          value={formData.name} onChange={handleChange} required 
          style={{ padding: '10px', fontSize: '16px' }}
        />
        
        <input 
          type="email" name="email" placeholder="Email Address" 
          value={formData.email} onChange={handleChange} required 
          style={{ padding: '10px', fontSize: '16px' }}
        />
        
        <input 
          type="tel" name="phone" placeholder="Phone Number" 
          value={formData.phone} onChange={handleChange} required 
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <textarea 
          name="purposeOfVisit" placeholder="Purpose of Visit" 
          value={formData.purposeOfVisit} onChange={handleChange} required 
          style={{ padding: '10px', fontSize: '16px', minHeight: '80px' }}
        />

        {/* Note: In a fully finished app, this would be a dropdown menu of actual Employees */}
        <input 
          type="text" name="hostId" placeholder="Host ID (Employee)" 
          value={formData.hostId} disabled 
          style={{ padding: '10px', fontSize: '16px', backgroundColor: '#e9ecef' }}
        />
        
        <button type="submit" style={{ padding: '12px', fontSize: '16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Register Visitor
        </button>

      </form>
    </div>
  );
}

export default RegisterVisitor;