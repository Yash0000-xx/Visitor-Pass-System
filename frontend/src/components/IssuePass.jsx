
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf'; 

function IssuePass() {
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitorId, setSelectedVisitorId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        
        const token = localStorage.getItem('token');
        const response = await axios.get('https://visitor-pass-backend-qhoo.onrender.com/api/visitors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVisitors(response.data);
      } catch (error) {
        console.error('Failed to fetch visitors');
      }
    };
    fetchVisitors();
  }, []);

  const handleGeneratePass = async () => {
    if (!selectedVisitorId) {
      setMessage('Please select a visitor first.');
      return;
    }

    setLoading(true);
    setQrCode('');
    setMessage('Processing appointment and generating secure QR code...');

    try {
  
      const apptRes = await axios.post('https://visitor-pass-backend-qhoo.onrender.com/api/appointments/request', {
        visitorId: selectedVisitorId,
        hostId: '64c1234567890abcdef12345', 
        date: new Date(),
        time: '10:00 AM'
      });
      const apptId = apptRes.data.appointment._id;

  
      await axios.put(`https://visitor-pass-backend-qhoo.onrender.com/api/appointments/status/${apptId}`, { status: 'Approved' });

   
      const passRes = await axios.post(`https://visitor-pass-backend-qhoo.onrender.com/api/passes/generate/${apptId}`);
      
      setQrCode(passRes.data.pass.qrCodeData);
      setMessage('Pass generated successfully!');

    } catch (error) {
      setMessage('Error generating pass. Are you logged in?');
    }
    setLoading(false);
  };


  const downloadPDFBadge = () => {
    
    const visitorDetails = visitors.find(v => v._id === selectedVisitorId);
    
   
    const doc = new jsPDF();

  
    doc.setFillColor(240, 240, 240);
    doc.rect(50, 40, 110, 150, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(50, 40, 110, 150, 'S'); 

    
    doc.setFillColor(44, 62, 80); 
    doc.rect(50, 40, 110, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("OFFICIAL VISITOR PASS", 105, 56, { align: "center" });

    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Name: ${visitorDetails.name}`, 105, 80, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Purpose: ${visitorDetails.purposeOfVisit}`, 105, 90, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 100, { align: "center" });

    doc.addImage(qrCode, 'PNG', 75, 110, 60, 60);

    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Scan at security desk upon entry and exit.", 105, 180, { align: "center" });

    doc.save(`${visitorDetails.name.replace(' ', '_')}_Pass.pdf`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', background: 'white', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>Issue Digital Pass</h2>

      <select 
        onChange={(e) => setSelectedVisitorId(e.target.value)} 
        value={selectedVisitorId}
        style={{ width: '100%', padding: '12px', fontSize: '16px', marginBottom: '20px', borderRadius: '5px' }}
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

      {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}

      {qrCode && (
        <div style={{ marginTop: '30px', padding: '20px', border: '2px dashed #28a745', borderRadius: '10px' }}>
          <h3>Official Visitor Badge</h3>
          <img src={qrCode} alt="Visitor QR Code" style={{ width: '150px', height: '150px' }} />
          <br/>
          <button 
            onClick={downloadPDFBadge}
            style={{ marginTop: '15px', padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Download PDF Badge
          </button>
        </div>
      )}
    </div>
  );
}

export default IssuePass;