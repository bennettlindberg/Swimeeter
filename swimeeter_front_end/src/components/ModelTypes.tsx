type HostData = {
    model: string,
    pk: number,
    fields: {
        first_name: string,
        last_name: number
    }
};

type MeetData = {
    model: string,
    pk: number,
    fields: {
        name: string,
        begin_date: string,
        end_date: string,
        lanes: number,
        measure_unit: string,
        host: HostData
    }
};

export type { MeetData, HostData }