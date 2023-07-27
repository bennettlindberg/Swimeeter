export function MainContentText({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-xl text-slate-600 dark:text-slate-200">
            {children}
        </p>
    )
}