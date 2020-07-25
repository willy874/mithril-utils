/**
 * 圖片placeholder
 * @param {*} options width, height
 */
export default function Holder(options) {
    options.fontSize = (options.fontSize) ? options.fontSize : 12
    const svg = `<svg width="${options.width}" height="${options.height}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${options.width}" height="${options.height}" style="fill:#dedede;"/><text x="50%" y="50%" font-size="${options.fontSize}" text-anchor="middle" alignment-baseline="middle" font-family="monospace, sans-serif" fill="#535353">${options.width}x${options.height}</text></svg>`
    const encodedData = window.btoa(svg)
    return `data:image/svg+xml;base64,${encodedData}`

}