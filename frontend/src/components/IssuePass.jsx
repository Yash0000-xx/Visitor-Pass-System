import { useState } from 'react';
import axios from 'axios';

function IssuePass() {
    const [passInfo, setPassInfo] = useState({
        name: '',
        email: '',
        phone: '',
        purposeOfVisit: ''
    });
    
    const [successMsg, setSuccessMsg] = useState('');
    const [failMsg, setFailMsg] = useState('');

    const handleInput = (e) => {
        setPassInfo({
            ...passInfo,
            [e.target.name]: e.target.value
        });
    };

    const submitPassForm = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        setFailMsg('');

        try {
            let myToken = localStorage.getItem('token');
            
            if (!myToken) {
                setFailMsg('You need to log in first.');
                return;
            }

            let apiUrl = import.meta.env.VITE_API_URL + '/api/passes/issue';
            
            await axios.post(apiUrl, passInfo, {
                headers: { Authorization: 'Bearer ' + myToken }
            });

            setSuccessMsg('Pass created successfully!');
            
            setPassInfo({ 
                name: '', 
                email: '', 
                phone: '', 
                purposeOfVisit: '' 
            });

        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.error) {
                setFailMsg(err.response.data.error);
            } else {
                setFailMsg('Could not issue the pass.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Issue Walk-in Pass</h2>
            
            {successMsg && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMsg}</p>}
            {failMsg && <p style={{ color: 'red', fontWeight: 'bold' }}>{failMsg}</p>}

            <form onSubmit={submitPassForm} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Full Name" 
                    value={passInfo.name} 
                    onChange={handleInput} 
                    required 
                    style={{ padding: '8px' }}
                />
                
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email Address" 
                    value={passInfo.email} 
                    onChange={handleInput} 
                    required 
                    style={{ padding: '8px' }}
                />
                
                <input 
                    type="text" 
                    name="phone" 
                    placeholder="Phone Number" 
                    value={passInfo.phone} 
                    onChange={handleInput} 
                    required 
                    style={{ padding: '8px' }}
                />
                
                <input 
                    type="text" 
                    name="purposeOfVisit" 
                    placeholder="Why are they visiting?" 
                    value={passInfo.purposeOfVisit} 
                    onChange={handleInput} 
                    required 
                    style={{ padding: '8px' }}
                />

                <button type="submit" style={{ padding: '10px', marginTop: '10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Create Pass
                </button>
            </form>
        </div>
    );
}

export default IssuePass;