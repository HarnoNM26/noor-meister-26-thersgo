import { useState, useEffect } from 'react';
import MonitorView from './MonitorView';
const PORT = 8080;

function App() {
  const [status, setStatus] = useState({});

  useEffect(() =>{
    fetch(`http://localhost:${PORT}/api/health`)
      .catch(err => setStatus({
        "status": "server unreachable :/"
      }))
      .then(res => res.json())
      .then(res => setStatus(res))
  }, [])
  
  if (status.status != "ok") {
    return <>
      <p>{status.status || "Please hold..."}</p>
    </>
  } else {
    return <MonitorView />
  }
}

export default App
