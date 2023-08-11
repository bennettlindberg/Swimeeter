import { Host, Event, IndividualEntry, RelayEntry, Swimmer } from "./modelTypes";

export function generateHostName(host: Host) {
    let hostName = "";

    if (host.fields.prefix !== "") {
        hostName += host.fields.prefix + " ";
    }

    hostName += host.fields.first_name + " ";

    if (host.fields.middle_initials !== "") {
        hostName += host.fields.middle_initials + " ";
    }

    hostName += host.fields.last_name;

    if (host.fields.suffix !== "") {
        hostName += " " + host.fields.suffix;
        }

    return hostName;
}

export function generateUserProfileName(user: {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    prefix: string,
    suffix: string,
    middle_initials: string
}) {
    let userName = "";

    if (user.prefix !== "") {
        userName += user.prefix + " ";
    }

    userName += user.first_name + " ";

    if (user.middle_initials !== "") {
        userName += user.middle_initials + " ";
    }

    userName += user.last_name;

    if (user.suffix !== "") {
        userName += " " + user.suffix;
        }

    return userName;
}

export function generateSwimmerName(swimmer: Swimmer) {
    let swimmerName = "";

    if (swimmer.fields.prefix !== "") {
        swimmerName += swimmer.fields.prefix + " ";
    }

    swimmerName += swimmer.fields.first_name + " ";

    if (swimmer.fields.middle_initials !== "") {
        swimmerName += swimmer.fields.middle_initials + " ";
    }

    swimmerName += swimmer.fields.last_name;

    if (swimmer.fields.suffix !== "") {
        swimmerName += " " + swimmer.fields.suffix;
        }

    return swimmerName;
}

export function generateEventName(event: Event) {
    let eventName = event.fields.competing_gender + "s ";

    if (event.fields.competing_min_age && event.fields.competing_max_age) {
        if (event.fields.competing_min_age === event.fields.competing_max_age) {
            eventName += event.fields.competing_min_age + " Only ";
        } else {
            eventName += event.fields.competing_min_age + "-" + event.fields.competing_max_age + " ";
        }
    } else if (event.fields.competing_min_age) {
        eventName += event.fields.competing_min_age + " & Over ";
    } else if (event.fields.competing_max_age) {
        eventName += event.fields.competing_max_age + " & Under ";
    } else {
        eventName += "Open ";
    }

    eventName += event.fields.distance + " " + event.fields.stroke + " ";

    if (event.fields.is_relay) {
        eventName += "Relay ";
    }

    eventName += event.fields.stage;

    return eventName;
}

export function generateIndividualEntryName(individual_entry: IndividualEntry) {
    let entryName = "";
    
    if (individual_entry.fields.swimmer.fields.first_name.endsWith("s")) {
        entryName += individual_entry.fields.swimmer.fields.first_name + "' ";
    } else {
        entryName += individual_entry.fields.swimmer.fields.first_name + "'s ";
    }

    entryName += generateSeedTimeString(individual_entry.fields.seed_time) + " Entry";

    return entryName;
}

export function generateRelayEntryName(relay_entry: RelayEntry) {
    let entryName = "";

    const swimmersList = relay_entry.fields.relay_assignments;
    for (let i = 0; i < swimmersList.length - 1; ++i) {
        entryName += swimmersList[i].fields.swimmer.fields.first_name + ", "
    }

    entryName += "and ";
    
    if (swimmersList[swimmersList.length - 1].fields.swimmer.fields.first_name.endsWith("s")) {
        entryName += swimmersList[swimmersList.length - 1].fields.swimmer.fields.first_name + "' ";
    } else {
        entryName += swimmersList[swimmersList.length - 1].fields.swimmer.fields.first_name + "'s ";
    }

    entryName += generateSeedTimeString(relay_entry.fields.seed_time) + " Entry";

    return entryName;
}

export function generateSeedTimeString(hundredths: number) {
    const hours = Math.floor(hundredths / 360000);
    hundredths %= 360000;

    const minutes = Math.floor(hundredths / 6000);
    hundredths %= 6000;

    const seconds = Math.floor(hundredths / 100);
    hundredths %= 100;

    let seed_string = "";

    for (const amountTuple of [[hours, ':'], [minutes, ":"], [seconds, "."], [hundredths, ""]]) {
        if (amountTuple[0] as number > 0 && amountTuple[0] as number < 10) {
            seed_string += "0";
        }
        seed_string += (amountTuple[0] as number).toString() + amountTuple[1] as string;
    }

    return seed_string;
}