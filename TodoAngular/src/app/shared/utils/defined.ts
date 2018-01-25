/**
 * NotDefined
 * @param value
 * @returns {boolean}
 */
export function NotDefined(value: any) {
    return typeof value === 'undefined';
}


/**
 *
 * @param value
 * @returns {boolean}
 * @constructor
 */
export function Defined(value: any) {
    return !NotDefined(value);
}
