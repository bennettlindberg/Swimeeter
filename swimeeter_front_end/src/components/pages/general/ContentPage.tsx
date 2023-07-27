export function ContentPage({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-row justify-center">
                <div className="grid grid-rows-[max-content_1fr] grid-cols-4 w-[95%] gap-y-5 gap-x-12">
                    <h1 className="col-span-4 col-start-1 row-span-1 row-start-1 text-5xl font-semibold">
                        {title}
                    </h1>
                    {children}
                </div>
            </div>
        </>
    )
}