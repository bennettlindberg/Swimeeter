export function NavBarButton({ handleClick, handleBlur, children }: { 
    handleClick: () => void, 
    handleBlur?: (event: any) => void,
    children: React.ReactNode 
}) {
    return (
        <button className="bg-transparent, hover:bg-sky-300 dark:hover:bg-blue-600 rounded-md px-1 py-1 text-2xl" onClick={handleClick} onBlur={handleBlur}>
            {children}
        </button>
    )
}