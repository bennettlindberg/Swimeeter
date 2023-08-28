import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Rerouter() {
    const navigate = useNavigate();
    const location = useLocation();

    let forwardRoute = "/";
    let locationState: any = {};
    try {
        forwardRoute = location.state.forward_route;
        locationState = location.state;
        delete locationState.forward_route;
    } catch {
        locationState = {};
    }

    useEffect(() => {
        navigate(forwardRoute, {state: {...locationState}});
    }, []);

    return (
        <></>
    )
}