import { TableGrid } from "../tables/TableGrid.tsx";

// ~ component
export function HeatSheetHeatHeader({
    children,
    is_relay
}: {
    children: React.ReactNode,
    is_relay: boolean
}) {
    // * initialize state and navigation
    const interpretedButtonColor = "bg-slate-100 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 hover:dark:bg-slate-700 dark:border-slate-700";
    // const interpretedTextColor = "text-slate-400 dark:text-slate-500"
    // const interpretedFillColor = "fill-slate-400 dark:fill-slate-500"

    return (
        <>
            <tr>
                <td colSpan={2}>
                    <TableGrid>
                        <colgroup>
                            <col span={1} className="w-auto" />
                            <col span={1} className="w-auto" />
                            <col span={1} className="w-auto" />
                            <col span={1} className="w-auto" />
                        </colgroup>

                        <thead className={`group py-1 font-semibold text-xl ${interpretedButtonColor}`}>
                            <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 ${interpretedButtonColor}`}>
                                Lane
                            </td>
                            <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 ${interpretedButtonColor}`}>
                                {is_relay ? "Swimmers" : "Swimmer"}
                            </td>
                            <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 ${interpretedButtonColor}`}>
                                Team
                            </td>
                            <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 ${interpretedButtonColor}`}>
                                Seed Time
                            </td>
                        </thead>
                    {children}

                    </TableGrid>
                </td>
            </tr>
        </>
    )
}