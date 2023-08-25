import { useNavigate } from "react-router-dom";

import { TableRowEntry } from "../tables/TableRowEntry.tsx";

// ~ component
export function HeatSheetLaneEntry({
    lane,
    name,
    team,
    seed_time
}: {
    lane: number,
    name: string,
    team: string,
    seed_time: string,
}) {
    // * initialize navigation
    const navigate = useNavigate();

    return (
        <tr className="group rounded-md even:bg-slate-50 odd:bg-transparent even:dark:bg-slate-800 odd:dark:bg-transparent py-1 text-lg">
            <TableRowEntry>{lane}</TableRowEntry>
            <TableRowEntry>{name}</TableRowEntry>
            <TableRowEntry>{team}</TableRowEntry>
            <TableRowEntry>{seed_time}</TableRowEntry>
        </tr>
    )
}