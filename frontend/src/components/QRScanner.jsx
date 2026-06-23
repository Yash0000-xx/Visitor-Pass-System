import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

function QRScanner() {
    const [scannedData, setScannedData] = useState(null);
    const [statusText, setStatusText] = useState('');
    const [scanAction, setScanAction] = useState('Check-In');

    useEffect(() => {
        let myScanner = new Html5QrcodeScanner('qr-reader', {
            qrbox: { width: 250, height: 250 },
            fps: 5,
        });

        myScanner.render(
            (resultString) => {
                myScanner.clear();
                setScannedData(resultString);
                setStatusText('');
            },
            (err) => {
                
            }
        );

        return () => {
            myScanner.clear().catch(e => console.log(e));
        };
    }, []);

    const sendScanToDatabase = async () => {
        try {
            let myToken = localStorage.getItem('token');
            let backendLink = import.meta.env.VITE_API_URL + '/api/checklog/scan';
            
            let finalId = scannedData;
            
            if (scannedData.includes('{')) {
                try {
                    let parsedData = JSON.parse(scannedData);
                    finalId = parsedData.passId || parsedData.appointmentId || parsedData._id || scannedData;
                } catch (e) {
                    console.log("Not a JSON QR code");
                }
            }

            let res = await axios.post(backendLink, {
                passId: finalId,
                action: scanAction
            }, {
                headers: { Authorization: 'Bearer ' + myToken }
            });

            setStatusText(res.data.msg || "Scan recorded!");
            setScannedData(null); 
            
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.error) {
                setStatusText(err.response.data.error);
            } else {
                setStatusText("Scan failed. Is this pass expired or invalid?");
            }
        }
    };

    const resetScanner = () => {
        setScannedData(null);
        setStatusText('');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}>
            <h2>Security Desk Scanner</h2>
            
            {statusText && (
                <p style={{ 
                    fontWeight: 'bold', 
                    color: statusText.includes('failed') || statusText.includes('expired') || statusText.includes('invalid') ? 'red' : 'green' 
                }}>
                    {statusText}
                </p>
            )}

            {!scannedData ? (
                <div id="qr-reader" style={{ width: '100%', marginTop: '15px' }}></div>
            ) : (
                <div style={{ marginTop: '20px', padding: '15px', border: '2px solid green', borderRadius: '5px' }}>
                    <h3>QR Code Captured!</h3>
                    <p style={{ fontSize: '12px', color: 'gray', wordWrap: 'break-word' }}>
                        Raw Data: {scannedData}
                    </p>
                    
                    <div style={{ margin: '20px 0' }}>
                        <label style={{ marginRight: '15px', fontWeight: 'bold' }}>
                            <input 
                                type="radio" 
                                value="Check-In" 
                                checked={scanAction === 'Check-In'} 
                                onChange={(e) => setScanAction(e.target.value)} 
                            /> 
                            Check-In
                        </label>
                        
                        <label style={{ fontWeight: 'bold' }}>
                            <input 
                                type="radio" 
                                value="Check-Out" 
                                checked={scanAction === 'Check-Out'} 
                                onChange={(e) => setScanAction(e.target.value)} 
                            /> 
                            Check-Out
                        </label>
                    </div>

                    <button 
                        onClick={sendScanToDatabase} 
                        style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer', width: '100%', marginBottom: '10px' }}
                    >
                        Confirm {scanAction}
                    </button>
                    
                    <button 
                        onClick={resetScanner} 
                        style={{ padding: '10px 20px', background: 'red', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}
                    >
                        Cancel & Scan Another
                    </button>
                </div>
            )}
        </div>
    );
}

export default QRScanner;