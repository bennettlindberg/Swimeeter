import { useContext, useEffect, useRef } from "react";

import { AppContext, NavTreeAction } from "../../../App.tsx";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { DescriptionText } from "../../sections/about_page/DescriptionText.tsx";
import { TechnologiesText } from "../../sections/about_page/TechnologiesText.tsx";
import { CreditsText } from "../../sections/about_page/CreditsText.tsx";

// ~ component
export function AboutPage() {
    // * initialize context
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: [
                { title: "HOME", route: "/" },
                { title: "ABOUT", route: "/about" }
            ]
        })
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("About | Swimeeter"), []);

    // * create main content section refs
    const descriptionRef = useRef<HTMLHeadingElement>(null);
    const technologiesRef = useRef<HTMLHeadingElement>(null);
    const creditsRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <ContentPage
                title="About"
                primaryContent={[
                    {
                        heading: "Site Description",
                        icon: "DOC_BOOK",
                        ref: descriptionRef,
                        content: <DescriptionText />
                    },
                    {
                        heading: "Technologies",
                        icon: "COMPUTER",
                        ref: technologiesRef,
                        content: <TechnologiesText />
                    },
                    {
                        heading: "Credits",
                        icon: "TWO_USERS",
                        ref: creditsRef,
                        content: <CreditsText />
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            You are viewing Swimeeter version 1.0.0.
                        </SideBarText>
                    </>,
                    <>
                        <SideBarText>
                            Want to view Swimeeter's source code?
                        </SideBarText>
                        <a href="https://github.com/bennettlindberg/Swimeeter" target="_blank" rel="noopener noreferrer" className="w-fit h-fit">
                            <PageButton color="slate" text="GitHub repository" icon="LINK" handleClick={() => {}}/>
                        </a>
                    </>
                ]}
            />
        </>
    )
}