import { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";

function Dashboard() {
    const [visList, setVisList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    
    const [searchVal, setSearchVal] = useState('');
    const [dateVal, setDateVal] = useState('');
    
    const [page, setPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);

    useEffect(() => {
        const getVisitors = async () => {
            setLoading(true);
            try {
                let savedToken = localStorage.getItem('token');
                let backendLink = import.meta.env.VITE_API_URL + '/api/visitors?page=' + page + '&limit=10';
                
                let res = await axios.get(backendLink, {
                    headers: { Authorization: 'Bearer ' + savedToken }
                });
                
                setVisList(res.data.visitors);
                setMaxPages(res.data.totalPages);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setErrorMsg('Could not load data. Are you logged in?');
                setLoading(false);
            }
        };

        getVisitors();
    }, [page]); 

    let showList = visList.filter((v) => {
        let textMatch = v.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                        v.purposeOfVisit.toLowerCase().includes(searchVal.toLowerCase());
        
        let vDate = new Date(v.createdAt).toISOString().split('T')[0];
        let dateMatch = dateVal ? vDate === dateVal : true;

        return textMatch && dateMatch;
    });

    const downloadCSV = () => {
        if (showList.length === 0) {
            alert("Nothing to export");
            return;
        }

        let myCsv = "Name,Email,Phone,Purpose,Date\n";

        showList.forEach(v => {
            let d = new Date(v.createdAt).toLocaleDateString();
            myCsv += `"${v.name}","${v.email}","${v.phone}","${v.purposeOfVisit}","${d}"\n`;
        });

        let myBlob = new Blob([myCsv], { type: 'text/csv;charset=utf-8;' });
        let myLink = document.createElement("a");
        myLink.href = URL.createObjectURL(myBlob);
        myLink.setAttribute("download", "Visitors.csv");
        document.body.appendChild(myLink);
        myLink.click();
        document.body.removeChild(myLink);
    };

    const downloadPDF = (visData) => {
        let doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("OFFICIAL VISITOR BADGE", 20, 20);
        
        doc.setFontSize(12);
        doc.text("Name: " + visData.name, 20, 40);
        doc.text("Email: " + visData.email, 20, 50);
        doc.text("Phone: " + visData.phone, 20, 60);
        doc.text("Purpose: " + visData.purposeOfVisit, 20, 70);
        
        doc.rect(15, 10, 120, 70);
        
        doc.save(visData.name + "_Badge.pdf");
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Admin Dashboard</h2>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    placeholder="Search name or purpose" 
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    style={{ padding: '10px', flex: 1, border: '1px solid #ccc' }}
                />
                <input 
                    type="date" 
                    value={dateVal}
                    onChange={(e) => setDateVal(e.target.value)}
                    style={{ padding: '10px', border: '1px solid #ccc' }}
                />
                <button 
                    onClick={downloadCSV}
                    style={{ padding: '10px 15px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Export CSV
                </button>
            </div>

            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ background: 'white', padding: '15px', border: '1px solid #ccc' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#eee', borderBottom: '2px solid #ccc' }}>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>Email</th>
                                <th style={{ padding: '10px' }}>Phone</th>
                                <th style={{ padding: '10px' }}>Purpose</th>
                                <th style={{ padding: '10px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '10px', textAlign: 'center' }}>No visitors found.</td>
                                </tr>
                            ) : (
                                showList.map((v) => (
                                    <tr key={v._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{v.name}</td>
                                        <td style={{ padding: '10px' }}>{v.email}</td>
                                        <td style={{ padding: '10px' }}>{v.phone}</td>
                                        <td style={{ padding: '10px' }}>{v.purposeOfVisit}</td>
                                        <td style={{ padding: '10px' }}>
                                            <button 
                                                onClick={() => downloadPDF(v)}
                                                style={{ padding: '5px 10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}
                                            >
                                                PDF Badge
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                        <button 
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Back
                        </button>
                        
                        <span>Page {page} of {maxPages}</span>
                        
                        <button 
                            onClick={() => setPage(page + 1)}
                            disabled={page === maxPages || maxPages === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;