import { useEffect, useContext } from "react";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { IconSVG } from "../../utilities/svgs/IconSVG.tsx";
import { useNavigate } from "react-router-dom";

export function Error404Page() {
    // * initialize context and navigation
    const { navTreeDispatch, interpretedScreenMode, setTabTitle }: {
        interpretedScreenMode: "light" | "dark",
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: []
        })
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("Error | Swimeeter"), []);

    // * calculate window height without navbar
    const windowHeight = window.innerHeight - 80;

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-y-7 bg-gradient-to-t from-red-300 dark:from-red-700" style={{ height: windowHeight }}>
                <div className="flex flex-row justify-center items-center gap-x-7">
                    <IconSVG icon="CIRCLE_EXCLAIM" color={`${interpretedScreenMode == "dark" ? "fill-red-300" : "fill-red-700"}`} width="w-[200px]" height="h-[200px]" />
                    <h1 className="font-extrabold italic text-9xl text-red-700 dark:text-red-300">
                        ERROR 404
                    </h1>
                </div>
                <h2 className="text-red-700 dark:text-red-300 text-3xl text-center w-5/6">
                    Sorry, the requested page was not found.
                </h2>
                <div className="flex flex-row justify-center gap-x-7">
                    <button className="text-4xl font-semibold p-5 text-red-700 dark:text-red-300 rounded-md border-2 bg-red-300 hover:bg-red-400 border-red-400 dark:bg-red-700 hover:dark:bg-red-500 dark:border-red-500" onClick={() => navigate("/", { replace: true })}>
                        Go to home page
                    </button>
                    <button className="text-4xl font-semibold p-5 text-red-700 dark:text-red-300 rounded-md border-2 bg-red-300 hover:bg-red-400 border-red-400 dark:bg-red-700 hover:dark:bg-red-500 dark:border-red-500" onClick={() => navigate("meets", { replace: true })}>
                        Browse meets
                    </button>
                </div>
            </div>
        </>
    )
}