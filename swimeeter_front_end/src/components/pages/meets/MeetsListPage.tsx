import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

import { PublicMeetsTable } from "../../sections/meets_list_page/PublicMeetsTable.tsx";
import { MyMeetsTable } from "../../sections/meets_list_page/MyMeetsTable.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

// ~ component
export function MeetsListPage() {
    // * initialize context and navigation
    const { userState, navTreeDispatch, setTabTitle }: {
        userState: UserState,
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: [
                { title: "HOME", route: "/" },
                { title: "MEETS", route: "/meets" }
            ]
        })
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("Meets | Swimeeter"), []);

    // * create main content section refs
    const publicMeetsRef = useRef<HTMLHeadingElement>(null);
    const myMeetsRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <ContentPage
                title="Meets"
                primaryContent={[
                    {
                        heading: "Public Meets",
                        icon: "EARTH_GLOBE",
                        ref: publicMeetsRef,
                        content: (
                            <>
                                <PublicMeetsTable />
                            </>
                        )
                    },
                    {
                        heading: "My Meets",
                        icon: "CIRCLE_USER",
                        ref: myMeetsRef,
                        content: userState.logged_in
                            ? (
                                <>
                                    <MyMeetsTable />
                                </>
                            )
                            : (
                                <>
                                    <MainContentText>
                                        Log in or sign up for a Swimeeter account to create and view your own meets.
                                    </MainContentText>
                                    <div className="flex flex-row flex-wrap gap-x-2">
                                        <PageButton color="green" text="Log in" icon="USER_CHECK" handleClick={() => navigate("/log_in", { state: { forwardTo: "/settings" } })} />
                                        <PageButton color="green" text="Sign up" icon="USER_PLUS" handleClick={() => navigate("/sign_up", { state: { forwardTo: "/settings" } })} />
                                    </div>
                                </>
                            )
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            Want to build and customize a meet of your own?
                        </SideBarText>
                        <PageButton color="orange" text="Create a meet" icon="CIRCLE_PLUS" handleClick={() => navigate("/meets/create")} />
                    </>
                ]}
            />
        </>
    )
}