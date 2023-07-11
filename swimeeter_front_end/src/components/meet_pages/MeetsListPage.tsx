import { SetNavContext, UserContext } from "../../App.tsx";
import DataRow from "../component_library/DataRow.tsx";
import type { MeetData, HostData } from "../ModelTypes.tsx";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function MeetListPage() {
    const currentUser = useContext(UserContext);
    const navigate = useNavigate();

    const [allMeetsInfo, setAllMeetsInfo] = useState<MeetData[] | null>(null);
    const [allMeetHostsInfo, setAllMeetHostsInfo] = useState<HostData[] | null>(null);

    const [resultsUpperBound, setResultsUpperBound] = useState<number>(0);
    const [allResultsDisplayed, setAllResultsDisplayed] = useState<boolean>(false);

    // results retriever function
    function getNextTenResults() {
        if (allResultsDisplayed) {
            return;
        }

        axios.get('/api/v1/meets/', { params: {
            specific_to: 'all', 
            lower_bound: resultsUpperBound, 
            upper_bound: resultsUpperBound + 10
        } })
            .then(response => {
                if (allMeetsInfo) {
                    setAllMeetsInfo([...allMeetsInfo, ...response.data.data]);
                } else {
                    setAllMeetsInfo(response.data.data);
                }

                if (response.data.data.length < 10) {
                    setAllResultsDisplayed(true);
                }
            })
            .catch(error => {
                // ? get request failed on the back-end
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data.reason);
                } else {
                    console.error(error);
                }
            });

        setResultsUpperBound(resultsUpperBound + 10);
    }

    // retrieve data for first ten meets
    useEffect(() => {
        getNextTenResults();
    }, []);

    // // retrieve data for all meet hosts
    // useEffect(() => {
    //     if (allMeetsInfo == null) {
    //         setAllMeetHostsInfo(null);
    //         return;
    //     }

    //     let meet_host_ids: number[] = [];
    //     for (const meet of allMeetsInfo) {
    //         meet_host_ids.push(meet.fields.host);
    //     }

    //     axios.get('/api/v1/hosts/', { params: { specific_to: 'id', host_id:  } })
    //         .then(response => setAllMeetHostsInfo(...allMeetHostsInfo, response.data.data))
    //         .catch(error => {
    //             // ? get request failed on the back-end
    //             if (axios.isAxiosError(error)) {
    //                 console.error(error.response?.data.reason);
    //             } else {
    //                 console.error(error);
    //             }
    //         });
    // }, [allMeetsInfo]);

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            { text: 'Home', route: '/' },
            { text: 'Meets', route: '/meets' },
        ]);
    }

    return (
        <>
            <h1>All meets</h1>

            {
                allMeetsInfo && allMeetsInfo.map((meet: MeetData, index: number) =>
                    <DataRow kind={
                        currentUser && currentUser.id === meet.fields.host
                            ? "owner"
                            : index % 2 == 0
                                ? "even"
                                : "odd"
                    }>
                        <p>{meet.fields.name}</p>
                        <p>{meet.fields.host}</p>
                        
                        <button onClick={() => navigate(`/meets/${meet.pk}`)}>View meet</button>
                    </DataRow>
                )
            }

            {!allResultsDisplayed && <button onClick={() => getNextTenResults()}>Get next ten results...</button>}
            <button onClick={() => navigate('/meets/create')}>Host a meet</button>
        </>
    )
}
