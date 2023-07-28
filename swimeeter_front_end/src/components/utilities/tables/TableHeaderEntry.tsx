export function TableHeaderEntry({ children }: { children: React.ReactNode }) {
    return (
        <td className="first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 border-sky-200 dark:border-blue-800 group-hover:bg-sky-200 group-hover:dark:bg-blue-800">
            {children}
        </td>
    )
}