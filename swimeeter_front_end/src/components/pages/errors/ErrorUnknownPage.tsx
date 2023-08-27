import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext, NavTreeAction } from "../../../App.tsx";

import { MainPageIcon } from "../../utilities/svgs/MainPageIcon.tsx";

export function ErrorUnknownPage() {
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
                <div className="flex flex-row justify-center items-center lg:gap-x-7 md:gap-x-6 sm:gap-x-4 gap-x-2">
                    <MainPageIcon icon="CIRCLE_EXCLAIM" color={`${interpretedScreenMode == "dark" ? "fill-red-300" : "fill-red-700"}`} />
                    <h1 className="font-extrabold italic lg:text-9xl md:text-8xl sm:text-6xl text-4xl text-red-700 dark:text-red-300">
                        ERROR
                    </h1>
                </div>
                <h2 className="text-red-700 dark:text-red-300 md:text-3xl text-2xl text-center w-5/6">
                    Sorry, the requested page was not found.
                </h2>
                <div className="flex flex-col md:flex-row justify-center gap-y-4 gap-x-7">
                    <button className="lg:text-4xl sm:text-3xl text-2xl font-semibold lg:p-5 sm:p-4 p-3 text-red-700 dark:text-red-300 rounded-md border-2 bg-red-300 hover:bg-red-400 border-red-400 dark:bg-red-700 hover:dark:bg-red-500 dark:border-red-500" onClick={() => navigate("/", { replace: true })}>
                        Go to home page
                    </button>
                    <button className="lg:text-4xl sm:text-3xl text-2xl font-semibold lg:p-5 sm:p-4 p-3 text-red-700 dark:text-red-300 rounded-md border-2 bg-red-300 hover:bg-red-400 border-red-400 dark:bg-red-700 hover:dark:bg-red-500 dark:border-red-500" onClick={() => navigate("/meets", { replace: true })}>
                        Browse meets
                    </button>
                </div>
            </div>
        </>
    )
}