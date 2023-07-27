import { createBrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";

// * GENERAL
import { HomePage } from "./components/pages/general/HomePage.tsx";
import { AboutPage } from "./components/pages/general/AboutPage.tsx";
import { LogInPage } from "./components/pages/general/LogInPage.tsx";
import { SignUpPage } from "./components/pages/general/SignUpPage.tsx";
import { SettingsPage } from "./components/pages/general/SettingsPage.tsx";

// * MEETS
import { MeetsListPage } from "./components/pages/meets/MeetsListPage.tsx";
import { MeetCreationPage } from "./components/pages/meets/MeetCreationPage.tsx";
import { MeetPage } from "./components/pages/meets/MeetPage.tsx";

// * POOLS
import { PoolPage } from "./components/pages/pools/PoolPage.tsx";
import { PoolCreationPage } from "./components/pages/pools/PoolCreationPage.tsx";

// * SESSIONS
import { SessionPage } from "./components/pages/sessions/SessionPage.tsx";
import { SessionCreationPage } from "./components/pages/sessions/SessionCreationPage.tsx";
// * EVENTS
import { EventPage } from "./components/pages/events/EventPage.tsx";
import { EventCreationPage } from "./components/pages/events/EventCreationPage.tsx";

// * SWIMMERS
import { SwimmerPage } from "./components/pages/swimmers/SwimmerPage.tsx";
import { SwimmerCreationPage } from "./components/pages/swimmers/SwimmerCreationPage.tsx";

// * INDIVIDUAL ENTRIES
import { IndividualEntryPage } from "./components/pages/individual_entries/IndividualEntryPage.tsx";
import { IndividualEntryCreationPage } from "./components/pages/individual_entries/IndividualEntryCreationPage.tsx";

// * RELAY ENTRIES
import { RelayEntryPage } from "./components/pages/relay_entries/RelayEntryPage.tsx";
import { RelayEntryCreationPage } from "./components/pages/relay_entries/RelayEntryCreationPage.tsx";

// * HEAT SHEETS
import { HeatSheetPage } from "./components/pages/heat_sheets/HeatSheetPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            // * GENERAL
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "about",
                element: <AboutPage />,
            },
            {
                path: "log_in",
                element: <LogInPage />,
            },
            {
                path: "sign_up",
                element: <SignUpPage />,
            },
            {
                path: "settings",
                element: <SettingsPage />,
            },

            // * MEETS
            {
                path: "meets",
                element: <MeetsListPage />,
            },
            {
                path: "meets/create",
                element: <MeetCreationPage />,
            },
            {
                path: "meets/:meet_id",
                element: <MeetPage />,
            },

            // * POOLS
            {
                path: "meets/:meet_id/pools/:pool_id",
                element: <PoolPage />,
            },
            {
                path: "meets/:meet_id/pools/create",
                element: <PoolCreationPage />,
            },

            // * SESSIONS
            {
                path: "meets/:meet_id/sessions/:session_id",
                element: <SessionPage />,
            },
            {
                path: "meets/:meet_id/sessions/create",
                element: <SessionCreationPage />,
            },

            // * EVENTS
            {
                path: "meets/:meet_id/sessions/:session_id/events/:event_id",
                element: <EventPage />,
            },
            {
                path: "meets/:meet_id/sessions/:session_id/events/create",
                element: <EventCreationPage />,
            },

            // * SWIMMERS
            {
                path: "meets/:meet_id/swimmers/:swimmer_id",
                element: <SwimmerPage />,
            },
            {
                path: "meets/:meet_id/swimmers/create",
                element: <SwimmerCreationPage />,
            },

            // * INDIVIDUAL ENTRIES
            {
                path: "meets/:meet_id/swimmers/:swimmer_id/individual_entries/:individual_entry_id",
                element: <IndividualEntryPage />,
            },
            {
                path: "meets/:meet_id/swimmers/:swimmer_id/individual_entries/create",
                element: <IndividualEntryCreationPage />,
            },
            {
                path: "meets/:meet_id/sessions/:session_id/events/:event_id/individual_entries/:individual_entry_id",
                element: <IndividualEntryPage />,
            },
            {
                path: "meets/:meet_id/sessions/:session_id/events/:event_id/individual_entries/create",
                element: <IndividualEntryCreationPage />,
            },
            
            // * RELAY ENTRIES
            {
                path: "meets/:meet_id/swimmers/:swimmer_id/relay_entries/:relay_entry_id",
                element: <RelayEntryPage />,
            },
            {
                path: "meets/:meet_id/swimmers/:swimmer_id/relay_entries/create",
                element: <RelayEntryCreationPage />,
            },
            {
                path: "meets/:meet_id/sessions/:session_id/events/:event_id/relay_entries/:relay_entry_id",
                element: <RelayEntryPage />,
            },
            {
                path: "meets/:meet_id/sessions/:session_id/events/:event_id/relay_entries/create",
                element: <RelayEntryCreationPage />,
            },

            // * HEAT SHEETS
            {
                path: "meets/:meet_id/heat_sheet",
                element: <HeatSheetPage />,
            },
        ],
    },
]);

export default router;

/*

! URL ROUTING

/ (home)
/about
/log_in
/sign_up
/settings -> profile, preferences, logout button

/meets -> public, my meets, create button
/meets/create
/meets/:meet_id -> info, pools, sessions, events, swimmers (CREATE BUTTONS!)

(from meets)
.../pools/:pool_id -> info, sessions, create button
.../pools/create
.../sessions/:session_id -> info (with pool), events, swimmers, heat sheet, create button
.../sessions/create
.../events/:event_id -> info (with session), entries, heat sheet, create button
.../events/create
.../swimmers/:swimmer_id -> info, individual entries, relay entries, heat sheet, create button
.../swimmers/create
.../heat_sheet -> info, each session's heat sheet

(from swimmers or events)
.../relay_entries/:relay_entry_id -> info, heat from HS, create button
.../relay_entries/create
.../individual_entries/:individual_entry_id -> info, heat from HS, create button
.../individual_entries/create

*/