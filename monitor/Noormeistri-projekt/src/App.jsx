import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [status, setStatus] = useState("please wait...");

  axios.get("http://localhost:3000/api/health").catch(err => {
    setStatus(err);
  }).then(res => {
    setStatus(res.status);
  })
 
  return (
    <>
      <h1>Energy monitor</h1>
      <p>{status == 200 ? "Backend OK" : status}</p>
    </>
  )
}

export default App
