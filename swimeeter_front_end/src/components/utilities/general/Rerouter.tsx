import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Rerouter() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        navigate(location.state.forward_route);
    }, []);

    return (
        <></>
    )
}