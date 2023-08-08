// * HOST
export type Host = {
    model: string,
    pk: number,
    fields: {
        first_name: string,
        last_name: string,
        prefix: string,
        suffix: string,
        middle_initials: string
    }
}

// * MEET
export type Meet = {
    model: string,
    pk: number,
    fields: {
        name: string,
        begin_time: Date | null,
        end_time: Date | null,
        is_public: boolean,
        host: Host
    }
}

export type MeetShallow = {
    model: string,
    pk: number,
    fields: {
        name: string,
        begin_time: Date | null,
        end_time: Date | null,
        is_public: boolean,
        host: number
    }
}

// * POOL
export type Pool = {
    model: string,
    pk: number,
    fields: {
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
}

export type PoolShallow = {
    model: string,
    pk: number,
    fields: {
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
}

// * SESSION
export type Session = {
    model: string,
    pk: number,
    fields: {
        name: string,
        begin_time: Date,
        end_time: Date,
        meet: MeetShallow,
        pool: PoolShallow
    }
}

export type SessionShallow = {
    model: string,
    pk: number,
    fields: {
        name: string,
        begin_time: Date,
        end_time: Date,
        meet: number,
        pool: number
    }
}

// * EVENT
export type Event = {
    model: string,
    pk: number,
    fields: {
        stroke: string,
        distance: number,
        is_relay: boolean,
        swimmers_per_entry: number,
        stage: string,
        competing_gender: string,
        competing_max_age: number | null,
        competing_min_age: number | null,
        order_in_session: number,
        total_heats: number | null,
        session: SessionShallow
    }
}

export type EventShallow = {
    model: string,
    pk: number,
    fields: {
        stroke: string,
        distance: number,
        is_relay: boolean,
        swimmers_per_entry: number,
        stage: string,
        competing_gender: string,
        competing_max_age: number | null,
        competing_min_age: number | null,
        order_in_session: number,
        total_heats: number | null,
        session: number
    }
}

// * TEAM
export type Team = {
    model: string,
    pk: number,
    fields: {
        name: string,
        acronym: string,
        meet: MeetShallow
    }
}

export type TeamShallow = {
    model: string,
    pk: number,
    fields: {
        name: string,
        acronym: string,
        meet: number
    }
}

// * SWIMMER
export type Swimmer = {
    model: string,
    pk: number,
    fields: {
        first_name: string,
        last_name: string,
        prefix: string,
        suffix: string,
        middle_initials: string,
        age: number,
        gender: string,
        team: TeamShallow,
        meet: MeetShallow
    }
}

export type SwimmerShallow = {
    model: string,
    pk: number,
    fields: {
        first_name: string,
        last_name: string,
        prefix: string,
        suffix: string,
        middle_initials: string,
        age: number,
        gender: string,
        team: number,
        meet: number
    }
}

// * INDIVIDUAL ENTRY
export type IndividualEntry = {
    model: string,
    pk: number,
    fields: {
        seed_time: number,
        heat_number: number | null,
        lane_number: number | null,
        swimmer: SwimmerShallow,
        event: EventShallow
    }
}

// * RELAY ASSIGNMENT
export type RelayAssignment = {
    model: string,
    pk: number,
    fields: {
        order_in_relay: number,
        seed_relay_split: number,
        swimmer: Swimmer,
        relay_entry: number
    }
}

// * RELAY ENTRY
export type RelayEntry = {
    model: string,
    pk: number,
    fields: {
        seed_time: number,
        heat_number: number | null,
        lane_number: number | null,
        relay_assignments: RelayAssignment[],
        event: EventShallow
    }
}