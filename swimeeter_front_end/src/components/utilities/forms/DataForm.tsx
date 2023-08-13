export function DataForm({children}: {children: React.ReactNode}) {
    return (
        <form className="flex flex-col gap-y-3 relative">
            {children}
        </form>
    )
}