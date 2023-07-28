export function TableGrid({ children }: { children: React.ReactNode }) {
    return (
        <>
            <table className="border-spacing-y-1 border-separate">
                {children}
            </table>
        </>
    )
}