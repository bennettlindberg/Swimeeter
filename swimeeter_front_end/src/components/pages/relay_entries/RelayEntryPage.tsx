import { useState, useContext, useEffect, useRef, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { RelayEntry } from "../../utilities/helpers/modelTypes.ts";
import { RelayEntryTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";
import { generateRelayEntryName } from "../../utilities/helpers/nameGenerators.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { RelayEntryEditingForm } from "../../sections/relay_entry_page/RelayEntryEditingForm.tsx";
import { RelayEntryHeatSheetTable } from "../../sections/relay_entry_page/RelayEntryHeatSheetTable.tsx";

// * create relay_entry context
export const RelayEntryContext = createContext<{
    relayEntryData: RelayEntry,
    setRelayEntryData: React.Dispatch<React.SetStateAction<RelayEntry>>,
    isMeetHost: boolean
}>({
    relayEntryData: {
        model: "",
        pk: -1,
        fields: {
            seed_time: -1,
            heat_number: null,
            lane_number: null,
            relay_assignments: [],
            event: {
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
                    session: -1
                }
            }
        }
    },
    setRelayEntryData: () => { },
    isMeetHost: false
});

// ~ component
export function RelayEntryPage() {
    // * initialize context and navigation
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize state and params
    const [relayEntryData, setRelayEntryData] = useState<RelayEntry>({
        model: "",
        pk: -1,
        fields: {
            seed_time: -1,
            heat_number: null,
            lane_number: null,
            relay_assignments: [],
            event: {
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
                    session: -1
                }
            }
        }
    });
    const [isMeetHost, setIsMeetHost] = useState<boolean>(false);

    // * initialize URL params
    const { meet_id, relay_entry_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    const relay_entry_id_INT = convertStringParamToInt(relay_entry_id || "-1");
    if (meet_id_INT === -1 || relay_entry_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // * retrieve relay_entry data
    useEffect(() => {
        async function retrieveRelayEntryData() {
            try {
                // @ retrieve relay_entry data with back-end request
                const response = await axios.get("/api/v1/relay_entries/", {
                    params: {
                        specific_to: "id",
                        meet_id: meet_id_INT,
                        relay_entry_id: relay_entry_id_INT
                    }
                });

                setRelayEntryData(response.data);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveRelayEntryData();
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
                            model_type: "Relay_entry",
                            model_id: relay_entry_id_INT
                        }
                    });

                const treeData: RelayEntryTree = response.data;
                navTreeDispatch({
                    type: "UPDATE_TREE",
                    data: [
                        { title: "HOME", route: "/" },
                        { title: "MEETS", route: "/meets" },
                        { title: treeData.MEET.title.toUpperCase(), route: treeData.MEET.route },
                        { title: treeData.SESSION.title.toUpperCase(), route: treeData.SESSION.route },
                        { title: treeData.EVENT.title.toUpperCase(), route: treeData.EVENT.route },
                        { title: treeData.RELAY_ENTRY.title.toUpperCase(), route: treeData.RELAY_ENTRY.route }
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                console.log(error)
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, [relayEntryData]);

    // * update tab title
    useEffect(() => setTabTitle(`${generateRelayEntryName(relayEntryData) || "Relay Entry"} | Swimeeter`), [relayEntryData]);

    // * create main content section refs
    const informationRef = useRef<HTMLHeadingElement>(null);
    const heatSheetRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <RelayEntryContext.Provider value={{
                relayEntryData: relayEntryData,
                setRelayEntryData: setRelayEntryData,
                isMeetHost: isMeetHost
            }}>
                <ContentPage
                    title={generateRelayEntryName(relayEntryData)}
                    primaryContent={[
                        {
                            heading: "Information",
                            icon: "CIRCLE_PIN",
                            ref: informationRef,
                            content: relayEntryData.pk === -1
                                ? <></>
                                : <>
                                    <RelayEntryEditingForm meet_id_INT={meet_id_INT} />
                                </>
                        },
                        {
                            heading: "Heat Sheet",
                            icon: "CLIP_BOARD",
                            ref: heatSheetRef,
                            content: (
                                <>
                                    <RelayEntryHeatSheetTable />
                                </>
                            )
                        }
                    ]}
                    secondaryContent={[
                        <>
                            <SideBarText>
                                If no heat and lane numbers are provided for this entry, first generate the heat sheet seeding of the event associated with this entry.
                            </SideBarText>
                        </>
                    ]}
                />
            </RelayEntryContext.Provider>
        </>
    )
}