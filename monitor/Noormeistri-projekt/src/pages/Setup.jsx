import { useState, useEffect } from 'react';
import './Setup.css';
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
  
  const sendSync = e => {
      const form = new FormData(e.target);
      let start = form.get("start")
      let end = form.get("end")

      fetch(
        `http://localhost:${PORT}/api/sync/prices?`
          + "start="   + (start ? start + "T00:00Z" : "")
          + "&end="    + (end ? end + "T00:00Z" : "")
          + "&fields=" + form.get("location"),
      {
        "method": "POST"
      })

      console.log("sending!")

      return false
  };

  if (status.status != "ok") {
    return <>
      <p>{status.status || "Please hold..."}</p>
    </>
  } else {
    return <>
      <h1>Energy monitor</h1>
      <h2>Elering Price syncronizer</h2>
      <form onSubmit={sendSync}>
        <label htmlFor="start">start time: </label>
        <input type="date" name="start" id="start" />
        <br/>
        <label htmlFor="end">end time: </label>
        <input type="date" name="end" id="end" />
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
