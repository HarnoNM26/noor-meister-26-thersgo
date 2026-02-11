import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [status, setStatus] = useState("please wait...");

  axios.get("https://localhost:3000/api/health", {
    signal: AbortSignal.timeout(5000)
  }).then(res => {
    setStatus(res.status);
  })

  return (
    <>
      <h1>Energy monitor</h1>
      <p>
        {status == 200 ? "Backend OK" : status}
      </p>
    </>
  )
}

export default App
