import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [status, setStatus] = useState("please wait...");

  fetch("http://localhost:3000/api/health").then(res => {
    setStatus(res.status);
  })
 
  return (
    <>
      <h1>Energy monitor</h1>
      <p>{status.status == 200 ? "Backend OK" : status.status}</p>
    </>
  )
}

export default App
