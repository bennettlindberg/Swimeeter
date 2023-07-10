import { SetNavContext, SetUserContext, UserContext } from "../../App.tsx";
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import handleLogOut from "./LogOutHandler.tsx";

export default function HostViewPage() {
    const currentUser = useContext(UserContext);
    const setCurrentUser = useContext(SetUserContext);

    const navigate = useNavigate();

    if (currentUser == null) {
        navigate('/host/log_in', {state: {forward_to: '/host/view'}});
        return;
    }

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([
            {text: 'Home', route: '/'},
            {text: 'View account', route: '/host/view'}
        ]);
    }

    return (
        <>
            <h1>My account</h1>

            <p>First name: </p>
            <p>{currentUser.first_name}</p>
            <p>Last name: </p>
            <p>{currentUser.last_name}</p>
            <p>Email: </p>
            <p>{currentUser.email}</p>

            <button onClick = {() => navigate('/host/edit')}>Edit account</button>
            <button onClick = {() => handleLogOut(currentUser, setCurrentUser, navigate)}>
                Log out
            </button>
        </>
    )
}
