import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

function QRScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('Check-In');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText) {
  
      const isValidMongoId = /^[a-fA-F0-9]{24}$/.test(decodedText);
      
      if (!isValidMongoId) {
        setMessage('Invalid QR Code Format. This is not a system-generated pass.');
        return; 
      }

      scanner.clear(); 
      setScanResult(decodedText);
      setMessage(''); 
    }

    function onScanFailure(error) {
     
    }

    return () => {
      scanner.clear().catch(err => console.error(err));
    };
  }, []);

  const handleProcessScan = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('https://visitor-pass-backend-qhoo.onrender.com/api/checklog/scan', {
        passId: scanResult,
        action: action
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(response.data.message);
      setScanResult(null); 
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to process scan. Is this a valid pass?');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
      <h2>Security: Scan Pass</h2>
      
      {message && <p style={{ fontWeight: 'bold', color: message.includes('Failed') || message.includes('Invalid') ? 'red' : 'green' }}>{message}</p>}

      {!scanResult ? (
        <div id="reader" style={{ width: '100%', marginTop: '20px' }}></div>
      ) : (
        <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #28a745', borderRadius: '8px' }}>
          <h3>Valid Pass Detected!</h3>
          <p style={{ fontSize: '12px', color: 'gray' }}>ID: {scanResult}</p>
          
          <div style={{ margin: '20px 0' }}>
            <label style={{ marginRight: '15px', fontWeight: 'bold' }}>
              <input type="radio" value="Check-In" checked={action === 'Check-In'} onChange={(e) => setAction(e.target.value)} /> Check-In
            </label>
            <label style={{ fontWeight: 'bold' }}>
              <input type="radio" value="Check-Out" checked={action === 'Check-Out'} onChange={(e) => setAction(e.target.value)} /> Check-Out
            </label>
          </div>

          <button onClick={handleProcessScan} style={{ padding: '10px 20px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
            Confirm {action}
          </button>
          
          <button onClick={() => setScanResult(null)} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '10px' }}>
            Cancel / Scan Again
          </button>
        </div>
      )}
    </div>
  );
}

export default QRScanner;