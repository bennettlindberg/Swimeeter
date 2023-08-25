type EntryData = {
    entry_id: number,
    entry_name: string,
    entry_team: string,
    entry_seed_time: number
}

type LaneData = {
    lane_number: number,
    entry_data: EntryData | null
}

type HeatData = {
    heat_number: number,
    lanes_data: LaneData[]
}

type EventData = {
    event_id: number,
    event_name: string,
    event_number: number,
    event_is_relay: boolean,
    heats_data: HeatData[] | null
}

type SessionData = {
    session_id: number,
    session_name: string,
    session_number: number,
    events_data: EventData[]
}

export type MeetHeatSheet = {
    meet_id: number,
    meet_name: string,
    sessions_data: SessionData[]
}

export type PoolHeatSheet = {
    pool_id: number,
    pool_name: string,
    sessions_data: SessionData[]
}

export type TeamHeatSheet = {
    team_id: number,
    team_name: string,
    sessions_data: SessionData[]
}

export type SwimmerHeatSheet = {
    swimmer_id: number,
    swimmer_name: string,
    sessions_data: {
        session_id: number,
        session_name: string,
        session_number: number,
        events_data: {
            event_id: number,
            event_name: string,
            event_number: number,
            event_is_relay: boolean,
            heat_data: HeatData | null
        }[]
    }[]
}

export type SessionHeatSheet = SessionData

export type EventHeatSheet = EventData

export type EntryHeatSheet = {
    entry_id: number,
    entry_name: string,
    heat_data: HeatData | null
}