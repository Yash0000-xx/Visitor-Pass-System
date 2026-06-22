import { useState, useEffect } from 'react';
import axios from 'axios';

function RegisterVisitor() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', purposeOfVisit: '', hostId: ''
  });
  const [photo, setPhoto] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('https://visitor-pass-backend-qhoo.onrender.com/api/visitors/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error('Could not load employees');
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.email)) {
        setMessage('Error: Please enter a valid email address.');
        return;
    }
    if (!phoneRegex.test(formData.phone)) {
        setMessage('Error: Phone number must be exactly 10 digits.');
        return;
    }

    setMessage('Registering...');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('purposeOfVisit', formData.purposeOfVisit);
    data.append('hostId', formData.hostId);
    if (photo) data.append('photo', photo);

    try {
      await axios.post('https://visitor-pass-backend-qhoo.onrender.com/api/visitors/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Visitor registered! Awaiting approval.');
      
      setFormData({ name: '', email: '', phone: '', purposeOfVisit: '', hostId: '' });
      setPhoto(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error: Registration failed.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Visitor Registration</h2>
      
      {/* UPDATED MESSAGE AND BUTTON BLOCK */}
      {message && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', color: message.startsWith('Error') ? 'red' : 'green' }}>
                {message}
            </p>
            {message.includes('registered') && (
                <button 
                    type="button" 
                    onClick={() => window.location.href = '/verify-otp'}
                    style={{
                        marginTop: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Proceed to Verify OTP
                </button>
            )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="name" type="text" placeholder="Full Name" required value={formData.name} onChange={handleChange} style={{ padding: '10px' }} />
        <input name="email" type="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} style={{ padding: '10px' }} />
        <input name="phone" type="text" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} style={{ padding: '10px' }} />
        <input name="purposeOfVisit" type="text" placeholder="Purpose of Visit" required value={formData.purposeOfVisit} onChange={handleChange} style={{ padding: '10px' }} />
        
        <select name="hostId" required value={formData.hostId} onChange={handleChange} style={{ padding: '10px' }}>
          <option value="" disabled>Select Employee to Visit</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>
        
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Visitor Photo (Required)</label>
          <input type="file" accept="image/*" required onChange={(e) => setPhoto(e.target.files[0])} />
        </div>

        <button type="submit" style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Register Visitor
        </button>
      </form>
    </div>
  );
}

export default RegisterVisitor;