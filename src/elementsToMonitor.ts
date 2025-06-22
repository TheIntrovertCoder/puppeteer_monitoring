import { Elements } from "./helperFunction"

export const elementsToMonitor: Elements[] = [
    {
        id: "Name",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > div.lpu38MainDiv > div.lpu38HeadWrap > div:nth-child(2) > div:nth-child(1) > h1",
    },
    {
        id: "Price",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > div.lpu38MainDiv > div.lpu38HeadWrap > div:nth-child(3) > div > div.lpu38Pri.valign-wrapper.false.displayBase > div",
    },
    {
        id: "Current_Status",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > div.lpu38MainDiv > div.lpu38HeadWrap > div:nth-child(3) > div > div.bodyBaseHeavy",
    },
    {
        id: "Lowest_Today",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) > div.pbar29SubDiv.left-align > div.pbar29Value.bodyLarge > div > span",
    },
    {
        id: "Highest_Today",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) > div.pbar29SubDiv.right-align > div.pbar29Value.bodyLarge > div > span",
    },
    {
        id: "Previous_Open",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div.col.l12.contentPrimary > div.row > div:nth-child(1) > span",
    },
    {
        id: "Previous_Close",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div.col.l12.contentPrimary > div.row > div:nth-child(2) > span",
    },
    {
        id: "Volume",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div.col.l12.contentPrimary > div.row > div:nth-child(3) > span",
    },
    {
        id: "Upper_Circuit",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div.col.l12.contentPrimary > div.row > div:nth-child(5) > span",
    },
    {
        id: "Lower_Circuit",
        selector:
            "#root > div:nth-child(2) > div.container.web-align > div > div > div.pw14ContentWrapper.backgroundPrimary.layout-main.width100 > div > section:nth-child(4) > div > div.col.l12.contentPrimary > div.row > div:nth-child(6) > span",
    },
]
