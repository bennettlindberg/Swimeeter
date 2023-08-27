export function BoldText({children}: {children: React.ReactNode}) {
    return (
        <span className="font-semibold underline">
            {children}
        </span>
    )
}