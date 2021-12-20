export function parseEvent (str) {
    const [_, date, place] = /((?:(?:\w+\s+[\w]+)\s+)?\d+)(?:\s+-\s+(.*))?/.exec(str) || [];
    return [ 
        date?.replace(/Day|Month/g, '').replace(/\s+/g, ' ').trim() || '',
        place?.replace('Place', '') || ''
    ];
}