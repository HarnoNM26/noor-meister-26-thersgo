import { useState, useEffect } from 'react';
import './App.css';
const PORT = 8080;

let times = 0

function App() {
  const [status, setStatus] = useState({});

  useEffect(() =>{
    fetch(`http://localhost:${PORT}/api/health`)
      .then(res => res.json())
      .then(res => setStatus(res))
  }, [])
  
  console.log(times++, status);

  return (
    <>
      <h1>Energy monitor</h1>
      <p>{
        status.status === "ok" ? "Backend OK!" :
        status.status
      }</p>
    </>
  )
}

export default App
