export function NavBarButton({ handleClick, children }: { handleClick: () => void, children: React.ReactNode }) {
    return (
        <button className="bg-transparent, hover:bg-sky-300 dark:hover:bg-blue-600 rounded-md px-1 py-1 text-2xl" onClick={handleClick}>
            {children}
        </button>
    )
}