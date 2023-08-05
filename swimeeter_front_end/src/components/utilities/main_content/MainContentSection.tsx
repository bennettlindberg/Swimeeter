import { forwardRef, useContext } from 'react';

import { AppContext } from '../../../App.tsx';
import { IconSVG } from '../svgs/IconSVG.tsx';

// ~ component
export const MainContentSection = forwardRef(function MainContentSection({ icon, heading, children }: { 
    icon: string,
    heading: string, 
    children: React.ReactNode 
}, ref: React.ForwardedRef<HTMLHeadingElement>) {
    // * initialize context
    const { interpretedScreenMode }: { interpretedScreenMode: "light" | "dark" } = useContext(AppContext);
    
    return (
        <>
            <div className="flex flex-col gap-y-2">
                <div className="w-full border-t-2 border-black dark:border-white"></div>
                <div className="flex flex-row gap-x-4 items-center mt-4 mb-2">
                    <IconSVG icon={icon} color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[40px]" height="h-[40px]" />
                    <h2 className="text-3xl font-semibold" ref={ref}>
                        {heading}
                    </h2>
                </div>
                {children}
            </div>
        </>
    )
});