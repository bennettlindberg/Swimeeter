import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

import { PublicMeetsTable } from "../../sections/meets_list_page/PublicMeetsTable.tsx";
import { MyMeetsTable } from "../../sections/meets_list_page/MyMeetsTable.tsx";

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
                        icon: "USER_CHECK",
                        ref: publicMeetsRef,
                        content: (
                            <>
                                <PublicMeetsTable />
                            </>
                        )
                    },
                    {
                        heading: "My Meets",
                        icon: "USER_CHECK",
                        ref: myMeetsRef,
                        content: (
                            <>
                                <MyMeetsTable />
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        <PageButton color="orange" text="Create a meet" icon="CIRCLE_PLUS" handleClick={() => navigate("/meets/create")} />
                    </>
                ]}
            />
        </>
    )
}