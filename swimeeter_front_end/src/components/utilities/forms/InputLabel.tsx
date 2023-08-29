export function InputLabel({inputId, text}: {
    inputId: string,
    text: string
}) {
    return (
        <label className="text-xl text-slate-600 dark:text-slate-300 whitespace-nowrap" htmlFor={inputId}>
            {text}
        </label>
    )
}