import { SetNavContext, UserContext } from "../../App.tsx";
import type { MeetData } from "../ModelTypes.tsx";
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

async function handleEventCreation(navigate: NavigateFunction) {
    // ! this needs to be overhauled...copied from meet creation page...

    const nameInputField = document.getElementById('name-field') as HTMLInputElement;
    const nameInputValue = nameInputField.value;

    // ? names must be at least 2 characters long
    if (nameInputValue.length < 2) {
        console.error('names be must at least 2 characters long (front-end catch)');
        return;
    }

    const beginDateInputField = document.getElementById('begin-date-field') as HTMLInputElement;
    const beginDateInputValue = beginDateInputField.value;

    // ? begin date must be valid
    if (Number.isNaN(Date.parse(beginDateInputValue))) {
        console.error('begin date must be valid (front-end catch)');
        return;
    }

    const endDateInputField = document.getElementById('end-date-field') as HTMLInputElement;
    const endDateInputValue = endDateInputField.value;

    // ? end date must be valid
    if (Number.isNaN(Date.parse(endDateInputValue))) {
        console.error('end date must be valid (front-end catch)');
        return;
    }

    // ? end date must be on the same day or after begin date
    if (Date.parse(beginDateInputValue) > Date.parse(endDateInputValue)) {
        console.error('end date must be on the same day or after begin date (front-end catch)');
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
        const response = await axios.post('/api/v1/meets/', {
            name: nameInputValue,
            begin_date: beginDateInputValue,
            end_date: endDateInputValue,
            lanes: lanesInputValue,
            measure_unit: unitsInputValue
        });

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

export default function EventCreationPage() {
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

    if (currentUser == null) {
        navigate('/host/log_in', { state: { forward_to: `/meets/${meet_id_int}/events/create` } });
        return;
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

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            { text: 'Home', route: '/' },
            { text: 'Meets', route: '/meets' },
            { text: meetInfo ? meetInfo.fields.name : 'Meet', route: `/meets/${meet_id_int}` },
            { text: 'Create event', route: `/meets/${meet_id_int}/events/create` }
        ]);
    }

    return (
        <>
            <h1>Create event</h1>

            <form onSubmit={(event) => {
                event.preventDefault();
                handleEventCreation(navigate);
            }}>
                <p>Event information</p>
                <label htmlFor='stroke-field'>Stroke: </label>
                <select id="stroke-field">
                    <option value="butterfly">Butterfly</option>
                    <option value="backstroke">Backstroke</option>
                    <option value="breaststroke">Breaststroke</option>
                    <option value="freestyle" selected>Freestyle</option>
                    <option value="individual medley">Individual Medley (IM)</option>
                </select>

                <label htmlFor='distance-field'>Distance: </label>
                <select id="distance-field">
                    <option value="25">25</option>
                    <option value="50" selected>50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="800">800</option>
                    <option value="1000">1000</option>
                    <option value="1500">1500</option>
                    <option value="1650">1650</option>
                </select>

                <label htmlFor='order-field'>Order in meet: </label>
                <select id="order-field">
                    <option value="start" selected>Start</option>
                    <option value="end">End</option>
                    <option value="specify">Specify</option>
                </select>
                <div style={{
                    display: document.getElementById('order-field')
                        && (document.getElementById('order-field') as HTMLSelectElement).value === "specify"
                        ? 'inline'
                        : 'none'
                }}>
                    <label htmlFor='order-specify-field'>Specify an meet order placement: </label>
                    <input id='order-specify-field' type='number' min={1} value={1}></input>
                </div>

                <p>Competitor information</p>
                <label htmlFor='gender-field'>{'Competing gender(s): '}</label>
                <select id="gender-field">
                    <option value="open" selected>Open</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="specify">Specify</option>
                </select>
                <div style={{
                    display: document.getElementById('gender-field')
                        && (document.getElementById('gender-field') as HTMLSelectElement).value === "specify"
                        ? 'inline'
                        : 'none'
                }}>
                    <label htmlFor='gender-specify-field'>Specify a gender: </label>
                    <input id="gender-specify-field" type="text"></input>
                </div>

                <label htmlFor='age-field'>Competing age range: </label>
                <select id="age-field">
                    <option value="Open" selected>Open</option>
                    <option value="8&U">8 and under</option>
                    <option value="9-10">9 to 10</option>
                    <option value="11-12">11 to 12</option>
                    <option value="13-14">13 to 14</option>
                    <option value="15&O">15 and over</option>
                    <option value="specify">Specify</option>
                </select>
                <div style={{
                    display: document.getElementById('age-field')
                        && (document.getElementById('age-field') as HTMLSelectElement).value === "specify"
                        ? 'inline'
                        : 'none'
                }}>
                    <label htmlFor='age-specify-min-field'>Specify a minimum age: </label>
                    <input id="age-specify-min-field" type="text"></input>
                    <label htmlFor='age-specify-max-field'>Specify a maximum age: </label>
                    <input id="age-specify-max-field" type="text"></input>
                </div>

                <input type='submit' value='Create'></input>
            </form>

            <button onClick={() => navigate(`/meets/${meet_id_int}/events`)}>Cancel</button>
        </>
    )
}
