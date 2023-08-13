export function convertStringParamToInt(id_STR: string) {
    let id_INT = -1;

    try {
        id_INT = parseInt(id_STR);
    } catch {
        return -1;
    }

    return id_INT
}