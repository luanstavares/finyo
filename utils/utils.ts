import type { SyncUserCalendar, SyncUserLocale } from "@/lib/api/users";
import {
    CalendarIdentifier,
    LocaleMeasurementSystem,
    LocaleTemperatureUnit,
    LocaleTextDirection,
    Weekday
} from "@/lib/generated/prisma/enums";

export const utils = {
    format: {
        capitalize: (value: string, locale: string | Intl.Locale = "en-GB") =>
            value.replace(/\b\p{L}/gu, (letter) =>
                letter.toLocaleUpperCase(locale)
            ),
        toDate: (value?: string | null) => {
            if (!value) {
                return new Date();
            }

            const date = new Date(value);
            return Number.isNaN(date.getTime()) ? new Date() : date;
        },
        toLocaleTemperatureUnit: (value: SyncUserLocale["temperatureUnit"]) => {
            switch (value) {
                case "celsius":
                    return LocaleTemperatureUnit.CELSIUS;
                case "fahrenheit":
                    return LocaleTemperatureUnit.FAHRENHEIT;
                default:
                    return null;
            }
        },
        toLocaleTextDirection: (value: SyncUserLocale["textDirection"]) => {
            return value === "rtl"
                ? LocaleTextDirection.RTL
                : LocaleTextDirection.LTR;
        },
        toLocaleMeasurementSystem: (
            value: SyncUserLocale["measurementSystem"]
        ) => {
            switch (value) {
                case "metric":
                    return LocaleMeasurementSystem.METRIC;
                case "uk":
                    return LocaleMeasurementSystem.UK;
                case "us":
                    return LocaleMeasurementSystem.US;
                default:
                    return null;
            }
        }
    },
    user: {
        normalizeUsername: (value: string | null | undefined) => {
            if (!value) {
                return null;
            }

            const normalized = value
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "_")
                .replace(/_+/g, "_")
                .replace(/^_+|_+$/g, "")
                .slice(0, 30);

            return normalized.length > 0 ? normalized : null;
        },
        fallbackUsername: (clerkUserId: string) => {
            const normalized = clerkUserId
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "")
                .slice(0, 22);

            return `user_${normalized || "account"}`.slice(0, 30);
        },
        toCalendarIdentifier: (value: SyncUserCalendar["calendar"]) => {
            if (!value) {
                return null;
            }

            const calendarIdentifierMap: Record<
                NonNullable<SyncUserCalendar["calendar"]>,
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

            return calendarIdentifierMap[value];
        },
        toWeekday: (value: SyncUserCalendar["firstWeekday"]) => {
            switch (value) {
                case 1:
                    return Weekday.SUNDAY;
                case 2:
                    return Weekday.MONDAY;
                case 3:
                    return Weekday.TUESDAY;
                case 4:
                    return Weekday.WEDNESDAY;
                case 5:
                    return Weekday.THURSDAY;
                case 6:
                    return Weekday.FRIDAY;
                case 7:
                    return Weekday.SATURDAY;
                default:
                    return null;
            }
        },
        buildLocaleData: (locale: SyncUserLocale) => {
            return {
                languageTag: locale.languageTag,
                languageCode: locale.languageCode,
                languageScriptCode: locale.languageScriptCode,
                regionCode: locale.regionCode,
                languageRegionCode: locale.languageRegionCode,
                currencyCode: locale.currencyCode,
                currencySymbol: locale.currencySymbol,
                languageCurrencyCode: locale.languageCurrencyCode,
                languageCurrencySymbol: locale.languageCurrencySymbol,
                decimalSeparator: locale.decimalSeparator,
                digitGroupingSeparator: locale.digitGroupingSeparator,
                textDirection: utils.format.toLocaleTextDirection(
                    locale.textDirection
                ),
                measurementSystem: utils.format.toLocaleMeasurementSystem(
                    locale.measurementSystem
                ),
                temperatureUnit: utils.format.toLocaleTemperatureUnit(
                    locale.temperatureUnit
                )
            };
        },
        buildCalendarData: (calendar: SyncUserCalendar) => {
            return {
                calendar: utils.user.toCalendarIdentifier(calendar.calendar),
                uses24hourClock: calendar.uses24hourClock,
                firstWeekday: utils.user.toWeekday(calendar.firstWeekday),
                timeZone: calendar.timeZone
            };
        }
    }
};
