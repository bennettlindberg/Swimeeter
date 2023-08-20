import { useState, useContext, useEffect, useRef, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { Swimmer } from "../../utilities/helpers/modelTypes.ts";
import { SwimmerTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";
import { generateSwimmerName } from "../../utilities/helpers/nameGenerators.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { SwimmerEditingForm } from "../../sections/swimmer_page/SwimmerEditingForm.tsx";
import { SwimmerIndivEntriesTable } from "../../sections/swimmer_page/SwimmerIndivEntriesTable.tsx";
import { SwimmerRelayEntriesTable } from "../../sections/swimmer_page/SwimmerRelayEntriesTable.tsx";

// * create swimmer context
export const SwimmerContext = createContext<{
    swimmerData: Swimmer,
    setSwimmerData: React.Dispatch<React.SetStateAction<Swimmer>>,
    isMeetHost: boolean
}>({
    swimmerData: {
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
    setSwimmerData: () => { },
    isMeetHost: false
});

// ~ component
export function SwimmerPage() {
    // * initialize context and navigation
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize state and params
    const [swimmerData, setSwimmerData] = useState<Swimmer>({
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
    });
    const [isMeetHost, setIsMeetHost] = useState<boolean>(false);

    // * initialize URL params
    const { meet_id, swimmer_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    const swimmer_id_INT = convertStringParamToInt(swimmer_id || "-1");
    if (meet_id_INT === -1 || swimmer_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // * retrieve swimmer data
    useEffect(() => {
        async function retrieveSwimmerData() {
            try {
                // @ retrieve swimmer data with back-end request
                const response = await axios.get("/api/v1/swimmers/", {
                    params: {
                        specific_to: "id",
                        meet_id: meet_id_INT,
                        swimmer_id: swimmer_id_INT
                    }
                });

                setSwimmerData(response.data);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveSwimmerData();
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
                            model_type: "Swimmer",
                            model_id: swimmer_id_INT
                        }
                    });

                const treeData: SwimmerTree = response.data;
                navTreeDispatch({
                    type: "UPDATE_TREE",
                    data: [
                        { title: "HOME", route: "/" },
                        { title: "MEETS", route: "/meets" },
                        { title: treeData.MEET.title.toUpperCase(), route: treeData.MEET.route },
                        { title: treeData.SWIMMER.title.toUpperCase(), route: treeData.SWIMMER.route }
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                console.log(error)
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, [swimmerData]);

    // * update tab title
    useEffect(() => setTabTitle(`${generateSwimmerName(swimmerData) || "Swimmer"} | Swimeeter`), [swimmerData]);

    // * create main content section refs
    const informationRef = useRef<HTMLHeadingElement>(null);
    const indivEntriesRef = useRef<HTMLHeadingElement>(null);
    const relayEntriesRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <SwimmerContext.Provider value={{
                swimmerData: swimmerData,
                setSwimmerData: setSwimmerData,
                isMeetHost: isMeetHost
            }}>
                <ContentPage
                    title={generateSwimmerName(swimmerData)}
                    primaryContent={[
                        {
                            heading: "Information",
                            icon: "CIRCLE_PIN",
                            ref: informationRef,
                            content: (
                                <>
                                    <SwimmerEditingForm />
                                </>
                            )
                        },
                        {
                            heading: "Indiv. Entries",
                            icon: "STOP_WATCH",
                            ref: indivEntriesRef,
                            content: (
                                <>
                                    <SwimmerIndivEntriesTable />
                                </>
                            )
                        },
                        {
                            heading: "Relay Entries",
                            icon: "STOP_WATCH",
                            ref: relayEntriesRef,
                            content: (
                                <>
                                    <SwimmerRelayEntriesTable />
                                </>
                            )
                        },
                    ]}
                    secondaryContent={[
                        <>
                            <SideBarText>
                                All swimmers must be associated with a team. To allow for unattached swimmers, you can add an "unattached" team on the "Create a Team" page.
                            </SideBarText>
                        </>
                    ]}
                />
            </SwimmerContext.Provider>
        </>
    )
}