import { TableGrid } from "../tables/TableGrid.tsx";

// ~ component
export function HeatSheetHeatHeader({
    children,
    is_relay
}: {
    children: React.ReactNode,
    is_relay: boolean
}) {
    return (
        <>
            <tr>
                <td className="pl-5 pr-0" colSpan={2}>
                    <TableGrid>
                        <colgroup>
                            <col span={1} className="w-auto" />
                            <col span={1} className="w-auto" />
                            <col span={1} className="w-auto" />
                            <col span={1} className="w-auto" />
                        </colgroup>

                        <thead className={`group py-1 font-semibold text-xl bg-slate-100 group-hover:bg-slate-200 border-slate-200 dark:bg-slate-800 group-hover:dark:bg-slate-700 dark:border-slate-700`}>
                            <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 bg-slate-100 group-hover:bg-slate-200 border-slate-200 dark:bg-slate-800 group-hover:dark:bg-slate-700 dark:border-slate-700`}>
                                Lane
                            </td>
                            <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 bg-slate-100 group-hover:bg-slate-200 border-slate-200 dark:bg-slate-800 group-hover:dark:bg-slate-700 dark:border-slate-700`}>
                                {is_relay ? "Swimmers" : "Swimmer"}
                            </td>
                            <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 bg-slate-100 group-hover:bg-slate-200 border-slate-200 dark:bg-slate-800 group-hover:dark:bg-slate-700 dark:border-slate-700`}>
                                Team
                            </td>
                            <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 bg-slate-100 group-hover:bg-slate-200 border-slate-200 dark:bg-slate-800 group-hover:dark:bg-slate-700 dark:border-slate-700`}>
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