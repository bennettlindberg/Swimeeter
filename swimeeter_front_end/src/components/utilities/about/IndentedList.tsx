export function IndentedList({children}: {children: React.ReactNode}) {
    return (
        <ul className="pl-5">
            {children}
        </ul>
    )
}