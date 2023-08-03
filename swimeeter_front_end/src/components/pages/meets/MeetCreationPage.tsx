import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";
import { MeetCreationForm } from "../../sections/creation_pages/MeetCreationForm.tsx";

// ~ component
export function MeetCreationPage() {
    // * initialize context and navigation
    const { userState, navTreeDispatch, setTabTitle }: {
        userState: UserState,
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // ? redirect to log in if logged out
    if (!userState.logged_in) {
        navigate("/log_in", { state: { forwardTo: "/meets/create" }, replace: true });
    }

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: [
                { title: "HOME", route: "/" },
                { title: "MEETS", route: "/meets" },
                { title: "CREATE MEET", route: "/meets/create" }
            ]
        })
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("Create Meet | Swimeeter"), []);

    // * create main content section refs
    const createMeetRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <ContentPage
                title="Create a Meet"
                primaryContent={[
                    {
                        heading: "Create a Meet",
                        icon: "CIRCLE_PLUS",
                        ref: createMeetRef,
                        content: (
                            <>
                                <MeetCreationForm />
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            After creating your new meet, you'll be able to add pools, teams, sessions, events, swimmers, and entries to your meet. 
                        </SideBarText>
                        <SideBarText>
                            <span className="text-yellow-400 dark:text-yellow-500">NOTE: </span>Meet begin and end times are calculated after meet creation based on your meet's sessions.
                        </SideBarText>
                    </>
                ]}
            />
        </>
    )
}