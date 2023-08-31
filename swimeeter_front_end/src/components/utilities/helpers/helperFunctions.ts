export function convertStringParamToInt(id_STR: string) {
    let id_INT = -1;

    try {
        id_INT = parseInt(id_STR);
    } catch {
        return -1;
    }

    return id_INT
}

export function escapeRegexString(str: string) {
    let newString = "";

    for (const ch of str) {
        if (["^", "$", "\\", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", "|", "/"].find((escapedCh) => escapedCh === ch) !== undefined) {
            newString += "\\";
        }
        newString += ch;
    }

    return newString;
}