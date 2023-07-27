import { useEffect, useContext } from "react";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { ContentPage } from "./ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

import { MainContent } from "../../utilities/main_content/MainContent.tsx";
import { MainContentSection } from "../../utilities/main_content/MainContentSection.tsx";

import { SideBar } from "../../utilities/side_bar/SideBar.tsx";
import { SideBarSection } from "../../utilities/side_bar/SideBarSection.tsx";
import { SideBarItem } from "../../utilities/side_bar/SideBarItem.tsx";

// ~ component
export function AboutPage() {
    // * initialize context
    const { navTreeDispatch }: { navTreeDispatch: React.Dispatch<NavTreeAction> } = useContext(AppContext);

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: [
                { title: "HOME", route: "/" },
                { title: "ABOUT", route: "/about" }
            ]
        })
    });

    return (
        <>
            <ContentPage title="About">
                <SideBar>
                    <SideBarSection>
                        <SideBarItem icon="EARTH_GLOBE" heading="Overview" isSelected={true} handleClick={() => { }} />
                        <SideBarItem icon="DOC_BOOK" heading="Documentation" isSelected={false} handleClick={() => { }} />
                        <SideBarItem icon="TWO_USERS" heading="Credits" isSelected={false} handleClick={() => { }} />
                    </SideBarSection>
                    <SideBarSection>
                        <PageButton icon="EARTH_GLOBE" color="red" text="GitHub Repository" handleClick={() => { }} />
                        <PageButton color="orange" text="GitHub Repository" handleClick={() => { }} />
                        <PageButton color="yellow" text="GitHub Repository" handleClick={() => { }} />
                        <PageButton color="green" text="GitHub Repository" handleClick={() => { }} />
                        <PageButton color="primary" text="GitHub Repository" handleClick={() => { }} />
                        <PageButton color="purple" text="GitHub Repository" handleClick={() => { }} />
                        <PageButton color="slate" text="GitHub Repository" handleClick={() => { }} />
                    </SideBarSection>
                </SideBar>
                <MainContent>
                    <MainContentSection icon="EARTH_GLOBE" heading="Overview">
                        Hello
                    </MainContentSection>
                    <MainContentSection icon="DOC_BOOK" heading="Documentation">
                        Hello
                    </MainContentSection>
                    <MainContentSection icon="TWO_USERS" heading="Credits">
                        Hello
                    </MainContentSection>
                </MainContent>
            </ContentPage>
        </>
    )
}