import type { selectorType } from "./Types.ts"

export function evaluateSelectors(selectors: selectorType[]): string {
    return `
        (function() {
            const selectorMap = ${JSON.stringify(
                selectors.reduce((acc, s) => ({ ...acc, [s.name]: s.selector }), {})
            )};

            const getText = el => el?.textContent?.trim() ?? 'Not found';

            const getAllValues = () => {
                const result = {};
                for (const key in selectorMap) {
                    const el = document.querySelector(selectorMap[key]);
                    result[key] = getText(el);
                }
                return result;
            };

            const observerChange = () => {
                for (const key in selectorMap) {
                    const el = document.querySelector(selectorMap[key]);
                    if (!el) continue;

                    const observer = new MutationObserver(() => {
                        window.logValues(getAllValues());
                    });

                    observer.observe(el, {
                        childList: true,
                        characterData: true,
                        subtree: true
                    });
                }

                window.logValues(getAllValues());
            };

            observerChange();
        })();
    `;
}
