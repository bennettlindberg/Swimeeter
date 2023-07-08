import { SetNavContext, SetUserContext, UserContext } from "../../App.tsx";
import { useContext } from 'react';
import { NavigateFunction, useNavigate } from "react-router-dom";
import axios from 'axios';
import type { User } from '../../App.tsx';

async function handleHostEdit(
    currentUser: User,
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>> | null,
    navigate: NavigateFunction
) {
    // ? setCurrentUser still null
    if (setCurrentUser == null) {
        console.error('setCurrentUser still null');
        navigate('/');
        return;
    }

    const firstNameInputField = document.getElementById('first-name-field') as HTMLInputElement;
    const firstNameInputValue = firstNameInputField.value;

    // ? names must be at least 2 characters long
    if (firstNameInputValue.length < 2) {
        console.error('names be must at least 2 characters long (front-end catch)');
        return;
    }

    const lastNameInputField = document.getElementById('last-name-field') as HTMLInputElement;
    const lastNameInputValue = lastNameInputField.value;

    // ? names must be at least 2 characters long
    if (lastNameInputValue.length < 2) {
        console.error('names be must at least 2 characters long (front-end catch)');
        return;
    }

    try {
        const response = await axios.put('/auth/update_account/', {
            host_id: currentUser.id, 
            first_name: firstNameInputValue, 
            last_name: lastNameInputValue
        });

        setCurrentUser({
            id: response.data.user.pk, 
            first_name: response.data.user.fields.first_name,
            last_name: response.data.user.fields.last_name,
            email: response.data.user.fields.email
        })

        navigate(-1); // route to where user came from
    } catch (error) {
        // ? log in failed on the back-end
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data.reason);
        } else {
            console.error(error);
        }
    }
}

async function handleHostDelete(
    currentUser: User,
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>> | null,
    navigate: NavigateFunction
) {
    // ? setCurrentUser still null
    if (setCurrentUser == null) {
        console.error('setCurrentUser still null');
        navigate('/');
        return;
    }

    try {
        const response = await axios.delete('/auth/delete_account/', { data: {'host_id': currentUser.id}});

        setCurrentUser(null);
        
        navigate('/'); // now logged out; go to homepage
    } catch (error) {
        // ? log in failed on the back-end
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data.reason);
        } else {
            console.error(error);
        }
    }
}

export default function HostEditPage() {
    const currentUser = useContext(UserContext);
    const setCurrentUser = useContext(SetUserContext);

    const navigate = useNavigate();

    if (currentUser == null) {
        navigate('/host/log_in', {state: {forward_to: '/host/edit'}})
        return;
    }

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            {text: 'Home', route: '/'},
            {text: 'Edit account', route: '/host/edit'}
        ]);
    }

    return (
        <>
            <h1>My account</h1>

            <form onSubmit = {(event) => {
                event.preventDefault();
                handleHostEdit(currentUser, setCurrentUser, navigate);
            }}>
                <label htmlFor = 'first-name-field'>First name: </label>
                <input id = 'first-name-field' type = 'text'></input>
                <label htmlFor = 'last-name-field'>Last name: </label>
                <input id = 'last-name-field' type = 'text'></input>

                <label htmlFor = 'email-field'>Email: </label>
                <input id = 'email-field' type = 'email' value = {currentUser.email} disabled></input>
                <label htmlFor = 'password-field'>Password: </label>
                <input id = 'password-field' type = 'password' value = '************' disabled></input>
                
                <input type='submit' value='Save changes'></input>
            </form>

            <button onClick = {() => navigate('/host/view')}>Cancel</button>
            <button onClick = {() => handleHostDelete(currentUser, setCurrentUser, navigate)}>Delete account</button>
        </>
    )
}
