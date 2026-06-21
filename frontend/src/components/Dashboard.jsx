import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchVisitors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
      
        const response = await axios.get(`https://visitor-pass-backend-qhoo.onrender.com/api/visitors?page=${currentPage}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
      
        setVisitors(response.data.visitors);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Access Denied. Please make sure you are logged in.');
        setLoading(false);
      }
    };

    fetchVisitors();
  }, [currentPage]); 

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          visitor.purposeOfVisit.toLowerCase().includes(searchTerm.toLowerCase());
    
    const visitorDate = new Date(visitor.createdAt).toISOString().split('T')[0];
    const matchesDate = filterDate ? visitorDate === filterDate : true;

    return matchesSearch && matchesDate;
  });

  const handleExportCSV = () => {
    if (filteredVisitors.length === 0) {
      alert("No data to export!");
      return;
    }

    let csvContent = "Name,Email,Phone,Purpose,Date Registered\n";

    filteredVisitors.forEach(v => {
      const date = new Date(v.createdAt).toLocaleDateString();
      csvContent += `"${v.name}","${v.email}","${v.phone}","${v.purposeOfVisit}","${date}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Visitor_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Dashboard</h2>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search name or purpose..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', flex: 1, minWidth: '200px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="date" 
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleExportCSV}
          style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Export to CSV
        </button>
      </div>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      {loading ? (
        <p>Loading visitor data...</p>
      ) : (
        <div style={{ overflowX: 'auto', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Phone</th>
                <th style={{ padding: '12px' }}>Purpose</th>
                <th style={{ padding: '12px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>No visitors found on this page.</td>
                </tr>
              ) : (
                filteredVisitors.map((visitor) => (
                  <tr key={visitor._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{visitor.name}</td>
                    <td style={{ padding: '12px' }}>{visitor.email}</td>
                    <td style={{ padding: '12px' }}>{visitor.phone}</td>
                    <td style={{ padding: '12px' }}>{visitor.purposeOfVisit}</td>
                    <td style={{ padding: '12px' }}>{new Date(visitor.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ padding: '8px 16px', background: currentPage === 1 ? '#ccc' : '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            
            <span style={{ fontWeight: 'bold' }}>Page {currentPage} of {totalPages}</span>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{ padding: '8px 16px', background: (currentPage === totalPages || totalPages === 0) ? '#ccc' : '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
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