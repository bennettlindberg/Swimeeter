import { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";
import { MeetTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

import { RelayEntryCreationForm } from "../../sections/creation_pages/RelayEntryCreationForm.tsx";

// ~ component
export function RelayEntryCreationPage() {
    // * initialize context and navigation
    const { userState, navTreeDispatch, setTabTitle }: {
        userState: UserState,
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize URL params
    const { meet_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    if (meet_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // ? redirect to log in if logged out
    if (!userState.logged_in) {
        navigate("/log_in", { state: { forwardTo: `/meets/${meet_id_INT}/relay_entries/create` }, replace: true });
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
                        { title: "CREATE A RELAY ENTRY", route: `${treeData.MEET.route}/relay_entries/create` }
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                console.log(error)
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("Create a Relay Entry | Swimeeter"), []);

    // * create main content section refs
    const createRelayEntryRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <ContentPage
                title="Create a Relay Entry"
                primaryContent={[
                    {
                        heading: "Creation Form",
                        icon: "EDIT_PAGE",
                        ref: createRelayEntryRef,
                        content: (
                            <>
                                <RelayEntryCreationForm meet_id_INT={meet_id_INT} scrollRef={createRelayEntryRef} />
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            After creating your new entry, you'll be able to generate heat sheet seeding for the entry's event.
                        </SideBarText>
                    </>,
                    <>
                        <SideBarText>
                            Every relay entry must be associated with swimmers and an event. If no swimmers or events exist yet, first add swimmers and events to this meet before adding relay entries.
                        </SideBarText>
                    </>,
                    <>
                        <SideBarText>
                            {`Looking to create an entry for an individual event instead?`}
                            <PageButton
                                color="primary"
                                text={`Create an indiv. entry`}
                                icon="CIRCLE_PLUS"
                                handleClick={() => { navigate(`/meets/${meet_id_INT}/individual_entries/create`) }}
                            />
                        </SideBarText>
                    </>
                ]}
            />
        </>
    )
}