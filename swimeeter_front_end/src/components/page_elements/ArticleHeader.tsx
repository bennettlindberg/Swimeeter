export function ArticleHeader({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-row">
                {children}
            </div>
        </>
    )
}