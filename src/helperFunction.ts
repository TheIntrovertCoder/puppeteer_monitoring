export interface Elements {
    id: string
    selector: string
    value?: string
}

export function GetWebSocketDebugger() {
    try {
        return fetch("http://localhost:9222/json/version")
            .then((response) => response.json())
            .then((data) => data.webSocketDebuggerUrl)
    } catch (error) {
        console.error(`Fetch websocket src failed - ${error}`)
    }
}

export function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0")
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    const milliseconds = String(date.getMilliseconds()).padStart(2, "0")
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}:${milliseconds}`
}
