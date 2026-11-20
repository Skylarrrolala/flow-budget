// Will handle integer minor-unit amounts and USD or KHR display formatting.

/** Convert input like "12.50" to minor units "1250", Return NaN if input isn't a valid positive number. */
export function parseToMinor(input, currency = 'USD') {
    const num = parseFloat(input);
    if (isNaN(num) || num <= 0) return NaN;

    if (currency === 'KHR') {
        return Math.round(num);
    }
    return Math.round(num * 100);
}

/** Convert minor units back to display string.
 * formatMoney(1250, 'USD') => '$12.50'
 * formatMoney(25000, 'KHR') => '25000៛'
 */
export function formatMoney(minorUnits, currency = 'USD') {
    if (currency === 'KHR') {
        return `${minorUnits.toLocaleString()}៛`;
    }
    const dollars = minorUnits / 100;
    return `$${dollars.toFixed(2)}`;
}

/** Convert minor units to plain number for edit form
 * minorToInput(1250, 'USD') => '12.50'
 * minorToInput(25000, 'KHR') => '25000'
 */
export function minorToInput(minorUnits, currency = 'USD') {
    if (currency === 'KHR') {
        return String(minorUnits);
    }
    return (minorUnits / 100).toFixed(2);
}