import { useState, useContext, useEffect, useRef, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { IndividualEntry } from "../../utilities/helpers/modelTypes.ts";
import { IndividualEntryTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";
import { generateIndividualEntryName } from "../../utilities/helpers/nameGenerators.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { IndividualEntryEditingForm } from "../../sections/individual_entry_page/IndividualEntryEditingForm.tsx";
import { IndivEntryHeatSheetTable } from "../../sections/individual_entry_page/IndivEntryHeatSheetTable.tsx";

// * create individual_entry context
export const IndividualEntryContext = createContext<{
    individualEntryData: IndividualEntry,
    setIndividualEntryData: React.Dispatch<React.SetStateAction<IndividualEntry>>,
    isMeetHost: boolean
}>({
    individualEntryData: {
        model: "",
        pk: -1,
        fields: {
            seed_time: -1,
            heat_number: null,
            lane_number: null,
            swimmer: {
                model: "",
                pk: -1,
                fields: {
                    first_name: "",
                    last_name: "",
                    middle_initials: "",
                    prefix: "",
                    suffix: "",
                    age: -1,
                    gender: "",
                    meet: {
                        model: "",
                        pk: -1,
                        fields: {
                            name: "",
                            is_public: false,
                            begin_time: null,
                            end_time: null,
                            host: -1
                        }
                    },
                    team: {
                        model: "",
                        pk: -1,
                        fields: {
                            name: "",
                            acronym: "",
                            meet: -1
                        }
                    }
                }
            },
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
    setIndividualEntryData: () => { },
    isMeetHost: false
});

// ~ component
export function IndividualEntryPage() {
    // * initialize context and navigation
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize state and params
    const [individualEntryData, setIndividualEntryData] = useState<IndividualEntry>({
        model: "",
        pk: -1,
        fields: {
            seed_time: -1,
            heat_number: null,
            lane_number: null,
            swimmer: {
                model: "",
                pk: -1,
                fields: {
                    first_name: "",
                    last_name: "",
                    middle_initials: "",
                    prefix: "",
                    suffix: "",
                    age: -1,
                    gender: "",
                    meet: {
                        model: "",
                        pk: -1,
                        fields: {
                            name: "",
                            is_public: false,
                            begin_time: null,
                            end_time: null,
                            host: -1
                        }
                    },
                    team: {
                        model: "",
                        pk: -1,
                        fields: {
                            name: "",
                            acronym: "",
                            meet: -1
                        }
                    }
                }
            },
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
    const { meet_id, individual_entry_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    const individual_entry_id_INT = convertStringParamToInt(individual_entry_id || "-1");
    if (meet_id_INT === -1 || individual_entry_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // * retrieve individual_entry data
    useEffect(() => {
        async function retrieveIndividualEntryData() {
            try {
                // @ retrieve individual_entry data with back-end request
                const response = await axios.get("/api/v1/individual_entries/", {
                    params: {
                        specific_to: "id",
                        meet_id: meet_id_INT,
                        individual_entry_id: individual_entry_id_INT
                    }
                });

                setIndividualEntryData(response.data);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveIndividualEntryData();
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
                            model_type: "Individual_entry",
                            model_id: individual_entry_id_INT
                        }
                    });

                const treeData: IndividualEntryTree = response.data;
                navTreeDispatch({
                    type: "UPDATE_TREE",
                    data: [
                        { title: "HOME", route: "/" },
                        { title: "MEETS", route: "/meets" },
                        { title: treeData.MEET.title.toUpperCase(), route: treeData.MEET.route },
                        { title: treeData.SESSION.title.toUpperCase(), route: treeData.SESSION.route },
                        { title: treeData.EVENT.title.toUpperCase(), route: treeData.EVENT.route },
                        { title: treeData.INDIVIDUAL_ENTRY.title.toUpperCase(), route: treeData.INDIVIDUAL_ENTRY.route }
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                console.log(error)
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, [individualEntryData]);

    // * update tab title
    useEffect(() => setTabTitle(`${generateIndividualEntryName(individualEntryData) || "Individual Entry"} | Swimeeter`), [individualEntryData]);

    // * create main content section refs
    const informationRef = useRef<HTMLHeadingElement>(null);
    const heatSheetRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <IndividualEntryContext.Provider value={{
                individualEntryData: individualEntryData,
                setIndividualEntryData: setIndividualEntryData,
                isMeetHost: isMeetHost
            }}>
                <ContentPage
                    title={generateIndividualEntryName(individualEntryData)}
                    primaryContent={[
                        {
                            heading: "Information",
                            icon: "CIRCLE_PIN",
                            ref: informationRef,
                            content: (
                                <>
                                    <IndividualEntryEditingForm scrollRef={informationRef}/>
                                </>
                            )
                        },
                        {
                            heading: "Heat Sheet",
                            icon: "CLIP_BOARD",
                            ref: heatSheetRef,
                            content: (
                                <>
                                    <IndivEntryHeatSheetTable />
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
            </IndividualEntryContext.Provider>
        </>
    )
}