import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Error404Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/errors/404");
    }, [])

    return (
        <>
        </>
    )
}