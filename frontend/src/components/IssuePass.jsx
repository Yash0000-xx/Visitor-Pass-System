// frontend/src/components/IssuePass.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function IssuePass() {
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Load the list of visitors from the database when the page opens
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/visitors');
        setVisitors(response.data);
      } catch (error) {
        console.error('Failed to fetch visitors');
      }
    };
    fetchVisitors();
  }, []);

  // The master function that runs the API chain
  const handleGeneratePass = async () => {
    if (!selectedVisitor) {
      setMessage('Please select a visitor first.');
      return;
    }

    setLoading(true);
    setQrCode('');
    setMessage('Processing appointment and generating secure QR code...');

    try {
      // 1. Request an Appointment for the selected visitor
      const apptRes = await axios.post('http://localhost:5000/api/appointments/request', {
        visitorId: selectedVisitor,
        hostId: '64c1234567890abcdef12345', // Dummy Employee ID to keep the demo fast
        date: new Date(),
        time: '10:00 AM'
      });
      const apptId = apptRes.data.appointment._id;

      // 2. Automatically Approve the Appointment
      await axios.put(`http://localhost:5000/api/appointments/status/${apptId}`, { 
        status: 'Approved' 
      });

      // 3. Generate the actual QR Code Pass
      const passRes = await axios.post(`http://localhost:5000/api/passes/generate/${apptId}`);
      
      // Save the generated image to display it
      setQrCode(passRes.data.pass.qrCodeData);
      setMessage('Pass generated successfully!');

    } catch (error) {
      setMessage('Error generating pass. Please make sure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', background: 'white', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>Issue Digital Pass</h2>
      <p style={{ color: '#555', marginBottom: '20px' }}>Select a registered visitor to approve their visit and generate a QR Code badge.</p>

      <select 
        onChange={(e) => setSelectedVisitor(e.target.value)} 
        value={selectedVisitor}
        style={{ width: '100%', padding: '12px', fontSize: '16px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
      >
        <option value="">-- Select a Visitor --</option>
        {visitors.map((visitor) => (
          <option key={visitor._id} value={visitor._id}>
            {visitor.name} ({visitor.purposeOfVisit})
          </option>
        ))}
      </select>

      <button 
        onClick={handleGeneratePass} 
        disabled={loading}
        style={{ padding: '12px 20px', fontSize: '16px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
      >
        {loading ? 'Generating...' : 'Issue Digital Pass'}
      </button>

      {message && <p style={{ marginTop: '20px', fontWeight: 'bold', color: message.includes('Error') ? 'red' : '#28a745' }}>{message}</p>}

      {/* This is where the magic happens: Displaying the base64 QR Code Image */}
      {qrCode && (
        <div style={{ marginTop: '30px', padding: '20px', border: '2px dashed #28a745', borderRadius: '10px', background: '#f8f9fa' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Official Visitor Badge</h3>
          <img src={qrCode} alt="Visitor QR Code" style={{ width: '200px', height: '200px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
          <p style={{ fontSize: '14px', color: 'gray', marginTop: '15px' }}>Scan at security desk for entry.</p>
        </div>
      )}
    </div>
  );
}

export default IssuePass;