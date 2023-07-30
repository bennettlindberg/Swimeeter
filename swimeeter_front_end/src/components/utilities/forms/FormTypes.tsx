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