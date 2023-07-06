import { Link } from 'react-router-dom';
import { SetUserContext, UserContext } from "../../App.tsx";
import { useContext } from 'react';
import axios from 'axios';
import { NavigateFunction, useNavigate } from "react-router-dom";

import type { User } from '../../App.tsx';

async function handleLogIn(
    currentUser: User | null,
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>> | null,
    navigate: NavigateFunction
) {
    // ? setCurrentUser still null
    if (setCurrentUser == null) {
        console.error('setCurrentUser still null');
        return;
    }

    // ? already logged in
    if (currentUser) {
        console.error('already logged in (front-end catch)');
        return;
    }

    const emailInputField = document.getElementById('email-field') as HTMLInputElement;
    const emailInputValue = emailInputField.value;

    const passwordInputField = document.getElementById('password-field') as HTMLInputElement;
    const passwordInputValue = passwordInputField.value;

    try {
        const response = await axios.post('/auth/log_in/', {'email': emailInputValue, 'password': passwordInputValue});
        console.log(response.data)
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
            console.error('an unknown error occurred');
        }
    }
}

function HostLogInPage() {
    const currentUser = useContext(UserContext);
    const setCurrentUser = useContext(SetUserContext);

    const navigate = useNavigate();

    return (
        <>
            <h1>Log in</h1>
            <form onSubmit = {(event) => {
                event?.preventDefault();
                handleLogIn(currentUser, setCurrentUser, navigate);
            }}>
                <label htmlFor = 'email-field'>Email: </label>
                <input id = 'email-field' type = 'email'></input>
                <label htmlFor = 'password-field'>Password: </label>
                <input id = 'password-field' type = 'password'></input>
                <input type='submit' value='Log in'></input>
            </form>
            <p>Don't have an account? <Link to='/host/sign_up'>Sign up</Link>.</p>
        </>
    )
}

export default HostLogInPage
