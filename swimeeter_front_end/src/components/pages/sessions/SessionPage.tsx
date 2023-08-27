import { useState, useContext, useEffect, useRef, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { Session } from "../../utilities/helpers/modelTypes.ts";
import { SessionTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { SessionEditingForm } from "../../sections/session_page/SessionEditingForm.tsx";
import { SessionEventsTable } from "../../sections/session_page/SessionEventsTable.tsx";
import { SessionHeatSheetTable } from "../../sections/session_page/SessionHeatSheetTable.tsx";

// import { SessionEditingForm } from "../../sections/session_page/SessionEditingForm.tsx";

// * create session context
export const SessionContext = createContext<{
    sessionData: Session,
    setSessionData: React.Dispatch<React.SetStateAction<Session>>,
    isMeetHost: boolean
}>({
    sessionData: {
        model: "",
        pk: -1,
        fields: {
            name: "",
            begin_time: "",
            end_time: "",
            meet: {
                model: "",
                pk: -1,
                fields: {
                    name: "",
                    begin_time: null,
                    end_time: null,
                    is_public: false,
                    host: -1
                }
            },
            pool: {
                model: "",
                pk: -1,
                fields: {
                    name: "",
                    street_address: "",
                    city: "",
                    state: "",
                    country: "",
                    zipcode: "",
                    lanes: -1,
                    side_length: -1,
                    measure_unit: "",
                    meet: -1
                }
            },
        }
    },
    setSessionData: () => { },
    isMeetHost: false
});

// ~ component
export function SessionPage() {
    // * initialize context and navigation
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize state and params
    const [sessionData, setSessionData] = useState<Session>({
        model: "",
        pk: -1,
        fields: {
            name: "",
            begin_time: "",
            end_time: "",
            meet: {
                model: "",
                pk: -1,
                fields: {
                    name: "",
                    begin_time: null,
                    end_time: null,
                    is_public: false,
                    host: -1
                }
            },
            pool: {
                model: "",
                pk: -1,
                fields: {
                    name: "",
                    street_address: "",
                    city: "",
                    state: "",
                    country: "",
                    zipcode: "",
                    lanes: -1,
                    side_length: -1,
                    measure_unit: "",
                    meet: -1
                }
            },
        }
    });
    const [isMeetHost, setIsMeetHost] = useState<boolean>(false);

    // * initialize URL params
    const { meet_id, session_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    const session_id_INT = convertStringParamToInt(session_id || "-1");
    if (meet_id_INT === -1 || session_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // * retrieve session data
    useEffect(() => {
        async function retrieveSessionData() {
            try {
                // @ retrieve session data with back-end request
                const response = await axios.get("/api/v1/sessions/", {
                    params: {
                        specific_to: "id",
                        meet_id: meet_id_INT,
                        session_id: session_id_INT
                    }
                });

                setSessionData(response.data);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveSessionData();
    }, []);

    // * check if meet host
    useEffect(() => {
        async function checkIfMeetHost() {
            try {
                // @ check if meet host with back-end request
                const response = await axios.get("/api/v1/info/", {
                    params: {
                        info_needed: "editing_access",
                        model_type: "Meet",
                        model_id: meet_id_INT
                    }
                });

                setIsMeetHost(response.data.has_editing_access);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        checkIfMeetHost();
    }, []);

    // * update nav tree
    useEffect(() => {
        async function retrieveTreeData() {
            try {
                // @ make back-end request for tree data
                const response = await axios.get("/api/v1/info/",
                {
                    params: {
                        info_needed: "relationship_tree",
                        model_type: "Session",
                        model_id: session_id_INT
                    }
                });

                const treeData: SessionTree = response.data;
                navTreeDispatch({
                    type: "UPDATE_TREE",
                    data: [
                        { title: "HOME", route: "/" },
                        { title: "MEETS", route: "/meets" },
                        { title: treeData.MEET.title.toUpperCase(), route: treeData.MEET.route},
                        { title: treeData.SESSION.title.toUpperCase(), route: treeData.SESSION.route}
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                console.log(error)
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, [sessionData]);

    // * update tab title
    useEffect(() => setTabTitle(`${sessionData.fields.name || "Session"} | Swimeeter`), [sessionData]);

    // * create main content section refs
    const informationRef = useRef<HTMLHeadingElement>(null);
    const eventsRef = useRef<HTMLHeadingElement>(null);
    const heatSheetRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <SessionContext.Provider value={{
                sessionData: sessionData,
                setSessionData: setSessionData,
                isMeetHost: isMeetHost
            }}>
                <ContentPage
                    title={sessionData.fields.name}
                    primaryContent={[
                        {
                            heading: "Information",
                            icon: "CIRCLE_PIN",
                            ref: informationRef,
                            content: (
                                <>
                                    <SessionEditingForm scrollRef={informationRef}/>
                                </>
                            )
                        },
                        {
                            heading: "Events",
                            icon: "TROPHY_CUP",
                            ref: eventsRef,
                            content: (
                                <>
                                    <SessionEventsTable />
                                </>
                            )
                        },
                        {
                            heading: "Heat Sheet",
                            icon: "CLIP_BOARD",
                            ref: heatSheetRef,
                            content: (
                                <>
                                    <SessionHeatSheetTable />
                                </>
                            )
                        }
                    ]}
                    secondaryContent={[
                        <>
                            <SideBarText>
                                Adding multiple sessions allows you to split up your meet in time and by competitor demographics. Larger meets often have multiple sessions spanning several days.
                            </SideBarText>
                        </>
                    ]}
                />
            </SessionContext.Provider>
        </>
    )
}