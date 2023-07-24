export function SideBar({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col">
                {children}
            </div>
        </>
    )
}