export function MainContent({ children, handleScroll }: { 
    children: React.ReactNode, 
    handleScroll: (event: any) => void 
}) {
    return (
        <>
            <div className="flex flex-col gap-y-9 col-span-1 col-start-1 lg:col-span-3 lg:col-start-2 row-span-1 row-start-3 lg:row-start-2 overflow-y-auto h-full relative" onScroll={handleScroll}>
                {children}
            </div>
        </>
    )
}