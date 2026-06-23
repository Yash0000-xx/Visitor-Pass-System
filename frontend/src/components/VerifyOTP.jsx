import { useState } from 'react';
import axios from 'axios';

function VerifyOTP() {
    const [otpInput, setOtpInput] = useState({ email: '', otp: '' });
    const [statusText, setStatusText] = useState('');

    const submitVerification = async (e) => {
        e.preventDefault();
        setStatusText('');

        try {
            let verifyLink = import.meta.env.VITE_API_URL + '/api/visitors/verify-otp';
            
            let res = await axios.post(verifyLink, otpInput);
            
            setStatusText(res.data.msg || "Verification successful! Your host has been notified.");
            
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.error) {
                setStatusText("Error: " + err.response.data.error);
            } else {
                setStatusText("Error: Failed to verify OTP. Please try again.");
            }
        }
    };

    const handleTyping = (e) => {
        setOtpInput({
            ...otpInput,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ textAlign: 'center' }}>Verify Your Visit</h2>
            
            {statusText && (
                <p style={{ textAlign: 'center', fontWeight: 'bold', color: statusText.includes('Error') ? 'red' : 'green' }}>
                    {statusText}
                </p>
            )}

            <form onSubmit={submitVerification} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                <input 
                    type="email" 
                    name="email"
                    placeholder="Your Email Address" 
                    value={otpInput.email}
                    onChange={handleTyping} 
                    required 
                    style={{ padding: '10px' }} 
                />
                
                <input 
                    type="text" 
                    name="otp"
                    placeholder="Enter 6-digit OTP" 
                    value={otpInput.otp}
                    onChange={handleTyping} 
                    required 
                    style={{ padding: '10px', letterSpacing: '2px', textAlign: 'center' }} 
                />
                
                <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Verify Code
                </button>
            </form>
        </div>
    );
}

export default VerifyOTP;