export function MainContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col gap-y-9 col-span-3 col-start-2 row-span-1 row-start-2">
                {children}
            </div>
        </>
    )
}