import { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeDashboard() {
    const [myAppts, setMyAppts] = useState([]);
    const [statusMsg, setStatusMsg] = useState('');

    const getAppointments = async () => {
        try {
            let myToken = localStorage.getItem('token');
            let backendLink = import.meta.env.VITE_API_URL + '/api/visitors/appointments';
            
            let res = await axios.get(backendLink, {
                headers: { Authorization: 'Bearer ' + myToken }
            });
            
            setMyAppts(res.data);
        } catch (err) {
            console.log("Could not grab appointments");
            console.log(err);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const changeStatus = async (apptId, newStatusVal) => {
        try {
            let myToken = localStorage.getItem('token');
            let updateLink = import.meta.env.VITE_API_URL + '/api/visitors/' + apptId + '/status';
            
            await axios.put(updateLink, 
                { status: newStatusVal },
                { headers: { Authorization: 'Bearer ' + myToken } }
            );
            
            setStatusMsg("Appointment " + newStatusVal + "!");
            getAppointments(); 

            setTimeout(() => {
                setStatusMsg('');
            }, 3000);
            
        } catch (err) {
            console.log(err);
            setStatusMsg('Could not update status right now.');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>My Dashboard</h2>
            
            {statusMsg && <p style={{ color: 'blue', fontWeight: 'bold' }}>{statusMsg}</p>}

            {myAppts.length === 0 ? (
                <p>No appointments waiting for you.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#eee', borderBottom: '2px solid #ccc' }}>
                            <th style={{ padding: '10px' }}>Visitor Name</th>
                            <th style={{ padding: '10px' }}>Purpose</th>
                            <th style={{ padding: '10px' }}>Current Status</th>
                            <th style={{ padding: '10px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myAppts.map(appt => (
                            <tr key={appt._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{appt.name}</td>
                                <td style={{ padding: '10px' }}>{appt.purposeOfVisit}</td>
                                
                                <td style={{ 
                                    padding: '10px', 
                                    fontWeight: 'bold', 
                                    color: appt.status === 'Approved' ? 'green' : (appt.status === 'Rejected' ? 'red' : 'orange') 
                                }}>
                                    {appt.status}
                                </td>
                                
                                <td style={{ padding: '10px' }}>
                                    {appt.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button 
                                                onClick={() => changeStatus(appt._id, 'Approved')} 
                                                style={{ padding: '5px 10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
                                            >
                                                Approve
                                            </button>
                                            
                                            <button 
                                                onClick={() => changeStatus(appt._id, 'Rejected')} 
                                                style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default EmployeeDashboard;