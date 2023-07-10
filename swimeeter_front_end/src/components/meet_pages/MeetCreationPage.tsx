import { SetNavContext, UserContext } from "../../App.tsx";
import { useContext } from 'react';
import axios from 'axios';
import { NavigateFunction, useNavigate } from "react-router-dom";

async function handleMeetCreation(navigate: NavigateFunction) {
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
        const response = await axios.post('/api/v1/meets/', {
            name: nameInputValue,
            lanes: lanesInputValue,
            measure_unit: unitsInputValue
        });

        navigate(`/meets/${response.data.meet.pk}`)
    } catch (error) {
        // ? meet creation failed on the back-end
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data.reason);
        } else {
            console.error(error);
        }
    }
}

export default function MeetCreationPage() {
    const currentUser = useContext(UserContext);

    const navigate = useNavigate();

    if (currentUser == null) {
        navigate('/host/log_in', { state: { forward_to: '/meets/create' } });
        return;
    }

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            { text: 'Home', route: '/' },
            { text: 'Meets', route: '/meets' },
            { text: 'Create meet', route: '/meets/create' }
        ]);
    }

    return (
        <>
            <h1>Create meet</h1>

            <form onSubmit={(event) => {
                event.preventDefault();
                handleMeetCreation(navigate);
            }}>
                <p>Meet information</p>
                <label htmlFor='name-field'>Meet name: </label>
                <input id='name-field' type='text'></input>

                <p>Pool information</p>
                <label htmlFor='lanes-field'>Number of pool lanes: </label>
                <select id="lanes-field">
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8" selected>8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>

                <label htmlFor='units-field'>Pool measuring units: </label>
                <select id="units-field">
                    <option value="meters">{'Meters (m)'}</option>
                    <option value="yards">{'Yards (yd)'}</option>
                </select>

                <input type='submit' value='Create'></input>
            </form>

            <button onClick={() => navigate('/meets')}>Cancel</button>
        </>
    )
}
