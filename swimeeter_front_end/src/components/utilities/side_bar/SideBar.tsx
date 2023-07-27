export function SideBar({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col gap-y-5 row-span-1 row-start-2 col-span-1 col-start-1">
                {children}
            </div>
        </>
    )
}