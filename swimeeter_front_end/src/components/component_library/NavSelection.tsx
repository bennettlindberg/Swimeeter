import { SetUserContext, UserContext } from "../../App.tsx";
import { useContext } from 'react';
import axios from 'axios';
import { NavigateFunction, useNavigate } from "react-router-dom";

import type { User } from '../../App.tsx';

// log out handler
async function handleLogOut(
    currentUser: User | null,
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>> | null,
    navigate: NavigateFunction
) {
    // ? already logged out
    if (currentUser == null || setCurrentUser == null) {
        console.error('already logged out (front-end catch)')
        return;
    }
    
    try {
        const response = await axios.post('/auth/log_out/');
        
        setCurrentUser(null);
        navigate(-1); // route to where user came from
    } catch (error) {
        // ? log out failed on the back-end
        if (axios.isAxiosError(error)) {
            console.error(error.response?.data.reason);
        } else {
            console.error('an unknown error occurred');
        }
    }
}

export default function NavSelection() {
    const currentUser = useContext(UserContext);
    const setCurrentUser = useContext(SetUserContext);

    const navigate = useNavigate();

    return (
        <>
            { currentUser
                ? <>
                    <button onClick = {() => handleLogOut(currentUser, setCurrentUser, navigate)}>Log out</button>
                    <button onClick = {() => navigate('/host/view')}>My account</button>
                </>
                : <>
                    <button onClick = {() => navigate('/host/log_in')}>Log in</button>
                    <button onClick = {() => navigate('/host/sign_up')}>Sign up</button>
                </>
            }
        </>
    )
}