// noinspection SpellCheckingInspection

import puppeteer from "puppeteer";
import excel from "exceljs";
import { elementsToMonitor } from "./elementsToMonitor";
import { formatDateUTC, GetWebSocketDebugger } from "./helperFunction";
import { Stocks } from "./stocksToMonitor";

Stocks.forEach(stock => MonitorStock(stock));

async function MonitorStock(stock: string) {
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: await GetWebSocketDebugger()
        });

        const page = await browser.newPage();
        await page.goto(`https://groww.in/stocks/${stock}`, { waitUntil: "load" }).catch( error => console.error(`Page error: ${error}}`))

        const requiredFields = elementsToMonitor.map(e => e.id);

        const stockData: Record<string, any> = {};

        await page.exposeFunction("onValueChanged", (id: string, value: any) => {
            if (value == null || String(value) === "0.00") return;

            stockData[id] = value;
            stockData["timestamp"] = formatDateUTC(new Date())

            const hasAllFields = requiredFields.every(field => stockData[field] !== undefined);

            if (hasAllFields) {
                console.log(JSON.stringify(stockData));
            }
        });

        for (const { selector } of elementsToMonitor) {
            await page.waitForSelector(selector, { timeout: 800 }).catch(error => {});
        }

        // Start monitoring the elements for changes
        await page.evaluate((elements) => {
            elements.forEach(({ id, selector }) => {
                const el = document.querySelector(selector);
                // @ts-ignore
                window.onValueChanged(id, el ? el.textContent : null);

                if (!el) return;

                let lastValue = el.textContent;
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
        console.error(`Something went wrong - ${error}`);
    }
}
