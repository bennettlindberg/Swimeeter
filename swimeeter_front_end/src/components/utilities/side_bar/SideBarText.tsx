export function SideBarText({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-xl text-slate-600 dark:text-slate-300">
            {children}
        </p>
    )
}