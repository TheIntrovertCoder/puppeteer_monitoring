export function GetWebSocketDebugger() {
    try {
        return fetch("http://localhost:9222/json/version")
            .then(response => response.json())
            .then(data => data.webSocketDebuggerUrl)
    } catch (error) {
        console.error(`Fetch websocket src failed - ${error}`)
    }
}
