import { appendFileSync, existsSync, mkdirSync } from "fs"
import { dirname, join } from "path"
import { cwd } from "process"

export function createLogFile(name: string, stock: string): string {
    const logFile = join(cwd(), "output", `${name}.txt`)
    const logDir = dirname(logFile)
    if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true })
    return logFile
}

export function logToFile(logFile: string, values: Record<string, string>) {
    const timestamp = new Date().toLocaleString()
    const clean = (val: string) => val.replace(/₹/g, "").replace(/\s+/g, " ").trim()

    const line = [...Object.values(values).map(clean), timestamp].join("|") + "\n"
    appendFileSync(logFile, line)
    console.info(`[LOG] - ${line.trim()}`)

    const keyValuePairs = Object.entries(values)
        .map(([key, value]) => `${key}: ${clean(value)}`)
    keyValuePairs.forEach(pair => console.log("  " + pair))
}
