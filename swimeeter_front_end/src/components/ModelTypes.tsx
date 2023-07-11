type MeetData = {
    model: string,
    pk: number,
    fields: {
        name: string,
        lanes: number,
        measure_unit: string,
        host: number
    }
};

type HostData = {
    model: string,
    pk: number,
    fields: {
        first_name: string,
        last_name: number
    }
};

export type { MeetData, HostData }