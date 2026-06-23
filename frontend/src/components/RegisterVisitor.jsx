import { useState, useEffect } from 'react';
import axios from 'axios';

function RegisterVisitor() {
    const [visitorInput, setVisitorInput] = useState({
        name: '',
        email: '',
        phone: '',
        purposeOfVisit: '',
        hostId: ''
    });

    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [empList, setEmpList] = useState([]);
    const [statusAlert, setStatusAlert] = useState('');

    useEffect(() => {
        const getEmployees = async () => {
            try {
                let apiLink = import.meta.env.VITE_API_URL + '/api/visitors/employees';
                let res = await axios.get(apiLink);
                setEmpList(res.data);
            } catch (err) {
                console.log('Failed to fetch the employee list');
            }
        };
        getEmployees();
    }, []);

    const submitRegistration = async (e) => {
        e.preventDefault();
        
        let emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let phoneCheck = /^[0-9]{10}$/;

        if (!emailCheck.test(visitorInput.email)) {
            setStatusAlert('Error: Invalid email format.');
            return;
        }
        if (!phoneCheck.test(visitorInput.phone)) {
            setStatusAlert('Error: Phone must be exactly 10 digits.');
            return;
        }

        setStatusAlert('Sending data to server...');

        let formDataBundle = new FormData();
        formDataBundle.append('name', visitorInput.name);
        formDataBundle.append('email', visitorInput.email);
        formDataBundle.append('phone', visitorInput.phone);
        formDataBundle.append('purposeOfVisit', visitorInput.purposeOfVisit);
        formDataBundle.append('hostId', visitorInput.hostId);
        
        if (capturedPhoto) {
            formDataBundle.append('photo', capturedPhoto);
        }

        try {
            let registerLink = import.meta.env.VITE_API_URL + '/api/visitors/register';
            
            await axios.post(registerLink, formDataBundle, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setStatusAlert('Success! Registration complete.');
            
            setVisitorInput({ 
                name: '', 
                email: '', 
                phone: '', 
                purposeOfVisit: '', 
                hostId: '' 
            });
            setCapturedPhoto(null);

        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.error) {
                setStatusAlert('Error: ' + err.response.data.error);
            } else {
                setStatusAlert('Error: Something went wrong while saving.');
            }
        }
    };

    const handleTyping = (e) => {
        setVisitorInput({ 
            ...visitorInput, 
            [e.target.name]: e.target.value 
        });
    };

    const goToOtpPage = () => {
        window.location.href = '/verify-otp';
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ textAlign: 'center' }}>New Visitor Registration</h2>
            
            {statusAlert && (
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <p style={{ fontWeight: 'bold', color: statusAlert.includes('Error') ? 'red' : 'green' }}>
                        {statusAlert}
                    </p>
                    
                    {statusAlert.includes('Success') && (
                        <button 
                            type="button" 
                            onClick={goToOtpPage}
                            style={{
                                marginTop: '10px',
                                padding: '10px 15px',
                                backgroundColor: 'blue',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Proceed to OTP Verification
                        </button>
                    )}
                </div>
            )}
            
            <form onSubmit={submitRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    name="name" 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    value={visitorInput.name} 
                    onChange={handleTyping} 
                    style={{ padding: '8px' }} 
                />
                
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    value={visitorInput.email} 
                    onChange={handleTyping} 
                    style={{ padding: '8px' }} 
                />
                
                <input 
                    name="phone" 
                    type="text" 
                    placeholder="Phone Number" 
                    required 
                    value={visitorInput.phone} 
                    onChange={handleTyping} 
                    style={{ padding: '8px' }} 
                />
                
                <input 
                    name="purposeOfVisit" 
                    type="text" 
                    placeholder="Why are you visiting?" 
                    required 
                    value={visitorInput.purposeOfVisit} 
                    onChange={handleTyping} 
                    style={{ padding: '8px' }} 
                />
                
                <select 
                    name="hostId" 
                    required 
                    value={visitorInput.hostId} 
                    onChange={handleTyping} 
                    style={{ padding: '8px' }}
                >
                    <option value="" disabled>Select the Employee</option>
                    {empList.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                </select>
                
                <div style={{ padding: '10px', border: '1px dotted #888', marginTop: '5px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Upload Photo</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        required 
                        onChange={(e) => setCapturedPhoto(e.target.files[0])} 
                    />
                </div>

                <button 
                    type="submit" 
                    style={{ padding: '10px', marginTop: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Submit Registration
                </button>
            </form>
        </div>
    );
}

export default RegisterVisitor;