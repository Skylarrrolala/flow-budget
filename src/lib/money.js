// Will handle integer minor-unit amounts and USD or KHR display formatting.

/** Convert positive amounts to minor units. KHR input must be whole riel. */
export function parseToMinor(input, currency = 'USD') {
    const num = parseFloat(input);
    if (isNaN(num) || num <= 0) return NaN;

    if (currency === 'KHR') {
        return Number.isInteger(num) ? num : NaN;
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
