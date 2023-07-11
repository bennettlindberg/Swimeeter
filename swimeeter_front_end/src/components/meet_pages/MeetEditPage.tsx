import { SetNavContext, UserContext } from "../../App.tsx";
import type { MeetData } from "../ModelTypes.tsx";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

async function handleMeetEdit(navigate: NavigateFunction, meet_id_int: number) {
    const nameInputField = document.getElementById('name-field') as HTMLInputElement;
    const nameInputValue = nameInputField.value;

    // ? names must be at least 2 characters long
    if (nameInputValue.length < 2) {
        console.error('names be must at least 2 characters long (front-end catch)');
        return;
    }

    const lanesInputField = document.getElementById('lanes-field') as HTMLSelectElement;
    const lanesInputValue = parseInt(lanesInputField.value); // ! potentially NaN

    // ? number of lanes must be in the range [3, 10]
    if (!lanesInputValue || lanesInputValue < 3 || lanesInputValue > 10) {
        console.error('number of lanes must be in the range [3, 10] (front-end catch)');
        return;
    }

    const unitsInputField = document.getElementById('units-field') as HTMLSelectElement;
    const unitsInputValue = unitsInputField.value;

    // ? measuring units must be one of ['meters', 'yards']
    if (unitsInputValue !== 'meters' && unitsInputValue !== 'yards') {
        console.error('measuring units must be one of [\'meters\', \'yards\'] (front-end catch)');
        return;
    }

    try {
        const response = await axios.put('/api/v1/meets/', {
            name: nameInputValue,
            lanes: lanesInputValue,
            measure_unit: unitsInputValue
        }, {
            params: {
                meet_id: meet_id_int
            }
        });

        // TODO: INVALIDATE DATA WHEN CHANGED
        // lanes: all heat sheet data
        // units, name: nothing

        navigate(`/meets/${response.data.data.pk}`)
    } catch (error) {
        // ? meet creation failed on the back-end
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data.reason);
        } else {
            console.error(error);
        }
    }
}

export default function MeetEditPage() {
    const currentUser = useContext(UserContext);
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
        axios.get('/api/v1/meets/', { params: {specific_to: 'id', meet_id: meet_id_int } })
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


    // log in checking
    if (meetInfo == null) {
        ; // ! ignore log in check when meet info is null
    } else if (currentUser == null || currentUser.id !== meetInfo.fields.host) {
        navigate('/host/log_in', { state: { forward_to: `/meets/${meet_id_int}/edit` } });
        return;
    }

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            { text: 'Home', route: '/' },
            { text: 'Meets', route: '/meets' },
            { text: `Edit ${meetInfo ? meetInfo.fields.name : "Meet"}`, route: `/meets/${meet_id_int}/edit` }
        ]);
    }

    return (
        <>
            <h1>Edit meet</h1>

            <form onSubmit={(event) => {
                event.preventDefault();
                handleMeetEdit(navigate, meet_id_int);
            }}>
                <p>Meet information</p>
                <label htmlFor='name-field'>Meet name: </label>
                <input id='name-field' type='text' value={meetInfo ? meetInfo.fields.name : ""}></input>

                <p>Pool information</p>
                <label htmlFor='lanes-field'>Number of pool lanes: </label>
                <select id="lanes-field">
                    <option value="3" selected={
                        meetInfo && meetInfo.fields.lanes === 3 ? true : false
                    }>3</option>
                    <option value="4" selected={
                        meetInfo && meetInfo.fields.lanes === 4 ? true : false
                    }>4</option>
                    <option value="5" selected={
                        meetInfo && meetInfo.fields.lanes === 5 ? true : false
                    }>5</option>
                    <option value="6" selected={
                        meetInfo && meetInfo.fields.lanes === 6 ? true : false
                    }>6</option>
                    <option value="7" selected={
                        meetInfo && meetInfo.fields.lanes === 7 ? true : false
                    }>7</option>
                    <option value="8" selected={
                        meetInfo && meetInfo.fields.lanes === 8 ? true : false
                    }>8</option>
                    <option value="9" selected={
                        meetInfo && meetInfo.fields.lanes === 9 ? true : false
                    }>9</option>
                    <option value="10" selected={
                        meetInfo && meetInfo.fields.lanes === 10 ? true : false
                    }>10</option>
                </select>

                <label htmlFor='units-field'>Pool measuring units: </label>
                <select id="units-field">
                    <option value="meters" selected={
                        meetInfo && meetInfo.fields.measure_unit === 'meters' ? true : false
                    }>{'Meters (m)'}</option>
                    <option value="yards" selected={
                        meetInfo && meetInfo.fields.measure_unit === 'yards' ? true : false
                    }>{'Yards (yd)'}</option>
                </select>

                <input type='submit' value='Save changes' disabled={
                    meetInfo ? false : true
                }></input>
            </form>

            <button onClick={() => navigate(`/meets/${meet_id_int}`)}>Cancel</button>
        </>
    )
}
