export function SideBarItem({ children, handleClick }: { children: React.ReactNode, handleClick: () => {} } ) {
    return (
        <>
            <div className="flex flex-row" onClick={handleClick}>
                {children}
                <p>{"   >"}</p>
            </div>
        </>
    )
}