import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";

import HomePage from "./components/misc_pages/HomePage.tsx";
import EntryEditPage from "./components/misc_pages/EntryEditPage.tsx";

import MeetsListPage from "./components/meet_pages/MeetsListPage.tsx";
import MeetPage from "./components/meet_pages/MeetPage.tsx";
import MeetEditPage from "./components/meet_pages/MeetEditPage.tsx";
import MeetCreationPage from "./components/meet_pages/MeetCreationPage.tsx";

import EventsListPage from "./components/event_pages/EventsListPage.tsx";
import EventPage from "./components/event_pages/EventPage.tsx";
import EventEditPage from "./components/event_pages/EventEditPage.tsx";

import SwimmersListPage from "./components/swimmer_pages/SwimmersListPage.tsx";
import SwimmerPage from "./components/swimmer_pages/SwimmerPage.tsx";
import SwimmerEditPage from "./components/swimmer_pages/SwimmerEditPage.tsx";

import HeatSheetPage from "./components/heat_sheet_pages/HeatSheetPage.tsx";
import HeatSheetEventPage from "./components/heat_sheet_pages/HeatSheetEventPage.tsx";
import HeatSheetHeatPage from "./components/heat_sheet_pages/HeatSheetHeatPage.tsx";
import HeatSheetCreationPage from "./components/heat_sheet_pages/HeatSheetCreationPage.tsx";

import HostLogInPage from "./components/host_pages/HostLogInPage.tsx";
import HostSignUpPage from "./components/host_pages/HostSignUpPage.tsx";
import HostEditPage from "./components/host_pages/HostEditPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            // ! MEETS
            {
                path: "meets",
                element: <MeetsListPage />,
            },
            {
                path: "meets/:meet_id",
                element: <MeetPage />,
            },
            {
                path: "meets/:meet_id/edit",
                element: <MeetEditPage />,
            },
            {
                path: "meets/:meet_id/entries/:entry_id/edit",
                element: <EntryEditPage />,
            },
            {
                path: "meets/create",
                element: <MeetCreationPage />,
            },
            // * MEET EVENTS
            {
                path: "meets/:meet_id/events",
                element: <EventsListPage />,
            },
            {
                path: "meets/:meet_id/events/:event_id",
                element: <EventPage />,
            },
            {
                path: "meets/:meet_id/events/:event_id/edit",
                element: <EventEditPage />,
            },
            // * MEET SWIMMERS
            {
                path: "meets/:meet_id/swimmers",
                element: <SwimmersListPage />,
            },
            {
                path: "meets/:meet_id/swimmers/:swimmer_id",
                element: <SwimmerPage />,
            },
            {
                path: "meets/:meet_id/swimmers/:swimmer_id/edit",
                element: <SwimmerEditPage />,
            },
            // * MEET HEAT SHEET
            {
                path: "meets/:meet_id/heat_sheet",
                element: <HeatSheetPage />,
            },
            {
                path: "meets/:meet_id/heat_sheet/:event_id",
                element: <HeatSheetEventPage />,
            },
            {
                path: "meets/:meet_id/heat_sheet/:event_id/:heat_id",
                element: <HeatSheetHeatPage />,
            },
            {
                path: "meets/:meet_id/heat_sheet/generate",
                element: <HeatSheetCreationPage />,
            },
            // ! HOSTS 
            {
                path: "host/log_in",
                element: <HostLogInPage />,
            },
            {
                path: "host/sign_up",
                element: <HostSignUpPage />,
            },
            {
                path: "host/edit",
                element: <HostEditPage />,
            },
        ],
    },
]);

export default router;

/*
! URL ROUTING
/
/meets
    /:meet_id
        /events
            /:event_id
                /edit [EVENT] --login only
        /swimmers
            /:swimmer_id
                /edit [SWIMMER] --login only
        /heat_sheet
            /:event_id
                /:heat_id
            /generate --login only
        /entries/:entry_id/edit [ENTRY] --login only
        /edit [MEET] --login only
    /create
/host <-- doesn't exist as a page
    /log_in
    /sign_up
    /edit [HOST] --login only
*/