import puppeteer from "puppeteer"
import { elementsToMonitor } from "./elementsToMonitor"
import { formatDate, GetWebSocketDebugger } from "./helperFunction"
import { Stocks } from "./stocksToMonitor"

// Main entry point
;(async () => {
    await Promise.all(Stocks.map((stock) => MonitorStock(stock)))
})()

async function MonitorStock(stock: string) {
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: await GetWebSocketDebugger(),
        })

        const page = await browser.newPage()
        await page
            .goto(`https://groww.in/stocks/${stock}`, { waitUntil: "load" })
            .catch((error) => console.error(`Page error: ${error}`))

        const stockData: Record<string, any> = {}
        let lastOutput: string | null = null // Track last printed output

        const fieldsOrder = [
            "Name",
            "Price",
            "currentPosition",
            "lowestToday",
            "highestToday",
            "volume",
            "timestamp",
        ]

        // Fetch all monitored values and print if changed
        const fetchAndOutputAll = async () => {
            const allValues = await page.evaluate((elements) => {
                return elements.map(({ id, selector }) => {
                    const el = document.querySelector(selector)
                    return { id, value: el ? el.textContent : null }
                })
            }, elementsToMonitor)

            allValues.forEach(({ id, value }) => {
                if (value !== null && value !== "0.00") {
                    // Remove currency symbols and weird encodings
                    value = value.replace(/₹|â‚¹/g, "").trim()
                    stockData[id] = value
                }
            })
            stockData["timestamp"] = formatDate(new Date())

            const outputLine = fieldsOrder
                .map((key) => stockData[key] ?? "")
                .join("|")

            // Only print if changed
            if (outputLine !== lastOutput) {
                console.log(outputLine)
                lastOutput = outputLine
            }
        }

        // Expose a function to the page context to trigger data fetch
        await page.exposeFunction(
            "onValueChanged",
            async (id: string, value: string) => {
                if (value == null || String(value) === "0.00") return
                await fetchAndOutputAll()
            }
        )

        // Wait for all selectors to appear
        for (const { selector } of elementsToMonitor) {
            await page
                .waitForSelector(selector, { timeout: 800 })
                .catch(() => {})
        }

        // Set up MutationObservers for all monitored elements
        await page.evaluate((elements) => {
            elements.forEach(({ id, selector }) => {
                const el = document.querySelector(selector)
                // @ts-ignore
                window.onValueChanged(id, el ? el.textContent : null)

                if (!el) return

                let lastValue = el.textContent
                const observer = new MutationObserver(() => {
                    if (el.textContent !== lastValue) {
                        lastValue = el.textContent
                        // @ts-ignore
                        window.onValueChanged(id, lastValue)
                    }
                })

                observer.observe(el, {
                    childList: true,
                    characterData: true,
                    subtree: true,
                })
            })
        }, elementsToMonitor)

        // Initial fetch and print
        await fetchAndOutputAll()
    } catch (error) {
        console.error(`Something went wrong - ${error}`)
    }
}
