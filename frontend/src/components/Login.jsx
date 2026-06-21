// frontend/src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  // These variables store what the user types into the input boxes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // This tool lets us switch pages after a successful login
  const navigate = useNavigate();

  // This function runs when the user clicks the "Login" button
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setError(''); // Clear any previous errors

    try {
      // Send the email and password to our Node.js backend
      const response = await axios.post('https://visitor-pass-backend-qhoo.onrender.com/api/auth/login', {
        email,
        password
      });

      // If successful, save the digital ID (token) to the browser's local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);

      alert('Login Successful!');
      
      // Send the user to the dashboard page
      navigate('/dashboard');

    } catch (err) {
      // If the backend rejects the login, show an error message
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>System Login</h2>
      
      {/* Display error messages in red if they exist */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px' }}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px' }}
        />
        
        <button type="submit" style={{ padding: '10px', fontSize: '16px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;