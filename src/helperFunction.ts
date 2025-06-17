export function GetWebSocketDebugger() {
    try {
        return fetch("http://localhost:9222/json/version")
            .then(response => response.json())
            .then(data => data.webSocketDebuggerUrl)
    } catch (error) {
        console.error(`Fetch websocket src failed - ${error}`)
    }
}

export function formatDateUTC(date) {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
