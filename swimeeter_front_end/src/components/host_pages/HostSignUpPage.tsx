import { SetNavContext, SetUserContext, UserContext } from "../../App.tsx";
import type { User } from '../../App.tsx';
import { useContext } from 'react';
import axios from 'axios';
import { Link, useLocation, NavigateFunction, useNavigate } from "react-router-dom";

async function handleSignUp(
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>> | null,
    navigate: NavigateFunction,
    forward_to?: string
) {
    // ? setCurrentUser still null
    if (setCurrentUser == null) {
        console.error('setCurrentUser still null');
        navigate('/');
        return;
    }

    const emailInputField = document.getElementById('email-field') as HTMLInputElement;
    const emailInputValue = emailInputField.value;

    const passwordInputField = document.getElementById('password-field') as HTMLInputElement;
    const passwordInputValue = passwordInputField.value;

    // ? passwords must be at least 8 characters long
    if (passwordInputValue.length < 8) {
        console.error('passwords must be at least 8 characters long (front-end catch)');
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
        const response = await axios.post('/auth/sign_up/', {
            'email': emailInputValue,
            'password': passwordInputValue,
            'first_name': firstNameInputValue,
            'last_name': lastNameInputValue
        });

        setCurrentUser({
            id: response.data.user.pk,
            first_name: response.data.user.fields.first_name,
            last_name: response.data.user.fields.last_name,
            email: response.data.user.fields.email
        })

        if (forward_to) {
            navigate(forward_to);
        } else {
            navigate(-1);
        }
    } catch (error) {
        // ? sign up failed on the back-end
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data.reason);
        } else {
            console.error(error);
        }
    }
}

export default function HostSignUpPage() {
    const currentUser = useContext(UserContext);
    const setCurrentUser = useContext(SetUserContext);

    const navigate = useNavigate();

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            { text: 'Home', route: '/' },
            { text: 'Sign up', route: '/host/sign_up' }
        ]);
    }

    // ? already logged in
    if (currentUser) {
        console.error('already logged in (front-end catch)');
        navigate('/');
        return;
    }

    const location = useLocation();

    // read forward_to specification from state
    let forward_to: string | undefined = undefined;
    try {
        forward_to = location.state.forward_to;
    } catch {
        forward_to = undefined;
    }

    return (
        <>
            <h1>Sign up</h1>
            <form onSubmit={(event) => {
                event.preventDefault();
                handleSignUp(setCurrentUser, navigate, forward_to);
            }}>
                <label htmlFor='first-name-field'>First name: </label>
                <input id='first-name-field' type='text'></input>
                <label htmlFor='last-name-field'>Last name: </label>
                <input id='last-name-field' type='text'></input>

                <label htmlFor='email-field'>Email: </label>
                <input id='email-field' type='email'></input>
                <label htmlFor='password-field'>Password: </label>
                <input id='password-field' type='password'></input>

                <input type='submit' value='Sign up'></input>
            </form>
            <p>
                Already have an account?
                <Link to='/host/log_in' state={forward_to ? { forward_to: forward_to } : undefined}>
                    Log in
                </Link>.
            </p>
        </>
    )
}
