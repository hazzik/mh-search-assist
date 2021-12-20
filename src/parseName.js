const nameRegExp = /^(?:([\w\s\.-]*?)\s+)?([\w\.-]+)\s*(?:\((?:(?:born|nee)\s+)?([\w\.\s-]+)\))?$/i;
export function parseName(name) {
    const [_, firstName, lastName, birthName] = nameRegExp.exec(name) || [];
    return { firstName, lastName, birthName };
}
