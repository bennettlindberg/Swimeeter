import { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";
import { MeetTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

import { EventCreationForm } from "../../sections/creation_pages/EventCreationForm.tsx";

// ~ component
export function EventCreationPage() {
    // * initialize context and navigation
    const { userState, navTreeDispatch, setTabTitle }: {
        userState: UserState,
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize URL params
    const { meet_id, event_type } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    if (meet_id_INT === -1) {
        navigate("/errors/unknown");
    }
    if (event_type !== "individual" && event_type !== "relay") {
        navigate("/errors/unknown");
        return;
    }

    // ? redirect to log in if logged out
    if (!userState.logged_in) {
        navigate("/log_in", { state: { forwardTo: `/meets/${meet_id_INT}/events/${event_type}/create` }, replace: true });
    }

    // * update nav tree
    useEffect(() => {
        async function retrieveTreeData() {
            try {
                // @ make back-end request for tree data
                const response = await axios.get("/api/v1/info/",
                    {
                        params: {
                            info_needed: "relationship_tree",
                            model_type: "Meet",
                            model_id: meet_id_INT
                        }
                    });

                const treeData: MeetTree = response.data;
                navTreeDispatch({
                    type: "UPDATE_TREE",
                    data: [
                        { title: "HOME", route: "/" },
                        { title: "MEETS", route: "/meets" },
                        { title: treeData.MEET.title.toUpperCase(), route: treeData.MEET.route },
                        { title: `CREATE ${event_type === "individual" ? "AN INDIVIDUAL" : "A RELAY"} EVENT`, route: `${treeData.MEET.route}/events/${event_type}/create` }
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, [event_type]);

    // * update tab title
    useEffect(() => setTabTitle(`Create ${event_type === "individual" ? "an Individual" : "a Relay"} Event | Swimeeter`), [event_type]);

    // * create main content section refs
    const createEventRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <ContentPage
                title={`Create ${event_type === "individual" ? "an Individual" : "a Relay"} Event`}
                primaryContent={[
                    {
                        heading: "Creation Form",
                        icon: "EDIT_PAGE",
                        ref: createEventRef,
                        content: (
                            <>
                                <EventCreationForm meet_id_INT={meet_id_INT} event_type={event_type} scrollRef={createEventRef} />
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            After creating your new event, you'll be able to add entries associated with this event to your meet.
                        </SideBarText>
                    </>,
                    <>
                        <SideBarText>
                            Every event must be associated with a session. If no sessions exist yet, first add a session to this meet before adding events.
                        </SideBarText>
                    </>,
                    <>
                        <SideBarText>
                            {`Looking to create ${event_type === "individual" ? "a relay" : "an individual"} event instead?`}
                            <PageButton
                                color="primary"
                                text={`Create ${event_type === "individual" ? "a relay" : "an indiv."} event`}
                                icon="CIRCLE_PLUS"
                                handleClick={() => { navigate(`/meets/${meet_id_INT}/events/${event_type === "individual" ? "relay" : "individual"}/create`) }}
                            />
                        </SideBarText>
                    </>
                ]}
            />
        </>
    )
}