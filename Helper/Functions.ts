import { existsSync } from "fs"
import { join } from "path"
import type { Browser } from "puppeteer"
import { evaluateSelectors } from "./DomUtils.ts"
import { getIframeInsideContainer } from "./IframeUtils.ts"
import { createLogFile, logToFile } from "./Logger.ts"
import type { configType } from "./Types.ts"

export function getBrowser(): string {

    const ProgramFiles = process.env["ProgramFiles"] || "C:\\Program Files"

    const browserPath = {
        chrome: join(ProgramFiles, "Google", "Chrome", "Application", "chrome.exe"),
        brave: join(ProgramFiles, "BraveSoftware", "Brave-Browser", "Application", "brave.exe")
    }

    if (existsSync(browserPath.brave)) {
        return browserPath.brave
    } else if (existsSync(browserPath.chrome)) {
        return browserPath.chrome
    } else {
        console.error("Neither Brave nor Chrome were found in the default installation path... Exiting...")
        process.exit(1)
    }

}

export async function Monitor(browser: Browser, config: configType, stockName: string) {
    const { name, baseURL, selectors } = config
    const logFile = createLogFile(name, stockName)

    try {
        const page = await browser.newPage()
        await page.goto(baseURL + stockName, { waitUntil: "networkidle2" })

        await page.exposeFunction("logValues", (values: Record<string, string>) =>
            logToFile(logFile, values)
        )

        const codeString = evaluateSelectors(selectors)

        if (name === "chart") {
            const frame = await getIframeInsideContainer(page, "tv-chart-container")
            await frame.waitForSelector(selectors[0]!.selector, { timeout: 15000 })

            await frame.evaluate(
                (code: string, selectors: { name: string; selector: string }[]) => {
                    const fn = new Function("selectors", code)
                    fn(selectors)
                },
                codeString,
                selectors
            )
        } else {
            await page.waitForSelector(selectors[0]!.selector, { timeout: 10000 })

            await page.evaluate(
                (code: string, selectors: { name: string; selector: string }[]) => {
                    const fn = new Function("selectors", code)
                    fn(selectors)
                },
                codeString,
                selectors
            )
        }
    } catch (error) {
        console.error(`Monitor Error [${name}/${stockName}]: ${error}`)
    }
}


