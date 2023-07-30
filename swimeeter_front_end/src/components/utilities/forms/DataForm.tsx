export function DataForm({children}: {children: React.ReactNode}) {
    return (
        <form className="flex flex-col gap-y-2">
            {children}
        </form>
    )
}