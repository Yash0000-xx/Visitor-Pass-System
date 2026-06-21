import { useState } from 'react';
import axios from 'axios';

function VerifyOTP() {
  const [data, setData] = useState({ email: '', otp: '' });
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://visitor-pass-backend-qhoo.onrender.com/api/visitors/verify-otp', data);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Verification failed.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h3>Verify OTP</h3>
      <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Email" onChange={(e) => setData({...data, email: e.target.value})} required style={{ padding: '8px' }} />
        <input type="text" placeholder="Enter 6-digit OTP" onChange={(e) => setData({...data, otp: e.target.value})} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none' }}>Verify</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
export default VerifyOTP;