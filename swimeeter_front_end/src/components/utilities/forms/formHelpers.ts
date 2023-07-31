export function convertRawData<RawType, FormattedType>(
    value: RawType,
    pairs: {
        raw: RawType,
        formatted: FormattedType
    }[]
): FormattedType | undefined {
    for (const pair of pairs) {
        if (value === pair.raw) {
            return pair.formatted;
        }
    }
    return undefined;
}