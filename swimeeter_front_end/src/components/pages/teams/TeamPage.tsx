import { useState, useContext, useEffect, useRef, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { Team } from "../../utilities/helpers/modelTypes.ts";
import { TeamTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { TeamEditingForm } from "../../sections/team_page/TeamEditingForm.tsx";
import { TeamSwimmersTable } from "../../sections/team_page/TeamSwimmersTable.tsx";
import { TeamIndivEntriesTable } from "../../sections/team_page/TeamIndivEntriesTable.tsx";
import { TeamRelayEntriesTable } from "../../sections/team_page/TeamRelayEntriesTable.tsx";

// * create team context
export const TeamContext = createContext<{
    teamData: Team,
    setTeamData: React.Dispatch<React.SetStateAction<Team>>,
    isMeetHost: boolean
}>({
    teamData: {
        model: "",
        pk: -1,
        fields: {
            name: "",
            acronym: "",
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
            }
        }
    },
    setTeamData: () => { },
    isMeetHost: false
});

// ~ component
export function TeamPage() {
    // * initialize context and navigation
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize state and params
    const [teamData, setTeamData] = useState<Team>({
        model: "",
        pk: -1,
        fields: {
            name: "",
            acronym: "",
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
            }
        }
    });
    const [isMeetHost, setIsMeetHost] = useState<boolean>(false);

    // * initialize URL params
    const { meet_id, team_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    const team_id_INT = convertStringParamToInt(team_id || "-1");
    if (meet_id_INT === -1 || team_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // * retrieve team data
    useEffect(() => {
        async function retrieveTeamData() {
            try {
                // @ retrieve team data with back-end request
                const response = await axios.get("/api/v1/teams/", {
                    params: {
                        specific_to: "id",
                        meet_id: meet_id_INT,
                        team_id: team_id_INT
                    }
                });

                setTeamData(response.data);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveTeamData();
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
                            model_type: "Team",
                            model_id: team_id_INT
                        }
                    });

                const treeData: TeamTree = response.data;
                navTreeDispatch({
                    type: "UPDATE_TREE",
                    data: [
                        { title: "HOME", route: "/" },
                        { title: "MEETS", route: "/meets" },
                        { title: treeData.MEET.title.toUpperCase(), route: treeData.MEET.route },
                        { title: treeData.TEAM.title.toUpperCase(), route: treeData.TEAM.route }
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                console.log(error)
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, [teamData]);

    // * update tab title
    useEffect(() => setTabTitle(`${teamData.fields.name || "Team"} | Swimeeter`), [teamData]);

    // * create main content section refs
    const informationRef = useRef<HTMLHeadingElement>(null);
    const swimmersRef = useRef<HTMLHeadingElement>(null);
    const indivEntriesRef = useRef<HTMLHeadingElement>(null);
    const relayEntriesRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <TeamContext.Provider value={{
                teamData: teamData,
                setTeamData: setTeamData,
                isMeetHost: isMeetHost
            }}>
                <ContentPage
                    title={teamData.fields.name}
                    primaryContent={[
                        {
                            heading: "Information",
                            icon: "CIRCLE_PIN",
                            ref: informationRef,
                            content: (
                                <>
                                    <TeamEditingForm />
                                </>
                            )
                        },
                        {
                            heading: "Swimmers",
                            icon: "SWIMMER",
                            ref: swimmersRef,
                            content: (
                                <>
                                    <TeamSwimmersTable />
                                </>
                            )
                        },
                        {
                            heading: "Indiv. Entries",
                            icon: "STOP_WATCH",
                            ref: indivEntriesRef,
                            content: (
                                <>
                                    <TeamIndivEntriesTable />
                                </>
                            )
                        },
                        {
                            heading: "Relay Entries",
                            icon: "STOP_WATCH",
                            ref: relayEntriesRef,
                            content: (
                                <>
                                    <TeamRelayEntriesTable />
                                </>
                            )
                        },
                    ]}
                    secondaryContent={[
                        <>
                            <SideBarText>
                                All swimmers must be associated with a team. To create unattached swimmers, first add an "unattached" team and assign the unattached swimmers to said team.
                            </SideBarText>
                        </>
                    ]}
                />
            </TeamContext.Provider>
        </>
    )
}