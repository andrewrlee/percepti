import c from 'ansi-colors'

export const zipWithPrevious = (as) => as.map((a, i) => [as[i - 1], a])

export const render = ({ name, items = [], display = i => i, include = () => true }) => {
    const toDisplay = items.filter(include).map(display)
    const text = toDisplay.length === 0 ? `Nothing to display` : `${toDisplay.join("\n\n")}`
    console.log(`${c.whiteBright(name)}:\n\n${text}\n`)
}