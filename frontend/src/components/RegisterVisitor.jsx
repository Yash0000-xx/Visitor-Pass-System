import { useState } from 'react';
import axios from 'axios';

function RegisterVisitor() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purposeOfVisit: '',
    hostId: ''
  });
  

  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Registering...');


    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('purposeOfVisit', formData.purposeOfVisit);
    data.append('hostId', formData.hostId);
    

    if (photo) {
      data.append('photo', photo);
    }

    try {

      await axios.post('https://visitor-pass-backend-qhoo.onrender.com/api/visitors/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Visitor registered successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Visitor Registration</h2>
      
      {message && <p style={{ fontWeight: 'bold', textAlign: 'center' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="name" type="text" placeholder="Full Name" required onChange={handleChange} style={{ padding: '10px' }} />
        <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} style={{ padding: '10px' }} />
        <input name="phone" type="text" placeholder="Phone Number" required onChange={handleChange} style={{ padding: '10px' }} />
        <input name="purposeOfVisit" type="text" placeholder="Purpose of Visit" required onChange={handleChange} style={{ padding: '10px' }} />
        
       
        <input name="hostId" type="text" placeholder="Host ID" required onChange={handleChange} style={{ padding: '10px' }} />
        
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Visitor Photo (Required)</label>
        
          <input 
            type="file" 
            accept="image/*" 
            required
            onChange={(e) => setPhoto(e.target.files[0])} 
          />
        </div>

        <button type="submit" style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Register Visitor
        </button>
      </form>
    </div>
  );
}

export default RegisterVisitor;