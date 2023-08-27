import { useState, useContext, useEffect, useRef, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { Event } from "../../utilities/helpers/modelTypes.ts";
import { EventTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";
import { generateEventName } from "../../utilities/helpers/nameGenerators.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { EventEditingForm } from "../../sections/event_page/EventEditingForm.tsx";
import { EventRelayEntriesTable } from "../../sections/event_page/EventRelayEntriesTable.tsx";
import { EventIndivEntriesTable } from "../../sections/event_page/EventIndivEntriesTable.tsx";
import { EventHeatSheetTable } from "../../sections/event_page/EventHeatSheetTable.tsx";

// * create event context
export const EventContext = createContext<{
    eventData: Event,
    setEventData: React.Dispatch<React.SetStateAction<Event>>,
    isMeetHost: boolean
}>({
    eventData: {
        model: "",
        pk: -1,
        fields: {
            stroke: "",
            distance: -1,
            is_relay: false,
            swimmers_per_entry: -1,
            stage: "",
            competing_gender: "",
            competing_max_age: null,
            competing_min_age: null,
            order_in_session: -1,
            total_heats: null,
            session: {
                model: "",
                pk: -1,
                fields: {
                    name: "",
                    begin_time: "",
                    end_time: "",
                    pool: -1,
                    meet: -1
                }
            },
        }
    },
    setEventData: () => { },
    isMeetHost: false
});

// ~ component
export function EventPage() {
    // * initialize context and navigation
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize state and params
    const [eventData, setEventData] = useState<Event>({
        model: "",
        pk: -1,
        fields: {
            stroke: "",
            distance: -1,
            is_relay: false,
            swimmers_per_entry: -1,
            stage: "",
            competing_gender: "",
            competing_max_age: null,
            competing_min_age: null,
            order_in_session: -1,
            total_heats: null,
            session: {
                model: "",
                pk: -1,
                fields: {
                    name: "",
                    begin_time: "",
                    end_time: "",
                    pool: -1,
                    meet: -1
                }
            },
        }
    });
    const [isMeetHost, setIsMeetHost] = useState<boolean>(false);

    // * initialize URL params
    const { meet_id, event_type, event_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    const event_id_INT = convertStringParamToInt(event_id || "-1");
    if (meet_id_INT === -1 || event_id_INT === -1) {
        navigate("/errors/unknown");
    }
    if (event_type !== "individual" && event_type !== "relay") {
        navigate("/errors/unknown");
    }

    // * retrieve event data
    useEffect(() => {
        async function retrieveEventData() {
            try {
                // @ retrieve event data with back-end request
                const response = await axios.get("/api/v1/events/", {
                    params: {
                        specific_to: "id",
                        meet_id: meet_id_INT,
                        event_id: event_id_INT
                    }
                });

                setEventData(response.data);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveEventData();
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
                            model_type: "Event",
                            model_id: event_id_INT
                        }
                    });

                const treeData: EventTree = response.data;
                navTreeDispatch({
                    type: "UPDATE_TREE",
                    data: [
                        { title: "HOME", route: "/" },
                        { title: "MEETS", route: "/meets" },
                        { title: treeData.MEET.title.toUpperCase(), route: treeData.MEET.route },
                        { title: treeData.SESSION.title.toUpperCase(), route: treeData.SESSION.route },
                        { title: treeData.EVENT.title.toUpperCase(), route: treeData.EVENT.route }
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                console.log(error)
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, [eventData]);

    // * update tab title
    useEffect(() => setTabTitle(`${generateEventName(eventData) || "Event"} | Swimeeter`), [eventData]);

    // * create main content section refs
    const informationRef = useRef<HTMLHeadingElement>(null);
    const entriesRef = useRef<HTMLHeadingElement>(null);
    const heatSheetRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <EventContext.Provider value={{
                eventData: eventData,
                setEventData: setEventData,
                isMeetHost: isMeetHost
            }}>
                <ContentPage
                    title={generateEventName(eventData)}
                    primaryContent={[
                        {
                            heading: "Information",
                            icon: "CIRCLE_PIN",
                            ref: informationRef,
                            content: (
                                <>
                                    <EventEditingForm scrollRef={informationRef} />
                                </>
                            )
                        },
                        {
                            heading: eventData.fields.is_relay ? "Relay Entries" : "Indiv. Entries",
                            icon: "STOP_WATCH",
                            ref: entriesRef,
                            content: (
                                <>
                                    {eventData.fields.is_relay
                                        ? <EventRelayEntriesTable />
                                        : <EventIndivEntriesTable />
                                    }
                                </>
                            )
                        },
                        {
                            heading: "Heat Sheet",
                            icon: "CLIP_BOARD",
                            ref: heatSheetRef,
                            content: (
                                <>
                                    <EventHeatSheetTable />
                                </>
                            )
                        }
                    ]}
                    secondaryContent={[
                        <>
                            <SideBarText>
                                All events must be associated with a session. The order of events within a session is determined by each event's "order in session" value.
                            </SideBarText>
                        </>
                    ]}
                />
            </EventContext.Provider>
        </>
    )
}