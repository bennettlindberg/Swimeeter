import { Host, Event, IndividualEntry, RelayEntry, Swimmer, SwimmerShallow, EventShallow } from "./modelTypes";

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

export function generateSwimmerName(swimmer: Swimmer | SwimmerShallow) {
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

function generateDistanceWithUnits(event: Event) {
    const pool = event.fields.session.fields.pool;

    let distanceStr = event.fields.distance + " ";

    if (pool.fields.side_length == 50) {
        distanceStr += "LC ";
    } else if (pool.fields.side_length == 25) {
        distanceStr += "SC ";
    }

    distanceStr += pool.fields.measure_unit;

    return distanceStr;
}

export function generateEventName(event: Event) {
    let eventName = event.fields.competing_gender + " ";

    if (event.fields.competing_min_age && event.fields.competing_max_age) {
        if (event.fields.competing_min_age === event.fields.competing_max_age) {
            eventName += event.fields.competing_min_age + " Years Old ";
        } else {
            eventName += event.fields.competing_min_age + "-" + event.fields.competing_max_age + " Years Old ";
        }
    } else if (event.fields.competing_min_age) {
        eventName += event.fields.competing_min_age + " & Over ";
    } else if (event.fields.competing_max_age) {
        eventName += event.fields.competing_max_age + " & Under ";
    } else {
        eventName += "Open ";
    }

    eventName += generateDistanceWithUnits(event) + " " + event.fields.stroke + " ";

    if (event.fields.is_relay) {
        eventName += "Relay ";
    }

    eventName += event.fields.stage;

    return eventName;
}

export function generateEventNameShallow(event: EventShallow) {
    let eventName = event.fields.competing_gender + " ";

    if (event.fields.competing_min_age && event.fields.competing_max_age) {
        if (event.fields.competing_min_age === event.fields.competing_max_age) {
            eventName += event.fields.competing_min_age + " Years Old ";
        } else {
            eventName += event.fields.competing_min_age + "-" + event.fields.competing_max_age + " Years Old ";
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

export function generateRelayParticipantNames(relay_entry: RelayEntry) {
    let participantNames = "";

    const swimmersList = relay_entry.fields.relay_assignments;
    if (swimmersList.length === 1) {
        return swimmersList[0].fields.swimmer.fields.first_name;
    } else if (swimmersList.length === 2) {
        return swimmersList[0].fields.swimmer.fields.first_name + " and " + swimmersList[1].fields.swimmer.fields.first_name;
    } else {
        for (let i = 0; i < swimmersList.length - 1; ++i) {
            participantNames += swimmersList[i].fields.swimmer.fields.first_name + ", "
        }
        return participantNames + "and " + swimmersList[swimmersList.length - 1].fields.swimmer.fields.first_name;
    }
}

export function generateRelayEntryName(relay_entry: RelayEntry) {
    if (relay_entry.pk === -1) {
        return "";
    }

    let entryName = "";

    const swimmersList = relay_entry.fields.relay_assignments;
    if (swimmersList.length === 1) {
        entryName = swimmersList[0].fields.swimmer.fields.first_name;
    } else if (swimmersList.length === 2) {
        entryName = swimmersList[0].fields.swimmer.fields.first_name + " and " + swimmersList[1].fields.swimmer.fields.first_name;
    } else {
        for (let i = 0; i < swimmersList.length - 1; ++i) {
            entryName += swimmersList[i].fields.swimmer.fields.first_name + ", "
        }
        entryName += "and " + swimmersList[swimmersList.length - 1].fields.swimmer.fields.first_name;
    }

    if (swimmersList[swimmersList.length - 1].fields.swimmer.fields.first_name.endsWith("s")) {
        entryName += "' ";
    } else {
        entryName += "'s ";
    }

    entryName += generateSeedTimeString(relay_entry.fields.seed_time) + " Entry";

    return entryName;
}

export function generateSeedTimeElements(hundredths: number) {
    const hours = Math.floor(hundredths / 360000);
    hundredths %= 360000;

    const minutes = Math.floor(hundredths / 6000);
    hundredths %= 6000;

    const seconds = Math.floor(hundredths / 100);
    hundredths %= 100;

    const defaults = {
        hours: "",
        minutes: "",
        seconds: "",
        decimal: ""
    };

    // * hours
    if (hours === 0) {
        ;
    } else {
        defaults.hours = "" + hours;
    }

    // * minutes
    if (minutes === 0 && hours === 0) {
        ;
    } else if (minutes < 10 && hours !== 0) {
        defaults.minutes = "0" + minutes;
    } else {
        defaults.minutes = "" + minutes;
    }

    // * seconds
    if (seconds < 10 && (hours !== 0 || minutes !== 0)) {
        defaults.seconds = "0" + seconds;
    } else {
        defaults.seconds = "" + seconds;
    }

    // * hundredths
    if (hundredths < 10) {
        defaults.decimal = "0" + hundredths;
    } else {
        defaults.decimal = "" + hundredths;
    }

    return defaults;
}

export function generateSeedTimeString(hundredths: number) {
    const hours = Math.floor(hundredths / 360000);
    hundredths %= 360000;

    const minutes = Math.floor(hundredths / 6000);
    hundredths %= 6000;

    const seconds = Math.floor(hundredths / 100);
    hundredths %= 100;

    let seed_string = "";

    // * hours
    if (hours === 0) {
        ;
    } else {
        seed_string += hours + ":";
    }

    // * minutes
    if (minutes === 0 && seed_string === "") {
        ;
    } else if (minutes < 10 && seed_string !== "") {
        seed_string += "0" + minutes + ":";
    } else {
        seed_string += minutes + ":";
    }

    // * seconds
    if (seconds < 10 && seed_string !== "") {
        seed_string += "0" + seconds + ".";
    } else {
        seed_string += seconds + ".";
    }

    // * hundredths
    if (hundredths < 10) {
        seed_string += "0" + hundredths;
    } else {
        seed_string += hundredths;
    }

    return seed_string;
}

export function generateLocalTimeElements(UTCDate: string) {
    // * produce UTC offset string
    let UTCOffsetString = "";
    const rawOffsetMinutes = new Date().getTimezoneOffset();

    UTCOffsetString += rawOffsetMinutes > 0 ? "-" : "+";

    const offsetHours = Math.floor(Math.abs(rawOffsetMinutes) / 60);
    UTCOffsetString += (offsetHours < 10 ? "0" : "") + offsetHours + ":";

    const offsetMinutes = Math.abs(rawOffsetMinutes) % 60;
    UTCOffsetString += (offsetMinutes < 10 ? "0" : "") + offsetMinutes;

    // * produce local ISO format date string
    let trueLocalString = UTCDate.substring(0, UTCDate.length - 1);
    trueLocalString += UTCOffsetString;

    // $ determine if daylight savings time is active
    const noDSTLocalDate = new Date(trueLocalString);

    const localDate = new Date(UTCDate);
    if (noDSTLocalDate.getHours() !== parseInt(trueLocalString.substring(11, 13))) {
        localDate.setTime(localDate.getTime() + 60*60*1000);
    }

    // ~ get month
    let month = "January"
    switch (localDate.getMonth()) {
        case 0:
            month = "January";
            break;

        case 1:
            month = "February";
            break;

        case 2:
            month = "March";
            break;

        case 3:
            month = "April";
            break;

        case 4:
            month = "May";
            break;

        case 5:
            month = "June";
            break;

        case 6:
            month = "July";
            break;

        case 7:
            month = "August";
            break;

        case 8:
            month = "September";
            break;

        case 9:
            month = "October";
            break;

        case 10:
            month = "November";
            break;

        case 11:
            month = "December";
            break;
    }

    // ~ get day
    const day = "" + localDate.getDate();

    // ~ get year
    const year = "" + localDate.getFullYear();

    // ~ get minutes
    const minutes = (localDate.getMinutes() < 10 ? "0" : "") + localDate.getMinutes();

    // ~ get hours and AMPM
    const hour_INT = localDate.getHours();
    let hours = "12";
    let AMPM = "AM";
    if (hour_INT === 0) {
        hours = "12";
        AMPM = "AM";
    } else if (hour_INT > 0 && hour_INT < 12) {
        hours = "" + hour_INT;
        AMPM = "AM";
    } else if (hour_INT === 12) {
        hours = "12";
        AMPM = "PM";
    } else {
        hours = "" + (hour_INT - 12);
        AMPM = "PM";
    }

    return {
        month: month,
        day: day,
        year: year,
        hours: hours,
        minutes: minutes,
        AMPM: AMPM
    }
}

export function generateLocalTimeString(UTCDate: string) {
    const elements = generateLocalTimeElements(UTCDate);

    // * build final local time string
    return `${elements.month} ${elements.day}, ${elements.year} at ${elements.hours}:${elements.minutes} ${elements.AMPM}`;
}

export function generateCompetitorsString(gender: string, minAge: number | null, maxAge: number | null) {
    let competitorsString = gender + " ";
    
    if (minAge && maxAge) {
        if (minAge === maxAge) {
            competitorsString += `${minAge} Years Old`
        } else {
            competitorsString += `${minAge}-${maxAge} Years Old`;
        }
    } else if (minAge) {
        competitorsString += `${minAge} & Over`;
    } else if (maxAge) {
        competitorsString += `${maxAge} & Under`;
    } else {
        competitorsString += "Open";
    }

    return competitorsString;
}