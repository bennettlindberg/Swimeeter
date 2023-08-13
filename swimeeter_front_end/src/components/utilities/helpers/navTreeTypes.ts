type TreeItem = {
    title: string,
    id: number,
    route: string
}

export type MeetTree = {
    MEET: TreeItem
}

export type PoolTree = {
    MEET: TreeItem,
    POOL: TreeItem
}

export type SessionTree = {
    MEET: TreeItem,
    SESSION: TreeItem
}

export type TeamTree = {
    MEET: TreeItem,
    TEAM: TreeItem
}

export type EventTree = {
    MEET: TreeItem,
    SESSION: TreeItem,
    EVENT: TreeItem
}

export type SwimmerTree = {
    MEET: TreeItem,
    SWIMMER: TreeItem
}

export type IndividualEntryTree = {
    MEET: TreeItem,
    EVENT: TreeItem,
    INDIVIDUAL_ENTRY: TreeItem
}

export type RelayEntryTree = {
    MEET: TreeItem,
    EVENT: TreeItem,
    RELAY_ENTRY: TreeItem
}