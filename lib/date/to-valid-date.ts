export function toValidDate(value?: string | null) {
    if (!value) {
        return new Date();
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date() : date;
}
