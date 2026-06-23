import { useState } from 'react';
import axios from 'axios';

function AdminRegister() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee'
    });

    const [statusText, setStatusText] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        let backendUrl = import.meta.env.VITE_API_URL + '/api/auth/register';

        try {
            await axios.post(backendUrl, userData);
            setStatusText("Account created successfully! You can login now.");
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.error) {
                setStatusText(err.response.data.error);
            } else {
                setStatusText("Registration failed. Please try again.");
            }
        }
    };

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Create a Staff Account</h2>
            
            <p style={{ color: 'red', fontWeight: 'bold' }}>{statusText}</p>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={userData.name}
                    onChange={handleInputChange}
                    required
                    style={{ padding: '8px' }}
                />
                
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={userData.email}
                    onChange={handleInputChange}
                    required
                    style={{ padding: '8px' }}
                />
                
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleInputChange}
                    required
                    style={{ padding: '8px' }}
                />

                <select
                    name="role"
                    value={userData.role}
                    onChange={handleInputChange}
                    style={{ padding: '8px' }}
                >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                    <option value="Security">Security</option>
                </select>

                <button type="submit" style={{ padding: '10px', marginTop: '10px', cursor: 'pointer', background: '#007BFF', color: 'white', border: 'none' }}>
                    Register Account
                </button>
            </form>
        </div>
    );
}

export default AdminRegister;