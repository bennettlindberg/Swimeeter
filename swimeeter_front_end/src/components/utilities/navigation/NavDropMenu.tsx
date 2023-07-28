export function NavDropMenu({ selectedNavItem, nameForSelection, children }: { 
    selectedNavItem: "none" | "screen_mode" | "miscellaneous",
    nameForSelection: "screen_mode" | "miscellaneous"
    children: React.ReactNode 
}) {
    return (
        <div className="relative">
            <div id={nameForSelection} className={`${selectedNavItem === nameForSelection ? "visible" : "invisible"} bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 flex flex-col items-start rounded-md absolute right-[-5px] top-[20px] p-2 z-10`}>
                {children}
            </div>
        </div>
    )
}