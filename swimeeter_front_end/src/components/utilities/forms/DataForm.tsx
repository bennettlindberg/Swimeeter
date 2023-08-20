export function DataForm({
    children, 
    idPrefix
}: {
    children: React.ReactNode,
    idPrefix?: string
}) {
    return (
        <form 
        className="flex flex-col gap-y-3 relative"
        id={idPrefix + "-form"}
        >
            {children}
        </form>
    )
}