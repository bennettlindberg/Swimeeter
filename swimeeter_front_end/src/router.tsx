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

// * TEAMS
import { TeamPage } from "./components/pages/teams/TeamPage.tsx";
import { TeamCreationPage } from "./components/pages/teams/TeamCreationPage.tsx";

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
import { SeedingPage } from "./components/pages/seeding/SeedingPage.tsx";

// * ERRORS
import { Error404Redirect } from "./components/pages/errors/Error404Redirect.tsx";
import { Error404Page } from "./components/pages/errors/Error404Page.tsx";
import { ErrorUnknownPage } from "./components/pages/errors/ErrorUnknownPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Error404Redirect />,
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
                path: "meets/:meet_id/events/:event_type/:event_id",
                element: <EventPage />,
            },
            {
                path: "meets/:meet_id/events/:event_type/create",
                element: <EventCreationPage />,
            },

            // * TEAMS
            {
                path: "meets/:meet_id/teams/:team_id",
                element: <TeamPage />,
            },
            {
                path: "meets/:meet_id/teams/create",
                element: <TeamCreationPage />,
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
                path: "meets/:meet_id/individual_entries/:individual_entry_id",
                element: <IndividualEntryPage />,
            },
            {
                path: "meets/:meet_id/individual_entries/create",
                element: <IndividualEntryCreationPage />,
            },

            // * RELAY ENTRIES
            {
                path: "meets/:meet_id/relay_entries/:relay_entry_id",
                element: <RelayEntryPage />,
            },
            {
                path: "meets/:meet_id/relay_entries/create",
                element: <RelayEntryCreationPage />,
            },

            // * HEAT SHEETS
            {
                path: "meets/:meet_id/seeding",
                element: <SeedingPage />,
            },

            // * ERRORS
            {
                path: "errors/404",
                element: <Error404Page />,
            },
            {
                path: "errors/unknown",
                element: <ErrorUnknownPage />,
            },
        ],
    },
]);

export default router;
