import { SetNavContext, UserContext } from "../../App.tsx";
import type MeetData from "./MeetDataType.tsx";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

export default function MeetPage() {
    const currentUser = useContext(UserContext);
    const [viewerIsHost, setViewerIsHost] = useState<boolean>(false);
    const [meetInfo, setMeetInfo] = useState<MeetData | null>(null);
    const { meet_id } = useParams();

    const navigate = useNavigate();

    // convert param type
    let meet_id_int: number = -1;
    if (meet_id == undefined) {
        navigate('/');
    } else {
        meet_id_int = parseInt(meet_id);
    }

    // retrieve initial meet data
    useEffect(() => {
        axios.get('/api/meets/', { params: { specific_to: 'id', meet_id: meet_id_int } })
            .then(response => {
                setMeetInfo({
                    name: response.data.name,
                    lanes: response.data.lanes,
                    measure_unit: response.data.measure_unit,
                    host_id: response.data.host
                });
            })
            .catch(error => {
                // ? get request failed on the back-end
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data.reason);
                } else {
                    console.error(error);
                }
            });
    }, []);

    // check if viewer is meet host
    if (currentUser && meetInfo && currentUser.id === meetInfo.host_id) {
        setViewerIsHost(true);
    } else {
        setViewerIsHost(false);
    }

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            { text: 'Home', route: '/' },
            { text: 'Meets', route: '/meets' },
            { text: `${meetInfo ? meetInfo.name : "Meet"}`, route: `/meets/${meet_id_int}` },
        ]);
    }

    return (
        <>
            <h1>`${meetInfo ? meetInfo.name : "Meet"}`</h1>
            {viewerIsHost &&
                <p>You are the host of this meet</p>
            }

            <p>Pool information</p>
            <p>Number of pool lanes: {meetInfo ? meetInfo.lanes : "Unknown"}</p>
            <p>Pool measuring units: {meetInfo ? meetInfo.measure_unit : "Unknown"}</p>

            {viewerIsHost &&
                <button onClick={() => navigate(`/meets/${meet_id_int}/edit`)}>Edit meet</button>
            }

            <button onClick={() => navigate(`/meets/${meet_id_int}/events`)}>View events</button>
            <button onClick={() => navigate(`/meets/${meet_id_int}/swimmers`)}>View swimmers</button>
        </>
    )
}
