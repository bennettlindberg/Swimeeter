// * HOST
export type Host = {
    first_name: string,
    last_name: string,
    prefix: string,
    suffix: string,
    middle_initials: string
}

// * MEET
export type Meet = {
    name: string,
    begin_time: Date | null,
    end_time: Date | null,
    is_public: boolean,
    host: Host
}

export type MeetShallow = {
    name: string,
    begin_time: Date | null,
    end_time: Date | null,
    is_public: boolean,
    host: number
}

// * POOL
export type Pool = {
    name: string,
    street_address: string,
    city: string,
    state: string,
    country: string,
    zipcode: string,
    lanes: number,
    side_length: number,
    measure_unit: string,
    meet: MeetShallow
}

export type PoolShallow = {
    name: string,
    street_address: string,
    city: string,
    state: string,
    country: string,
    zipcode: string,
    lanes: number,
    side_length: number,
    measure_unit: string,
    meet: number
}

// * SESSION
export type Session = {
    name: string,
    begin_time: Date,
    end_time: Date,
    meet: MeetShallow,
    pool: PoolShallow
}

export type SessionShallow = {
    name: string,
    begin_time: Date,
    end_time: Date,
    meet: number,
    pool: number
}

// * EVENT
export type Event = {
    stroke: string,
    distance: number,
    is_relay: boolean,
    swimmers_per_entry: number,
    stage: string,
    competing_gender: string,
    competing_max_age: number,
    competing_min_age: number,
    order_in_session: number,
    total_heats: number | null,
    session: SessionShallow
}

export type EventShallow = {
    stroke: string,
    distance: number,
    is_relay: boolean,
    swimmers_per_entry: number,
    stage: string,
    competing_gender: string,
    competing_max_age: number,
    competing_min_age: number,
    order_in_session: number,
    total_heats: number | null,
    session: number
}

// * SWIMMER
export type Swimmer = {
    first_name: string,
    last_name: string,
    prefix: string,
    suffix: string,
    middle_initials: string,
    age: number,
    gender: string,
    team_name: string,
    team_acronym: string,
    meet: MeetShallow
}

export type SwimmerShallow = {
    first_name: string,
    last_name: string,
    prefix: string,
    suffix: string,
    middle_initials: string,
    age: number,
    gender: string,
    team_name: string,
    team_acronym: string,
    meet: number
}

// * INDIVIDUAL ENTRY
export type IndividualEntry = {
    seed_time: number,
    heat_number: number | null,
    lane_number: number | null,
    swimmer: SwimmerShallow,
    event: EventShallow
}

// * RELAY ASSIGNMENT
export type RelayAssignment = {
    order_in_relay: number,
    seed_relay_split: number,
    swimmer: SwimmerShallow,
    relay_entry: number
}

// * RELAY ENTRY
export type RelayEntry = {
    seed_time: number,
    heat_number: number | null,
    lane_number: number | null,
    relay_assignments: RelayAssignment,
    event: EventShallow
}