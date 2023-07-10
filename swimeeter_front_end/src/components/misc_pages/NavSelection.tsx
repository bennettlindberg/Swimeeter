import { SetUserContext, UserContext } from "../../App.tsx";
import { useContext } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import handleLogOut from "../host_pages/LogOutHandler.tsx";

export default function NavSelection({ setHeaderSelect }: { setHeaderSelect: React.Dispatch<React.SetStateAction<boolean>> }) {
    const currentUser = useContext(UserContext);
    const setCurrentUser = useContext(SetUserContext);

    const navigate = useNavigate();

    const location = useLocation();

    return (
        <>
            {currentUser
                ? <>
                    <button onClick={() => {
                        setHeaderSelect(false);
                        handleLogOut(currentUser, setCurrentUser, navigate)
                    }}>Log out</button>
                    <button onClick={() => {
                        setHeaderSelect(false);
                        navigate('/host/view');
                    }}>My account</button>
                </>
                : <>
                    <button onClick={() => {
                        setHeaderSelect(false);
                        navigate('/host/log_in', { state: { forward_to: location.pathname } });
                    }}>Log in</button>
                    <button onClick={() => {
                        setHeaderSelect(false);
                        navigate('/host/sign_up', { state: { forward_to: location.pathname } });
                    }}>Sign up</button>
                </>
            }
        </>
    )
}