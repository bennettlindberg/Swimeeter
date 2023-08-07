import { useEffect, useRef, useState } from "react";

import { MainContent } from "../main_content/MainContent";
import { MainContentSection } from "../main_content/MainContentSection";
import { SideBar } from "../side_bar/SideBar";
import { SideBarSection } from "../side_bar/SideBarSection";
import { SideBarItem } from "../side_bar/SideBarItem";

// ~ component
export function ContentPage({
    title,
    primaryContent,
    secondaryContent
}: {
    title: string,
    primaryContent: {
        heading: string,
        icon: string,
        ref: React.RefObject<HTMLHeadingElement>,
        content: JSX.Element
    }[],
    secondaryContent?: JSX.Element[]
}) {
    // * initialize state variables
    const [containerHeight, setContainerHeight] = useState<number>(window.innerHeight);
    const [selectedSection, setSelectedSection] = useState<string>(primaryContent[0].heading || "none");
    const contentRef = useRef<HTMLDivElement>(null);

    // * determine height to reach bottom of page (to support scrollTo)
    useEffect(() => {
        const viewportHeight = window.innerHeight;
        const elementTop = contentRef.current?.offsetTop || 0;
        setContainerHeight(viewportHeight - elementTop);
    })

    // ~ for use in scroll handler below
    const contentRefArray: {
        heading: string,
        ref: React.RefObject<HTMLHeadingElement>
    }[] = [];

    // * construct primary content arrays
    const mainContentSections: React.ReactNode[] = [];
    const sideBarItems: React.ReactNode[] = [];

    for (const contentObj of primaryContent) {
        mainContentSections.push(
            <MainContentSection
                icon={contentObj.icon}
                heading={contentObj.heading}
                ref={contentObj.ref}
            >
                {contentObj.content}
            </MainContentSection>
        );

        sideBarItems.push(
            <SideBarItem
                icon={contentObj.icon}
                heading={contentObj.heading}
                isSelected={selectedSection === contentObj.heading}
                handleClick={() => {
                    contentObj.ref.current?.scrollIntoView({ behavior: "smooth" });
                    // setSelectedSection(contentObj.heading);
                }}
            />
        );

        contentRefArray.push({
            heading: contentObj.heading,
            ref: contentObj.ref
        });
    }

    // * construct second content array
    const sideBarSecondaries: React.ReactNode[] = [];

    if (secondaryContent) {
        for (const contentObj of secondaryContent) {
            sideBarSecondaries.push(
                <SideBarSection>
                    {contentObj}
                </SideBarSection>
            );
        }
    }

    // * define main content scroll handler
    function handleScroll(event: any) {
        const scrollLocation = event.target.scrollTop;

        let minDistanceFromTop: number = Infinity;
        let minDistanceSection: string = "none";

        for (const contentRefObj of contentRefArray) {
            const distanceFromTop = scrollLocation - (contentRefObj.ref.current?.offsetTop || 0);
            if (distanceFromTop > -50 && distanceFromTop < minDistanceFromTop) {
                minDistanceFromTop = distanceFromTop;
                minDistanceSection = contentRefObj.heading;
            }
        }

        setSelectedSection(minDistanceSection);
    }

    return (
        <>
            <div className="flex flex-row justify-center" ref={contentRef} style={{ height: `${containerHeight}px` }}>
                <div className="grid grid-rows-[max-content_1fr] grid-cols-4 w-[95%] gap-y-5 gap-x-[2.5%]">
                    <h1 className="col-span-4 col-start-1 row-span-1 row-start-1 text-5xl font-semibold">
                        {title}
                    </h1>
                    <SideBar>
                        <SideBarSection>
                            {sideBarItems}
                        </SideBarSection>
                        {sideBarSecondaries}
                    </SideBar>
                    <MainContent handleScroll={handleScroll}>
                        {mainContentSections}
                        <div className="h-[100px]"></div>
                    </MainContent>
                </div>
            </div>
        </>
    )
}