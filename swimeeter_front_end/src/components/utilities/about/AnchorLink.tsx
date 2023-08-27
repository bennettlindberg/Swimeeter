export function AnchorLink({text, href}: {text: string, href: string}) {
    return (
        <>
            <a href={href} target="_blank" className="rounded-md decoration-sky-400 dark:decoration-blue-500 underline underline-offset-1 decoration-wavy decoration-2 hover:bg-sky-200 hover:dark:bg-blue-800 text-sky-700 dark:text-blue-200">{text}</a>
        </>
    )
}