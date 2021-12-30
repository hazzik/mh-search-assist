const nameRegExp = /^(?:([\w\s\.\"\-а-яё]*?)\s+)?([\w\.\"\-а-яё]+)\s*(?:\((?:(?:born|nee)\s+)?([\w\.\s\"\-а-яё]+)\))?(?:\s+\[[^]*\])?$/i;
export function parseName(name) {
    const [, firstName, lastName, birthName] = nameRegExp.exec(name) || [];
    return { firstName, lastName, birthName };
}
