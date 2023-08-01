import { useEffect, useState } from "react";

// ~ component
export function ContentPage({ title, children }: { title: string, children: React.ReactNode }) {
    // * initialize state variables
    const [containerHeight, setContainerHeight] = useState<number>(window.innerHeight);

    // * determine height to reach bottom of page (to support scrollTo)
    useEffect(() => { 
        const viewportHeight = window.innerHeight;
        const elementTop = document.getElementById("content-page-container")?.offsetTop || 0;
        setContainerHeight(viewportHeight - elementTop);
    })
    
    return (
        <>
            <div id="content-page-container"  className="flex flex-row justify-center" style={{height: `${containerHeight}px`}}>
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