export function MainContent({ children, handleScroll }: { 
    children: React.ReactNode, 
    handleScroll: (event: any) => void 
}) {
    return (
        <>
            <div className="flex flex-col gap-y-9 col-span-3 col-start-2 row-span-1 row-start-2 overflow-y-auto h-full relative no-scrollbar" onScroll={handleScroll}>
                {children}
            </div>
        </>
    )
}