import { SetNavContext, SetUserContext, UserContext } from "../../App.tsx";
import type { User } from '../../App.tsx';
import { useContext } from 'react';
import axios from 'axios';
import { Link, useLocation, NavigateFunction, useNavigate } from "react-router-dom";

async function handleLogIn(
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

    try {
        const response = await axios.post('/auth/log_in/', { 'email': emailInputValue, 'password': passwordInputValue });

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
        // ? log in failed on the back-end
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data.reason);
        } else {
            console.error(error);
        }
    }
}

export default function HostLogInPage() {
    const currentUser = useContext(UserContext);
    const setCurrentUser = useContext(SetUserContext);

    const navigate = useNavigate();

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            { text: 'Home', route: '/' },
            { text: 'Log in', route: '/host/log_in' }
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
            <h1>Log in</h1>
            <form onSubmit={(event) => {
                event.preventDefault();
                handleLogIn(setCurrentUser, navigate, forward_to);
            }}>
                <label htmlFor='email-field'>Email: </label>
                <input id='email-field' type='email'></input>
                <label htmlFor='password-field'>Password: </label>
                <input id='password-field' type='password'></input>
                <input type='submit' value='Log in'></input>
            </form>
            <p>
                Don't have an account?
                <Link to='/host/sign_up' state={forward_to ? { forward_to: forward_to } : undefined}>
                    Sign up
                </Link>.
            </p>
        </>
    )
}
