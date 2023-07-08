import { SetNavContext, UserContext } from "../../App.tsx";
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const currentUser = useContext(UserContext);

    const navigate = useNavigate();

    // update nav bar
    const setNavItems = useContext(SetNavContext);
    if (setNavItems) {
        setNavItems([{text: 'Home', route: '/'}]);
    }

    return (
        <>
            <h1>Welcome, {
                currentUser
                ? `${currentUser.first_name}`
                : 'Guest'
            }!</h1>

            <button onClick={() => navigate('/meets')}>View meets</button>
            <button onClick={
                currentUser
                ? (() => navigate('/meets/create'))
                : (() => navigate('/host/log_in', {state: {forward_to: '/meets/create'}}))
            }>Host a meet</button>
        </>
    )
}
