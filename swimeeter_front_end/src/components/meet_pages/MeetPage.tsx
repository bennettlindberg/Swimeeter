import { SetNavContext, UserContext } from "../../App.tsx";
import type { MeetData } from "../ModelTypes.tsx";
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

    // retrieve meet data
    useEffect(() => {
        axios.get('/api/v1/meets/', { params: { specific_to: 'id', meet_id: meet_id_int } })
            .then(response => setMeetInfo(response.data.data))
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
    useEffect(() => {
        if (currentUser && meetInfo && currentUser.id === meetInfo.fields.host.pk) {
            setViewerIsHost(true);
        }
    }, [meetInfo]);

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            { text: 'Home', route: '/' },
            { text: 'Meets', route: '/meets' },
            { text: `${meetInfo ? meetInfo.fields.name : "Meet"}`, route: `/meets/${meet_id_int}` },
        ]);
    }

    return (
        <>
            <h1>{`${meetInfo ? meetInfo.fields.name : "Meet"}`}</h1>
            {viewerIsHost &&
                <p>You are the host of this meet</p>
            }

            <p>Meet information</p>
            <p>Begin date: {meetInfo ? meetInfo.fields.begin_date : "Unknown"}</p>
            <p>End date: {meetInfo ? meetInfo.fields.end_date : "Unknown"}</p>

            <p>Pool information</p>
            <p>Number of pool lanes: {meetInfo ? meetInfo.fields.lanes : "Unknown"}</p>
            <p>Pool measuring units: {meetInfo ? meetInfo.fields.measure_unit : "Unknown"}</p>

            {viewerIsHost &&
                <button onClick={() => navigate(`/meets/${meet_id_int}/edit`)}>Edit meet</button>
            }

            <button onClick={() => navigate(`/meets/${meet_id_int}/events`)}>View events</button>
            <button onClick={() => navigate(`/meets/${meet_id_int}/swimmers`)}>View swimmers</button>
        </>
    )
}
