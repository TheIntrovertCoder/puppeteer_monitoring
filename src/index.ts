// noinspection SpellCheckingInspection

import puppeter from "puppeteer"
import excel from "exceljs"
import { elementsToMonitor } from "./elementsToMonitor";
import { GetWebSocketDebugger } from "./helperFunction";
import { Stocks } from "./stocksToMonitor";

Stocks.forEach(stock => MonitorStock(stock))

async function MonitorStock(stock: any) {
    try {
        // taken from http://localhost:9222/json/version unique for each session
        const browser = await puppeter.connect({
            browserWSEndpoint: await GetWebSocketDebugger()
        })

        const page = await browser.newPage();
        await page.goto(`https://groww.in/stocks/${stock}`, { waitUntil: "load" })

        await page.exposeFunction("onValueChanged", (id: string, value: Node) => {
            value != null && console.info(`${id} value changed: ${value}`)
        })

        for (const { selector } of elementsToMonitor) {
            await page.waitForSelector(selector, { timeout: 800 }).catch(error => console.info(`${error}`))
        }

        await page.evaluate((elements) => {
            elements.forEach(({ id, selector }) => {
                const el = document.querySelector(selector);
                if (!el) {
                    // @ts-ignore
                    window.onValueChanged(id, null);
                    return;
                }
                let lastValue = el.textContent;
                // @ts-ignore
                window.onValueChanged(id, lastValue);

                const observer = new MutationObserver(() => {
                    if (el.textContent !== lastValue) {
                        lastValue = el.textContent;
                        // @ts-ignore
                        window.onValueChanged(id, lastValue);
                    }
                });

                observer.observe(el, { childList: true, characterData: true, subtree: true });
            });
        }, elementsToMonitor);

    } catch (error) {
        console.error(`Something went wrong - ${error}`)
    }


};
