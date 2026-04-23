import type { Calendar as ExpoCalendar } from "expo-localization";

import { CalendarIdentifier, Weekday } from "@/lib/generated/prisma/enums";

const CalendarIdentifierMap: Record<
    NonNullable<ExpoCalendar["calendar"]>,
    CalendarIdentifier
> = {
    buddhist: CalendarIdentifier.BUDDHIST,
    chinese: CalendarIdentifier.CHINESE,
    coptic: CalendarIdentifier.COPTIC,
    dangi: CalendarIdentifier.DANGI,
    ethioaa: CalendarIdentifier.ETHIOAA,
    ethiopic: CalendarIdentifier.ETHIOPIC,
    gregory: CalendarIdentifier.GREGORY,
    hebrew: CalendarIdentifier.HEBREW,
    indian: CalendarIdentifier.INDIAN,
    islamic: CalendarIdentifier.ISLAMIC,
    "islamic-civil": CalendarIdentifier.ISLAMIC_CIVIL,
    "islamic-rgsa": CalendarIdentifier.ISLAMIC_RGSA,
    "islamic-tbla": CalendarIdentifier.ISLAMIC_TBLA,
    "islamic-umalqura": CalendarIdentifier.ISLAMIC_UMALQURA,
    iso8601: CalendarIdentifier.ISO8601,
    japanese: CalendarIdentifier.JAPANESE,
    persian: CalendarIdentifier.PERSIAN,
    roc: CalendarIdentifier.ROC
};

const WeekdayMap: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, Weekday> = {
    1: Weekday.SUNDAY,
    2: Weekday.MONDAY,
    3: Weekday.TUESDAY,
    4: Weekday.WEDNESDAY,
    5: Weekday.THURSDAY,
    6: Weekday.FRIDAY,
    7: Weekday.SATURDAY
};

export function toCalendarIdentifier(value: ExpoCalendar["calendar"]) {
    if (!value) {
        return null;
    }

    return CalendarIdentifierMap[value];
}

export function toWeekday(value: ExpoCalendar["firstWeekday"]) {
    if (!value || !(value in WeekdayMap)) {
        return null;
    }

    return WeekdayMap[value as keyof typeof WeekdayMap];
}
