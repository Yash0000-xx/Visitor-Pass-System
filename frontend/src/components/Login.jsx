import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [userEmail, setUserEmail] = useState('');
    const [userPass, setUserPass] = useState('');
    const [failMsg, setFailMsg] = useState('');

    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setFailMsg('');

        try {
            let backendLink = import.meta.env.VITE_API_URL + '/api/auth/login';
            
            let res = await axios.post(backendLink, {
                email: userEmail,
                password: userPass
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userRole', res.data.userData.role);

            let fetchedRole = res.data.userData.role;
            
            if (fetchedRole === 'Employee') {
                navigate('/employee-dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.error) {
                setFailMsg(err.response.data.error);
            } else {
                setFailMsg("Login failed. Check your email and password.");
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>System Login</h2>
            
            {failMsg && <p style={{ color: 'red', fontWeight: 'bold' }}>{failMsg}</p>}

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    required 
                    style={{ padding: '10px' }}
                />
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={userPass} 
                    onChange={(e) => setUserPass(e.target.value)} 
                    required 
                    style={{ padding: '10px' }}
                />
                
                <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Log In
                </button>
            </form>
        </div>
    );
}

export default Login;