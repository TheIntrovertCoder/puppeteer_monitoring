export type configType = {
    name: string
    baseURL: string
    selectors: {name: string, selector: string}[]
}

export type selectorType = {
    name: string
    selector: string
}