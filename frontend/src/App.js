import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const helloWorldApi = async () => {
    try {
      console.log("Making API call to:", `${API}/`);
      const response = await axios.get(`${API}/`);
      console.log("API response:", response.data);
      setMessage(response.data.message);
    } catch (e) {
      console.error("API Error:", e);
      setMessage("API connection failed");
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
            className="w-24 h-24 rounded-full"
          />
        </a>
        <p className="mt-5 text-xl">Building something incredible ~!</p>
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          {loading ? (
            <p className="text-gray-700">Loading API...</p>
          ) : (
            <p className="text-green-700">API Response: {message}</p>
          )}
        </div>
      </header>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;