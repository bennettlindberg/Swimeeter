import { IconSVG } from "../svgs/IconSVG.tsx";
import { TableHeaderEntry } from "./TableHeaderEntry.tsx";

export function TableHeader({ isOpen, entries, handleClick }: {
    isOpen: boolean,
    entries: string[],
    handleClick: () => void
}) {
    return (
        <thead className="group bg-sky-100 dark:bg-blue-900 py-1 font-semibold text-xl text-sky-400 dark:text-blue-500" onClick={handleClick}>
            {entries.map(entry => <TableHeaderEntry key={entry}>{entry}</TableHeaderEntry>)}
            <td className="first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 border-sky-200 dark:border-blue-800 group-hover:bg-sky-200 group-hover:dark:bg-blue-800">
                {
                    isOpen
                        ? <IconSVG icon="ARROW_DOWN" color="fill-sky-400 dark:fill-blue-500" width="w-[20px]" height="h-[20px]" />
                        : <IconSVG icon="ARROW_RIGHT" color="fill-sky-400 dark:fill-blue-500" width="w-[20px]" height="h-[20px]" />
                }
            </td>
        </thead>
    )
}