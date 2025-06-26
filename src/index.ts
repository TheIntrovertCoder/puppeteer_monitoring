import puppeteer, { Page } from "puppeteer"
import { elementsToMonitor } from "./elementsToMonitor"
import { Elements, formatDate, GetWebSocketDebugger } from "./helperFunction"
import { Stocks } from "./stocksToMonitor"

// Main entry point
;(async () => {
    await Promise.allSettled(Stocks.map((stock) => MonitorStock(stock)))
})()

async function MonitorStock(stock: string) {
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: await GetWebSocketDebugger(),
        })

        const page: Page = await browser.newPage()
        await page
            .goto(`https://groww.in/stocks/${stock}`, { waitUntil: "load" })
            .catch((error: Error) => console.error(`Page error: ${error}`))

        const stockData: Record<string, any> = {}
        let lastOutput: string | null = null // Track last printed output

        const fieldsOrder = elementsToMonitor.map((element) => element.id)
        fieldsOrder.push("timestamp")
        fieldsOrder.push("Volume Difference")

        // Fetch all monitored values and print if changed
        const fetchAndOutputAll = async () => {
            const allValues = await page.evaluate((elements: Elements[]) => {
                return elements.map(({ id, selector }) => {
                    const el = document.querySelector(selector)
                    console.info(`${id}} - ${el?.textContent}`)
                    return { id, value: el ? el.textContent : id }
                })
            }, elementsToMonitor)

            let old_volume = 0
            allValues.forEach(({ id, value }) => {
                if (value != null && value !== "" && value !== "0.00") {
                    value = value.replace(/₹|â‚¹/g, "").trim()
                    if (id === "Volume") {
                        // Remove commas before converting to number
                        const numericValue = Number(value.replace(/,/g, ""))
                        if (numericValue !== old_volume) {
                            stockData["Volume Difference"] =
                                old_volume - numericValue
                            old_volume = numericValue
                        }
                        stockData["Volume Difference"] = old_volume
                    } else {
                        stockData[id] = value
                    }
                    stockData["timestamp"] = formatDate(new Date())
                }
            })

            const outputLine = fieldsOrder
                .map((key) => stockData[key])
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
        await page.evaluate((elements: Elements[]) => {
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

        process.on("SIGTERM", () => browser.close())

        process.on("SIGINT", () => browser.close())
    } catch (error) {
        console.error(`Something went wrong - ${error}`)
    }
}
