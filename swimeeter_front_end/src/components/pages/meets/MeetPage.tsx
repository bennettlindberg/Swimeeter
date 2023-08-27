import { useState, useContext, useEffect, useRef, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { Meet } from "../../utilities/helpers/modelTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { MeetEditingForm } from "../../sections/meet_page/MeetEditingForm.tsx";
import { MeetPoolsTable } from "../../sections/meet_page/MeetPoolsTable.tsx";
import { MeetSessionsTable } from "../../sections/meet_page/MeetSessionsTable.tsx";
import { MeetEventsTable } from "../../sections/meet_page/MeetEventsTable.tsx";
import { MeetTeamsTable } from "../../sections/meet_page/MeetTeamsTable.tsx";
import { MeetSwimmersTable } from "../../sections/meet_page/MeetSwimmersTable.tsx";
import { MeetHeatSheetTable } from "../../sections/meet_page/MeetHeatSheetTable.tsx";

// * create meet context
export const MeetContext = createContext<{ 
    meetData: Meet, 
    setMeetData: React.Dispatch<React.SetStateAction<Meet>>,
    isMeetHost: boolean 
}>({
    meetData: {
        model: "",
        pk: -1,
        fields: {
            name: "",
            begin_time: null,
            end_time: null,
            is_public: true,
            host: {
                model: "",
                pk: -1,
                fields: {
                    first_name: "",
                    last_name: "",
                    prefix: "",
                    suffix: "",
                    middle_initials: ""
                }
            }
        }
    },
    setMeetData: () => {},
    isMeetHost: false
});

// ~ component
export function MeetPage() {
    // * initialize context and navigation
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize state and params
    const [meetData, setMeetData] = useState<Meet>({
        model: "",
        pk: -1,
        fields: {
            name: "",
            begin_time: null,
            end_time: null,
            is_public: true,
            host: {
                model: "",
                pk: -1,
                fields: {
                    first_name: "",
                    last_name: "",
                    prefix: "",
                    suffix: "",
                    middle_initials: ""
                }
            }
        }
    });
    const [isMeetHost, setIsMeetHost] = useState<boolean>(false);

    // * initialize URL params
    const { meet_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    if (meet_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // * retrieve meet data
    useEffect(() => {
        async function retrieveMeetData() {
            try {
                // @ retrieve meet data with back-end request
                const response = await axios.get("/api/v1/meets/", {
                    params: {
                        specific_to: "id",
                        meet_id: meet_id_INT,
                    }
                });

                setMeetData(response.data);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveMeetData();
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
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: [
                { title: "HOME", route: "/" },
                { title: "MEETS", route: "/meets" },
                { title: `${meetData.fields.name.toUpperCase() || "Meet"}`, route: `/meets/${meet_id_INT}` }
            ]
        })
    }, [meetData]);

    // * update tab title
    useEffect(() => setTabTitle(`${meetData.fields.name || "Meet"} | Swimeeter`), [meetData]);

    // * create main content section refs
    const informationRef = useRef<HTMLHeadingElement>(null);
    const poolsRef = useRef<HTMLHeadingElement>(null);
    const sessionsRef = useRef<HTMLHeadingElement>(null);
    const eventsRef = useRef<HTMLHeadingElement>(null);
    const teamsRef = useRef<HTMLHeadingElement>(null);
    const swimmersRef = useRef<HTMLHeadingElement>(null);
    const heatSheetRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <MeetContext.Provider value={{
                meetData: meetData,
                setMeetData: setMeetData,
                isMeetHost: isMeetHost
            }}>
                <ContentPage
                    title={meetData.fields.name}
                    primaryContent={[
                        {
                            heading: "Information",
                            icon: "CIRCLE_PIN",
                            ref: informationRef,
                            content: (
                                <>
                                    <MeetEditingForm scrollRef={informationRef}/>
                                </>
                            )
                        },
                        {
                            heading: "Pools",
                            icon: "BIG_WATER_DROP",
                            ref: poolsRef,
                            content: (
                                <>
                                    <MeetPoolsTable />
                                </>
                            )
                        },
                        {
                            heading: "Sessions",
                            icon: "CALENDAR",
                            ref: sessionsRef,
                            content: (
                                <>
                                    <MeetSessionsTable />
                                </>
                            )
                        },
                        {
                            heading: "Events",
                            icon: "TROPHY_CUP",
                            ref: eventsRef,
                            content: (
                                <>
                                    <MeetEventsTable />
                                </>
                            )
                        },
                        {
                            heading: "Teams",
                            icon: "TWO_USERS",
                            ref: teamsRef,
                            content: (
                                <>
                                    <MeetTeamsTable />
                                </>
                            )
                        },
                        {
                            heading: "Swimmers",
                            icon: "SWIMMER",
                            ref: swimmersRef,
                            content: (
                                <>
                                    <MeetSwimmersTable />
                                </>
                            )
                        },
                        {
                            heading: "Heat Sheet",
                            icon: "CLIP_BOARD",
                            ref: heatSheetRef,
                            content: (
                                <>
                                    <MeetHeatSheetTable />
                                </>
                            )
                        },
                    ]}
                    secondaryContent={[
                        <>
                            <SideBarText>
                                Specific meet entries can seen by viewing this meet's sessions, events, swimmers, and more.
                            </SideBarText>
                        </>
                    ]}
                />
            </MeetContext.Provider>
        </>
    )
}