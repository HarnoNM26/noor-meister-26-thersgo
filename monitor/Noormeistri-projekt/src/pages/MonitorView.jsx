const PORT = 8080;

function MonitorView() {
  const sendSync = event => {
    event.preventDefault();
    console.log("sending!")

    const form = new FormData(event.target);
    fetch(
      `http://localhost:${PORT}/api/sync/prices?`
        + "start="   + (form.start ? form.start + "T00:00Z" : "")
        + "&end="    + (form.end ? form.end + "T00:00Z" : "")
        + "&fields=" + form.location,
    {
      "method": "POST"
    })

    return false
  };

  return <div>
    <h1>Energy monitor</h1>
    <h2>Elering Price syncronizer</h2>
    <form id="sync" onSubmit={sendSync}>
      <label htmlFor="start">start time: </label>
      <input type="date" name="start" id="start" />
      <br/>
      <label htmlFor="end">end time: </label>
      <input type="date" name="end" id="end" />
      <br/>
      <label htmlFor="fields">location: </label>
      <select id="location" name="location">
        <option value="EE">EE</option>
        <option value="LV">LV</option>
        <option value="LT">LT</option>
        <option value="FI">FI</option>
      </select>
      <br/>
      <input type="submit" value="Sync prices" />
    </form>
  </div>
};

export default MonitorView;
