import { useState, useReducer, useEffect, createContext } from 'react';
import { Outlet } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

import { NavTree } from './components/utilities/navigation/NavTree.tsx';
import { NavBar } from './components/utilities/navigation/NavBar.tsx';

// ! CSRF token
function setCSRFHeader(): void {
    const getCSRFToken = (): string => {
        let csrfToken: string = 'not found';

        const cookies: string[] = document.cookie.split(';');
        for (let cookie of cookies) {
            const crumbs: string[] = cookie.split('=');
            if (crumbs[0].trim() === 'csrftoken') {
                csrfToken = crumbs[1];
            }
        }
        return csrfToken;
    }
    axios.defaults.headers.common['X-CSRFToken'] = getCSRFToken();
}

// * helper types
type Profile = {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    prefix: string,
    suffix: string,
    middle_initials: string
}

type Preferences = {
    screen_mode: "light" | "dark" | "system",
    data_entry_information: boolean,
    destructive_action_confirms: boolean,
    motion_safe: boolean
}

// * user reducer
export type UserState = {
    logged_in: boolean,
    profile?: Profile,
    preferences: Preferences
}

export type UserAction = {
    type: "LOG_IN" | "SIGN_UP"
    profile: Profile,
    preferences: Preferences
} | {
    type: "UPDATE_PROFILE",
    profile: Profile
} | {
    type: "LOG_OUT" | "DELETE_ACCOUNT" | "UPDATE_PREFERENCES",
    preferences: Preferences
}

function userReducer(state: UserState, action: UserAction) {
    switch (action.type) {
        case "LOG_IN":
        case "SIGN_UP":
            return {
                logged_in: true,
                profile: { ...action.profile },
                preferences: { ...action.preferences }
            }

        case "DELETE_ACCOUNT":
        case "LOG_OUT":
            return {
                logged_in: false,
                profile: undefined,
                preferences: { ...action.preferences }
            }

        case "UPDATE_PROFILE":
            return {
                ...state,
                profile: { ...action.profile }
            }

        case "UPDATE_PREFERENCES":
            return {
                ...state,
                preferences: { ...action.preferences }
            }

        default:
            return state;
    }
}

// * nav tree reducer
export type NavTreeItem = {
    title: string,
    route: string
}

export type NavTreeAction = {
    type: string,
    data: NavTreeItem[]
}

function navTreeReducer(state: NavTreeItem[], action: NavTreeAction) {
    switch (action.type) {
        case "UPDATE_TREE":
            return action.data;

        default:
            return state;
    }
}

// * App.tsx context
type AppContextType = {
    userState: UserState,
    userDispatch: React.Dispatch<UserAction>,
    navTreeState: NavTreeItem[],
    navTreeDispatch: React.Dispatch<NavTreeAction>,
    interpretedScreenMode: "light" | "dark",
    setTabTitle: (title: string) => void
}

export const AppContext = createContext<AppContextType>({
    userState: {
        logged_in: false,
        profile: undefined,
        preferences: {
            screen_mode: "system",
            data_entry_information: true,
            destructive_action_confirms: true,
            motion_safe: true
        }
    },
    userDispatch: () => { },
    navTreeState: [],
    navTreeDispatch: () => { },
    interpretedScreenMode: "light",
    setTabTitle: () => { }
});

// ~ component
export function App() {
    // ! CSRF token
    setCSRFHeader();

    // * initialize state variables
    const [userState, userDispatch] = useReducer(userReducer, {
        logged_in: false,
        profile: undefined,
        preferences: {
            screen_mode: "system",
            data_entry_information: true,
            destructive_action_confirms: true,
            motion_safe: true
        }
    });
    const [navTreeState, navTreeDispatch] = useReducer(navTreeReducer, []);
    const [interpretedScreenMode, setInterpretedScreenMode] = useState<"light" | "dark">("light");
    const [initCheckComplete, setInitCheckComplete] = useState<boolean>(false);

    // ! initialize user state
    useEffect(() => {
        axios.get('/auth/init_check/')
            .then((response: AxiosResponse) => {
                // * logged in (use user data)
                if (response.data.logged_in) {
                    userDispatch({
                        type: "LOG_IN",
                        profile: response.data.profile,
                        preferences: response.data.preferences
                    })
                    // * logged out (use session data)
                } else {
                    userDispatch({
                        type: "UPDATE_PREFERENCES",
                        preferences: response.data.preferences
                    })
                }

                setInitCheckComplete(true);
            })
            .catch((error) => {
                // ? init check failed on the back-end
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data.reason);
                } else {
                    console.error(error);
                }
            });

        const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        colorSchemeMediaQuery.onchange = (query) => {
            if (query.matches) {
                setInterpretedScreenMode("dark");
            } else {
                setInterpretedScreenMode("light");
            }
        }
    }, []);

    // * interpret screen mode preference
    useEffect(() => {
        switch (userState.preferences.screen_mode) {
            case "light":
                setInterpretedScreenMode("light");
                break;

            case "dark":
                setInterpretedScreenMode("dark");
                break;

            case "system":
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    setInterpretedScreenMode("dark");
                    break;
                } else {
                    setInterpretedScreenMode("light");
                    break;
                }
        }
    }, [userState.preferences.screen_mode]);

    // * set dark on <html> and <body> elements
    if (interpretedScreenMode === "dark") {
        document.getElementsByTagName("html")[0].setAttribute("class", "dark")
        document.getElementsByTagName("body")[0].setAttribute("style", "background-color:black;")
    } else {
        document.getElementsByTagName("html")[0].setAttribute("class", "light")
        document.getElementsByTagName("body")[0].setAttribute("style", "background-color:white;")
    }

    return (
        <>
            <AppContext.Provider value={{
                userState: userState,
                userDispatch: userDispatch,
                navTreeState: navTreeState,
                navTreeDispatch: navTreeDispatch,
                interpretedScreenMode: interpretedScreenMode,
                setTabTitle: (title: string) => {
                    const titleElement = document.getElementsByTagName("title")[0];
                    titleElement.innerHTML = title;
                }
            }}>
                <header>
                    <NavBar />
                </header>
                <nav>
                    <NavTree />
                </nav>
                <main className="text-black dark:text-white">
                    {initCheckComplete && <Outlet />}
                </main>
            </AppContext.Provider>
        </>
    )
}