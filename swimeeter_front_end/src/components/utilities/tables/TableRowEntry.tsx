export function TableRowEntry({ children }: { children: React.ReactNode }) {
    return (
        <td className="px-2 first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 border-slate-200 dark:border-slate-700 group-hover:bg-slate-200 group-hover:dark:bg-slate-700">
            {children}
        </td>
    )
}