export function NavDropItem({ handleClick, isSelected, children }: { handleClick: () => void, isSelected: boolean, children: React.ReactNode }) {
    return (
        <button className={`hover:bg-slate-200 dark:hover:bg-slate-700 ${isSelected ? "bg-sky-100 dark:bg-blue-900" : "bg-transparent"} text-black dark:text-white flex flex-row items-center gap-x-2 rounded-md p-1 w-full text-lg text-right`} onClick={handleClick}>
            {children}
        </button>
    )
}