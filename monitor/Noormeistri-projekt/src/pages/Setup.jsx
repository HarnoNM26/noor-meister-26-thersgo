import { useState, useEffect } from 'react';
import './Setup.css';
const PORT = 8080;

let times = 0

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
  
  console.log(times++, status);

  if (status.status != "ok") {
    return <>
      <p>{status.status || "Please hold..."}</p>
    </>
  } else {
    return <>
      <h1>Energy monitor</h1>
      <h2>Elering Price syncronizer</h2>
      <form method="POST" action={`http://localhost:${PORT}/api/sync/prices`}>
        <label htmlFor="start">start time: </label>
        <input type="datetime-local" name="date-start" id="date-start" />
        <br/>
        <label htmlFor="end">end time: </label>
        <input type="datetime-local" name="date-start" id="date-start" />
        <br/>
        <label htmlFor="fields">location:</label>
        <select id="location" name="location">
          <option value="EE">EE</option>
          <option value="LV">LV</option>
          <option value="LT">LT</option>
          <option value="FI">FI</option>
        </select>
        <br/>
        <input type="submit" value="Sync prices" />
      </form>
    </>
  }
}

export default App
