import { readFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"
import { getBrowser, Monitor } from "./Helper/Functions.ts"
import { launch, Browser } from "puppeteer"
import { cwd } from "process"
import { Stocks } from "./Helper/Stocks.ts"

const growwConfig = JSON.parse(readFileSync("./Source/Groww.json", "utf-8"))
const outDir = join(__dirname, "output")

if (!existsSync(outDir)) mkdirSync(outDir)

let browser: Browser | null = null

async function gracefulExit(signal: string) {
    console.log(`\nReceived ${signal}. Cleaning up...`)
    try {
        if (browser) {
            console.log("Closing browser...")
            await browser.close()
        }
    } catch (err) {
        console.error("Error closing browser:", err)
    }
    process.exit(0)
}

// Attach handlers early
process.on("SIGINT", () => gracefulExit("SIGINT"))
process.on("SIGTERM", () => gracefulExit("SIGTERM"))
process.on("exit", () => gracefulExit("exit"))
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err)
    gracefulExit("uncaughtException")
})

;(async () => {
    try {
        browser = await launch({
            executablePath: getBrowser(),
            userDataDir: join(cwd(), "user_data"),
            headless: false
        })

        const tasks = []

        for (const config of growwConfig) {
            for (const stock of Stocks) {
                tasks.push(Monitor(browser, config, stock))
            }
        }

        await Promise.all(tasks)
    } catch (error) {
        console.error(`Something went wrong - ${error}`)
        await gracefulExit("caught-error")
    }
})()
