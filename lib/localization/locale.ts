import type { Locale as ExpoLocale } from "expo-localization";

import {
    LocaleMeasurementSystem,
    LocaleTemperatureUnit,
    LocaleTextDirection
} from "@/lib/generated/prisma/enums";

const MeasurementSystemMap: Record<
    NonNullable<ExpoLocale["measurementSystem"]>,
    LocaleMeasurementSystem
> = {
    metric: LocaleMeasurementSystem.METRIC,
    uk: LocaleMeasurementSystem.UK,
    us: LocaleMeasurementSystem.US
};

const TemperatureUnitMap: Record<
    NonNullable<ExpoLocale["temperatureUnit"]>,
    LocaleTemperatureUnit
> = {
    celsius: LocaleTemperatureUnit.CELSIUS,
    fahrenheit: LocaleTemperatureUnit.FAHRENHEIT
};

export function toLocaleTextDirection(value: ExpoLocale["textDirection"]) {
    return value === "rtl" ? LocaleTextDirection.RTL : LocaleTextDirection.LTR;
}

export function toLocaleMeasurementSystem(
    value: ExpoLocale["measurementSystem"]
) {
    if (!value) {
        return null;
    }

    return MeasurementSystemMap[value];
}

export function toLocaleTemperatureUnit(
    value: ExpoLocale["temperatureUnit"]
) {
    if (!value) {
        return null;
    }

    return TemperatureUnitMap[value];
}
