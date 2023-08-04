export type ErrorType = {
    title: string,
    description: string
    fields?: string,
    recommendation?: string,
}

export type InfoType = {
    title: string,
    description: string,
    common_values?: string,
    permitted_values?: string,
    warning?: string
}

export type DuplicateType = {
    title: string,
    description: string,
    keep_both: boolean,
    keep_new: boolean,
}

export type DestructiveType = {
    title: string,
    description: string,
    impact: string,
    type?: string // used for duplicates when keep_new is chosen
}