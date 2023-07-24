import { useReducer, useEffect, createContext } from 'react';
import { Outlet } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

import { NavTree } from './components/navigation/NavTree.tsx';

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
    data_entry_warnings: boolean,
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
    type: "LOG_OUT" | "DELETE_ACCOUNT" | "DEACTIVATE_ACCOUNT" | "UPDATE_PREFERENCES",
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
        case "DEACTIVATE_ACCOUNT":
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
    navTreeDispatch: React.Dispatch<NavTreeAction>
}

export const AppContext = createContext<AppContextType>({
    userState: {
        logged_in: false,
        preferences: {
            screen_mode: "system",
            data_entry_information: true,
            data_entry_warnings: true,
            destructive_action_confirms: true,
            motion_safe: true
        }
    },
    userDispatch: () => { },
    navTreeState: [],
    navTreeDispatch: () => { }
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
            data_entry_warnings: true,
            destructive_action_confirms: true,
            motion_safe: true
        }
    });
    const [navTreeState, navTreeDispatch] = useReducer(navTreeReducer, [
        { title: "HOME", route: "/" }, {title: "TEST", route: "/"}
    ])

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
            })
            .catch((error) => {
                // ? init check failed on the back-end
                if (axios.isAxiosError(error)) {
                    console.error(error.response?.data.reason);
                } else {
                    console.error(error);
                }
            });
    }, []);

    return (
        <>
            <AppContext.Provider value={{
                userState: userState,
                userDispatch: userDispatch,
                navTreeState: navTreeState,
                navTreeDispatch: navTreeDispatch
            }}>
                <header>
                    
                </header>
                <nav>
                    <NavTree />
                </nav>
                <main>
                    <Outlet />
                </main>
            </AppContext.Provider>
        </>
    )
}