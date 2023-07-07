import { SetUserContext, UserContext } from "../../App.tsx";
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import handleLogOut from "./LogOutHandler.tsx";

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