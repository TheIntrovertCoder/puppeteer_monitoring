// noinspection SpellCheckingInspection

import puppeter from "puppeteer"
import excel from "exceljs"

let stock = "cochin-shipyard-ltd"
stock = stock.trim().replace(/ /g, "-");

(async () => {

    // taken from http://localhost:9222/json/version unique for each session
    const browser = await puppeter.connect({
        browserWSEndpoint: "ws://localhost:9222/devtools/browser/9ab1fbe8-a098-4978-b08d-fa1325c7dde2"
    })

    const page = await browser.newPage();
    await page.goto(`https://groww.in/stocks/${stock}`, { waitUntil: "load" })
    
    await page.exposeFunction("onValueChanged", (id, value) => {
        console.log(`${id} value changed: ${value}`)
    })

    const elementsToMonitor = [
        {
            id: "Price",
            selector: "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > div.lpu38MainDiv > div.lpu38HeadWrap > div:nth-child(3) > div > div.lpu38Pri.valign-wrapper.false.displayBase > div"
        },
        {
            id: "currentPosition",
            selector: "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > div.lpu38MainDiv > div.lpu38HeadWrap > div:nth-child(3) > div > div.bodyBaseHeavy.contentPrimary"
        },
        {
            id: "openingPrice",
            selector: "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) > div.pbar29SubDiv.left-align > div.pbar29Value.bodyLarge > div > span"
        },
        {
            id: "todayHighest",
            selector: "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) > div.pbar29SubDiv.right-align > div.pbar29Value.bodyLarge > div > span"
        }, 
        {
            id: "volume",
            selector: "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div.col.l12.contentPrimary > div.row > div:nth-child(3) > span"
        }
    ]

    for (const { selector } of elementsToMonitor) {
        await page.waitForSelector(selector, { timeout: 5000 }).catch((error) => { console.error(`error: ${error}`) });
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

    await new Promise(() => {});

})();
