import { Link } from 'react-router-dom';
import { SetUserContext, UserContext } from "../../App.tsx";
import { useContext } from 'react';
import axios from 'axios';
import { NavigateFunction, useNavigate } from "react-router-dom";

import type { User } from '../../App.tsx';

async function handleSignUp(
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

    const firstNameInputField = document.getElementById('first-name-field') as HTMLInputElement;
    const firstNameInputValue = firstNameInputField.value;

    const lastNameInputField = document.getElementById('last-name-field') as HTMLInputElement;
    const lastNameInputValue = lastNameInputField.value;

    try {
        const response = await axios.post('/auth/sign_up/', {
            'email': emailInputValue, 
            'password': passwordInputValue,
            'first_name': firstNameInputValue,
            'last_name': lastNameInputValue
        });

        setCurrentUser({
            id: response.data.user.fields.pk, 
            first_name: response.data.user.fields.first_name,
            last_name: response.data.user.fields.last_name,
            email: response.data.user.email
        })
        navigate(-1); // route to where user came from
    } catch (error) {
        // ? sign up failed on the back-end
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data.reason);
        } else {
            console.error('an unknown error occurred');
        }
    }
}

function HostSignUpPage() {
    const currentUser = useContext(UserContext);
    const setCurrentUser = useContext(SetUserContext);

    const navigate = useNavigate();

    return (
        <>
            <h1>Sign up</h1>
            <form onSubmit = {(event) => {
                event.preventDefault();
                handleSignUp(currentUser, setCurrentUser, navigate);
            }}>
                <label htmlFor = 'first-name-field'>First name: </label>
                <input id = 'first-name-field' type = 'text'></input>
                <label htmlFor = 'last-name-field'>Last name: </label>
                <input id = 'last-name-field' type = 'text'></input>
                <label htmlFor = 'email-field'>Email: </label>
                <input id = 'email-field' type = 'email'></input>
                <label htmlFor = 'password-field'>Password: </label>
                <input id = 'password-field' type = 'password'></input>
                <input type='submit' value='Log in'></input>
            </form>
            <p>Already have an account? <Link to='/host/log_in'>Log in</Link>.</p>
        </>
    )
}

export default HostSignUpPage
