import './App.css'
import NavSelection from './components/component_library/NavSelection.tsx'
import { useState, useEffect, createContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

// CSRF token
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

// types
export type User = {
    id: number,
    first_name: string,
    last_name: string,
    email: string
}

export type navItem = {
    text: string,
    route: string
}

// contexts
export const UserContext = createContext<User | null>(null);
export const SetUserContext = createContext<React.Dispatch<React.SetStateAction<User | null>> | null>(null);
export const SetNavContext = createContext<React.Dispatch<React.SetStateAction<navItem[]>> | null>(null);

// component
export function App() {
    setCSRFHeader();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [navItems, setNavItems] = useState<navItem[]>([{ text: 'Home', route: '/' }]);
    const [headerSelected, setHeaderSelected] = useState<boolean>(false);

    const navigate = useNavigate();

    // log in the user on the front-end if session data maintained the user's log in on the back-end
    useEffect(() => {
        axios.get('/auth/init-check/')
            .then((response: AxiosResponse) => {
                if (response.data.get_success) {
                    // logged in on the back-end
                    setCurrentUser({
                        id: response.data.user.pk,
                        first_name: response.data.user.fields.first_name,
                        last_name: response.data.user.fields.last_name,
                        email: response.data.user.fields.email
                    })
                }
                // ? not logged in on the back-end: silently fail
            })
    }, []);

    return (
        <>
            <UserContext.Provider value={currentUser}>
                <SetUserContext.Provider value={setCurrentUser}>
                    <SetNavContext.Provider value={setNavItems}>
                        <header>
                            <h1>Swimeeter</h1>
                            <button onClick={() => setHeaderSelected(!headerSelected)}>
                                {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Guest User'}
                            </button>
                            {headerSelected && <NavSelection setHeaderSelect={setHeaderSelected} />}
                        </header>
                        <nav>
                            {navItems.map((item, index) => {
                                // ? omit '>' for last nav item
                                if (index == navItems.length - 1) {
                                    return <button onClick={() => navigate(item.route)}>
                                        {item.text}
                                    </button>
                                }
                                return <>
                                    <button onClick={() => navigate(item.route)}>
                                        {item.text}
                                    </button>
                                    <p>&gt;</p>
                                </>
                            })}
                            <p>--------</p>
                        </nav>
                        <main>
                            <Outlet />
                        </main>
                        <footer>
                            <p>--------</p>
                            <p>footer here</p>
                        </footer>
                    </SetNavContext.Provider>
                </SetUserContext.Provider>
            </UserContext.Provider>
        </>
    )
}