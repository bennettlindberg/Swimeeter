import { IconSVG } from "../svgs/IconSVG.tsx";
import { TableRowEntry } from "./TableRowEntry.tsx";

export function TableRow({ entries, handleClick }: { 
    entries: string[], 
    handleClick: () => void 
}) {
    return (
        <tr className="group rounded-md even:bg-slate-50 odd:bg-transparent even:dark:bg-slate-800 odd:dark:bg-transparent py-1 text-lg" onClick={handleClick}>
            {entries.map(entry => <TableRowEntry>{entry}</TableRowEntry>)}
            <td className="first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 border-slate-200 dark:border-slate-700 group-hover:bg-slate-200 group-hover:dark:bg-slate-700">
                <IconSVG icon="ARROW_RIGHT" color="fill-black dark:fill-white" width="w-[20px]" height="h-[20px]" />
            </td>
        </tr>
    )
}