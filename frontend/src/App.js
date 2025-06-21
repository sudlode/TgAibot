import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const helloWorldApi = async () => {
    try {
      console.log("Making API call to:", `${API}/`);
      const response = await axios.get(`${API}/`);
      console.log("API response:", response.data);
      setMessage(response.data.message);
      setError(null);
    } catch (e) {
      console.error("API Error:", e);
      setMessage("API connection failed");
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://emergent.sh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" 
            alt="Emergent Logo"
            style={{width: '96px', height: '96px', borderRadius: '50%'}}
          />
        </a>
        <p className="mt-5" style={{fontSize: '1.25rem', marginTop: '1.25rem'}}>
          Building something incredible ~!
        </p>
        <div 
          className="mt-4 p-4" 
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: loading ? '#f3f4f6' : (error ? '#fee2e2' : '#dcfce7'),
            borderRadius: '0.5rem',
            maxWidth: '400px'
          }}
        >
          {loading ? (
            <p style={{color: '#374151'}}>Loading API...</p>
          ) : error ? (
            <p style={{color: '#dc2626'}}>Error: {error}</p>
          ) : (
            <p style={{color: '#16a34a'}}>✅ API Response: {message}</p>
          )}
        </div>
        
        <div style={{marginTop: '2rem'}}>
          <button 
            onClick={helloWorldApi}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Test API Connection
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;