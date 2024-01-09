export const getImg = (path) => {
    return new URL(`${path}`, import.meta.url).href
}